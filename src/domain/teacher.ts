import { User } from "./user";

export interface Teacher {
  id: string;
  certificateUrl: string;
  isApproved: boolean;
  user: User;
}