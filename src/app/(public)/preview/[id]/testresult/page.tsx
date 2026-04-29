"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Cookies from "js-cookie";
import { assignmentService, projectService } from "@/services/controller";
import type { PlagiarismComparison } from "@/domain/assignment";
import type { Project } from "@/domain/project";
import TestResultFull from "./result_full";
import TestResultFeBe from "./result_febe";
import type { TestResultPageData, TestcaseCaseResult } from "./types";

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

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function toNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function toDurationSeconds(startTime: unknown, endTime: unknown): number | null {
  if (typeof startTime !== "string" || typeof endTime !== "string" || !startTime || !endTime) {
    return null;
  }

  const normalize = (value: string) => {
    const match = value.match(/^(\d{8})\s(\d{2}:\d{2}:\d{2}\.\d{3})$/);
    if (!match) return null;
    return `${match[1].slice(0, 4)}-${match[1].slice(4, 6)}-${match[1].slice(6, 8)}T${match[2]}`;
  };

  const startIso = normalize(startTime);
  const endIso = normalize(endTime);
  if (!startIso || !endIso) return null;

  const start = Date.parse(startIso);
  const end = Date.parse(endIso);
  if (Number.isNaN(start) || Number.isNaN(end) || end < start) return null;

  return (end - start) / 1000;
}

function normalizeTestcaseCases(testcaseResult: Record<string, unknown> | null): TestcaseCaseResult[] {
  const cases = testcaseResult?.case_results;
  if (!Array.isArray(cases)) return [];

  return cases.map((item, index) => {
    const row = asRecord(item);
    const name = typeof row?.name === "string" && row.name.trim() ? row.name.trim() : `Test case ${index + 1}`;
    const message = typeof row?.message === "string" && row.message.trim() ? row.message.trim() : null;
    return {
      id: `${name}-${index}`,
      name,
      status: typeof row?.status === "string" && row.status.trim() ? row.status.trim().toLowerCase() : "unknown",
      message,
      durationSeconds: toDurationSeconds(row?.start_time, row?.end_time),
      line: toNumber(row?.line),
      suiteName: typeof row?.suite_name === "string" && row.suite_name.trim() ? row.suite_name.trim() : null,
    };
  });
}

function getSuiteName(testElement: Element): string | null {
  let current = testElement.parentElement;
  while (current) {
    if (current.tagName === "suite") {
      const name = current.getAttribute("name");
      return name && name.trim() ? name.trim() : null;
    }
    current = current.parentElement;
  }
  return null;
}

function parseRobotOutputXml(xmlText: string): TestcaseCaseResult[] {
  if (typeof DOMParser === "undefined") return [];

  try {
    const document = new DOMParser().parseFromString(xmlText, "application/xml");
    if (document.getElementsByTagName("parsererror").length > 0) return [];

    return Array.from(document.getElementsByTagName("test")).map((testElement, index) => {
      const statusElement = Array.from(testElement.children).find((element) => element.tagName === "status") || null;
      const name = testElement.getAttribute("name")?.trim() || `Test case ${index + 1}`;
      const message = statusElement?.textContent?.trim() || null;

      return {
        id: `${name}-${index}`,
        name,
        status: statusElement?.getAttribute("status")?.trim().toLowerCase() || "unknown",
        message,
        durationSeconds: toDurationSeconds(
          statusElement?.getAttribute("starttime"),
          statusElement?.getAttribute("endtime")
        ),
        line: toNumber(testElement.getAttribute("line")),
        suiteName: getSuiteName(testElement),
      };
    });
  } catch {
    return [];
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
        let cyberScanFromArtifact: Record<string, unknown> | null = null;
        let testcaseCasesFromArtifact: TestcaseCaseResult[] = [];
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

        const testcaseResult = parseJsonObject(project.testcase_result);
        const cyberArtifact = artifacts.find(
          (artifact) => artifact.category === "cyber" && artifact.name === "scan.json"
        );
        const logArtifact = artifacts.find(
          (artifact) => artifact.category === "testcase" && artifact.name === "log.html"
        );
        const outputArtifact = artifacts.find(
          (artifact) => artifact.category === "testcase" && artifact.name === "output.xml"
        );

        if (cyberArtifact?.download_url) {
          const cyberResponse = await fetch(toBackendUrl(cyberArtifact.download_url) || cyberArtifact.download_url, {
            method: "GET",
            credentials: "include",
          });

          if (cyberResponse.ok) {
            const payload = await cyberResponse.json();
            cyberScanFromArtifact = asRecord(payload);
          }
        }

        if (outputArtifact?.download_url) {
          const outputResponse = await fetch(toBackendUrl(outputArtifact.download_url) || outputArtifact.download_url, {
            method: "GET",
            credentials: "include",
          });

          if (outputResponse.ok) {
            testcaseCasesFromArtifact = parseRobotOutputXml(await outputResponse.text());
          }
        }

        const testcaseCases = testcaseCasesFromArtifact.length > 0
          ? testcaseCasesFromArtifact
          : normalizeTestcaseCases(testcaseResult);

        setData({
          projectId,
          classroomName: Cookies.get("classroomName") || undefined,
          assignmentTitle: assignment.title,
          projectLabel: getProjectLabel(project),
          executionMode: project.env,
          testcaseResult,
          testcaseCases,
          testcaseLogUrl: toBackendUrl(logArtifact?.download_url),
          testcaseOutputUrl: toBackendUrl(outputArtifact?.download_url),
          cyberScanData: cyberScanFromArtifact ?? parseJsonObject(project.cybersecurity_result),
          cyberScanUrl: toBackendUrl(cyberArtifact?.download_url),
          plagiarismData: Array.isArray(assignment.plagiarism_result)
            ? (assignment.plagiarism_result as PlagiarismComparison[])
            : [],
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
