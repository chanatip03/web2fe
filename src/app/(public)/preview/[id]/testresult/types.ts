import type { PlagiarismComparison } from "@/domain/assignment";

export type TestResultPageData = {
  projectId: number;
  classroomName?: string;
  assignmentTitle: string;
  projectLabel: string;
  executionMode: string;
  testcaseResult: Record<string, unknown> | null;
  cyberScanData: Record<string, unknown> | null;
  plagiarismData: PlagiarismComparison[];
  testcaseLogUrl: string | null;
};