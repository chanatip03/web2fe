"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Cookies from "js-cookie";
import { assignmentService, projectService } from "@/services/controller";
import type { PlagiarismComparison } from "@/domain/assignment";
import type { Project } from "@/domain/project";
import TestResultFull from "./result_full";
import TestResultFeBe from "./result_febe";
import type { TestResultPageData } from "./types";

type SubmissionArtifact = {
  artifact_id: string;
  name: string;
  category: string;
  download_url?: string | null;
};

function parseJsonObject(value?: string | null): Record<string, unknown> | null {
  if (!value) return null;

  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

function toBackendUrl(path?: string | null): string | null {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  const apiBase = process.env.NEXT_PUBLIC_API_URL;
  if (!apiBase) return path;

  const origin = apiBase.endsWith("/api") ? apiBase.slice(0, -4) : apiBase;
  return `${origin}${path.startsWith("/") ? path : `/${path}`}`;
}

function getProjectLabel(project: Project): string {
  if (project.group_name) return project.group_name;
  if (project.students?.length === 1) {
    const student = project.students[0];
    return `${student.user.first_name} ${student.user.last_name}`.trim();
  }
  if (project.students?.length > 1) {
    return project.students
      .map((student) => `${student.user.first_name} ${student.user.last_name}`.trim())
      .join(", ");
  }
  return `Project ${project.id}`;
}

export default function Page() {
  const params = useParams();
  const projectId = Number(params?.id);

  const [data, setData] = useState<TestResultPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId || Number.isNaN(projectId)) {
      setError("Invalid project id");
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const project = await projectService.getProjectById(projectId);
        if (!project.assignment_id) {
          throw new Error("Project is missing assignment reference");
        }

        const assignment = await assignmentService.getAssignmentById(project.assignment_id);

        let artifacts: SubmissionArtifact[] = [];
        if (project.submission_uuid) {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/submission/${project.submission_uuid}/artifacts`,
            {
              method: "GET",
              credentials: "include",
            }
          );

          if (response.ok) {
            const payload = await response.json();
            artifacts = Array.isArray(payload?.artifacts) ? payload.artifacts : [];
          }
        }

        const logArtifact = artifacts.find(
          (artifact) => artifact.category === "testcase" && artifact.name === "log.html"
        );

        setData({
          projectId,
          classroomName: Cookies.get("classroomName") || undefined,
          assignmentTitle: assignment.title,
          projectLabel: getProjectLabel(project),
          executionMode: project.env,
          testcaseResult: parseJsonObject(project.testcase_result),
          cyberScanData: parseJsonObject(project.cybersecurity_result),
          plagiarismData: Array.isArray(assignment.plagiarism_result)
            ? (assignment.plagiarism_result as PlagiarismComparison[])
            : [],
          testcaseLogUrl: toBackendUrl(logArtifact?.download_url),
        });
      } catch (loadError) {
        const message = loadError instanceof Error ? loadError.message : "Failed to load test results";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [projectId]);

  const isFullstack = useMemo(() => data?.executionMode === "fullstack", [data?.executionMode]);

  if (isFullstack) {
    return <TestResultFull data={data} isLoading={loading} error={error} />;
  }

  return <TestResultFeBe data={data} isLoading={loading} error={error} />;
}
