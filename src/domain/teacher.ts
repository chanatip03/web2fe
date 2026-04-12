import { User } from "./user";

export interface Teacher {
  id: number;
  certificateUrl: string;
  isApproved: boolean;
  user: User;
}