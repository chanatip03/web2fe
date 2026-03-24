import { User } from "./user";

export interface IStudent {
  id: number;
  studentId?: string;
  student_id: string;
  user: User;
}