import { IStudent } from "./student";

export interface Project {
  id: number;
  group_id?: number | null;
  submission_id?: string | null;
  submission_type: "file" | "github";
  project_source_url?: string | null;
  env: string;
  testcase_result?: string | null;
  cybersecurity_result?: string | null;
  score?: number | null;
  feedback?: string | null;
  students: IStudent[];
}

export interface ProjectUpdateGradingRequest {
  score?: number | null;
  feedback?: string | null;
}
