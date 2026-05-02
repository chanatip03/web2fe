export interface Language {
  id: number;
  name: string;
}

export interface ProjectType {
  id: number;
  name: string;
}

export interface Attachments {
  id: number;
  file_url: string;
}

export interface Submission {
  id: number;
  submitted_at: string | Date;
  status?: string;
  is_late?: boolean;
}

export interface PlagiarismComparison {
  student1: string;
  student2: string;
  avg_similarity: number;
}

export interface Assignment {
  id: number,
  title: string,
  description?: string,
  start_date: Date,
  due_date: Date,
  is_group: boolean,
  is_public: boolean,
  testcase_url: string,
  project_type: ProjectType,
  language: Language ,
  attachments: Attachments[],
  plagiarism_result?: PlagiarismComparison[] | null,
  submission?: Submission | null,
}


export interface CraeteAssignment {
  title: string,
  description?: string,
  start_date: string,
  due_date: string,
  is_group: boolean,
  project_type_id: number,
  language_id?: number,
  classroom_id: number,
}

export interface UpdateAssignment {
  title?: string,
  description?: string,
  start_date?: string,
  due_date?: string,
  is_group?: boolean,
  is_public?: boolean,
  project_type_id?: number,
  language_id?: number,
  classroom_id?: number,
  delete_attachment_ids?: number[],
}
