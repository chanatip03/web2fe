import { IUser } from "./user";

export interface IStudent {
  id: number;
  studentId: string;
  user: IUser;
}