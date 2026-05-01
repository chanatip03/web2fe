"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Cookies from "js-cookie";
import { assignmentService, projectService } from "@/services/controller";
import type { Assignment, PlagiarismComparison } from "@/domain/assignment";
import type { Project } from "@/domain/project";
import TestResultFull from "./result_full";
import TestResultFeBe from "./result_fe_be";
import type { TestResultPageData, TestcaseCaseResult } from "./types";

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
  if (!Array.isArray(cases)) {
    const total = toNumber(testcaseResult?.total) ?? 0;
    const passed = toNumber(testcaseResult?.passed) ?? 0;
    const failed = toNumber(testcaseResult?.failed) ?? 0;

    if (total <= 0) return [];

    return Array.from({ length: total }, (_, index) => {
      const status = index < failed ? "failed" : index < failed + passed ? "passed" : "unknown";
      return {
        id: `summary-case-${index + 1}`,
        name: `Test case ${index + 1}`,
        status,
        message: "Download log.html for the full Robot Framework details.",
        durationSeconds: null,
        line: null,
        suiteName: null,
      };
    });
  }

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

function toBackendUrl(path?: string | null): string | null {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  const apiBase = process.env.NEXT_PUBLIC_API_URL;
  if (!apiBase) return path;

  const origin = apiBase.endsWith("/api") ? apiBase.slice(0, -4) : apiBase;
  return `${origin}${path.startsWith("/") ? path : `/${path}`}`;
}

function getStoredArtifactUrl(
  testcaseResult: Record<string, unknown> | null,
  submissionUuid: string | null | undefined,
  artifactName: string
): string | null {
  const artifactUrls = asRecord(testcaseResult?.artifact_urls);
  const mapped = artifactUrls?.[artifactName];
  if (typeof mapped === "string" && mapped.trim()) {
    return toBackendUrl(mapped);
  }

  const directKey =
    artifactName === "log.html"
      ? testcaseResult?.log_url
      : artifactName === "output.xml"
        ? testcaseResult?.output_url
        : artifactName === "report.html"
          ? testcaseResult?.report_url
          : null;

  if (typeof directKey === "string" && directKey.trim()) {
    return toBackendUrl(directKey);
  }

  const artifacts = asRecord(testcaseResult?.artifacts);
  const artifactId = artifacts?.[artifactName];
  if (!submissionUuid || typeof artifactId !== "string" || !artifactId.trim()) {
    return null;
  }

  return toBackendUrl(`/api/submission/${submissionUuid}/artifacts/${artifactId}`);
}

function getCyberScanUrl(cybersecurityResult: Record<string, unknown> | null): string | null {
  const downloadUrl = cybersecurityResult?.download_url;
  if (typeof downloadUrl === "string" && downloadUrl.trim()) {
    return toBackendUrl(downloadUrl);
  }

  return null;
}

function getCyberScanSource(cybersecurityResult: Record<string, unknown> | null): "scan.json" | "summary" | "missing" {
  if (!cybersecurityResult) return "missing";
  if (Array.isArray(cybersecurityResult.issues) || typeof cybersecurityResult.type === "string") {
    return "scan.json";
  }
  return "summary";
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

function isFullstackAssignment(assignment: Assignment): boolean {
  const projectTypeName = assignment.project_type?.name?.trim().toLowerCase() || "";

  return (
    assignment.project_type?.id === 3 ||
    projectTypeName === "project" ||
    projectTypeName === "fullstack" ||
    projectTypeName.includes("fullstack")
  );
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

        const testcaseResult = parseJsonObject(project.testcase_result);
        const cybersecurityResult = parseJsonObject(project.cybersecurity_result);

        const testcaseLogUrl = getStoredArtifactUrl(testcaseResult, project.submission_uuid, "log.html");
        const testcaseOutputUrl = getStoredArtifactUrl(testcaseResult, project.submission_uuid, "output.xml");
        const cyberScanUrl = getCyberScanUrl(cybersecurityResult);
        const testcaseCases = normalizeTestcaseCases(testcaseResult);
        const cyberScanSource = getCyberScanSource(cybersecurityResult);

        setData({
          projectId,
          classroomName: Cookies.get("classroomName") || undefined,
          assignmentTitle: assignment.title,
          projectLabel: getProjectLabel(project),
          executionMode: project.env,
          isFullstack: isFullstackAssignment(assignment),
          testcaseResult,
          testcaseCases,
          testcaseLogUrl,
          testcaseOutputUrl,
          cyberScanData: cybersecurityResult,
          cyberScanUrl,
          cyberScanSource,
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

  const isFullstack = useMemo(() => data?.isFullstack === true, [data?.isFullstack]);

  if (isFullstack) {
    return <TestResultFull data={data} isLoading={loading} error={error} />;
  }

  return <TestResultFeBe data={data} isLoading={loading} error={error} />;
}
