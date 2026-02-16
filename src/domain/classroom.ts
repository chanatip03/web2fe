import { IStudent } from "./student";

export interface IClassroom {
  id: number;
  name: string;
  description: string;
  semester: string;
  code: string;
  excelLink: string;
  learningOutcome: string;
}

export interface IClassroomMember {
  id: number;
  classroom: IClassroom;
  student: IStudent[];
}
