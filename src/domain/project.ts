import { IStudent } from "./student";

export interface Project {
  id: number;
  assignment_id?: number | null;
  group_id?: number | null;
  group_name?: string | null;
  submission_type: "file" | "github";
  submission_uuid?: string | null;
  project_source_url?: string | null;
  env: string;
  testcase_result?: string | null;
  cybersecurity_result?: string | null;
  score?: number | null;
  feedback?: string | null;
  is_late: boolean;
  created_date?: string | null;
  students: IStudent[];
}

export interface FileNode {
  name: string;
  type: "file" | "folder";
  path: string;
  children?: FileNode[] | null;
}

export interface ProjectSourceCode {
  projectTree: FileNode;
  files: Record<string, { code: string }>;
}

export interface ProjectUpdateGradingRequest {
  score?: number | null;
  feedback?: string | null;
}
