export type TestcaseCaseResult = {
  id: string;
  name: string;
  status: string;
  message: string | null;
  durationSeconds: number | null;
  line: number | null;
  suiteName: string | null;
};

export type PlagiarismRow = {
  student1: string;
  student2: string;
  avg_similarity: number;
};

export type TestResultPageData = {
  projectId: number;
  classroomName?: string;
  assignmentTitle: string;
  projectLabel: string;
  executionMode: string | null;
  isFullstack: boolean;
  testcaseResult: Record<string, unknown> | null;
  testcaseCases: TestcaseCaseResult[];
  testcaseLogUrl: string | null;
  testcaseOutputUrl: string | null;
  cyberScanData: Record<string, unknown> | null;
  cyberScanUrl: string | null;
  cyberScanSource: "scan.json" | "summary" | "missing";
  plagiarismData: PlagiarismRow[];
};
