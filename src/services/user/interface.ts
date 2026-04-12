import { User, UpdateStudentRequest, UpdateTeacherRequest } from "@/domain/user";
import { IStudent } from "@/domain/student";
import { Teacher } from "@/domain/teacher";

export interface IUserRepository {
  getUsers(role?: string): Promise<User[]>;
  getCurrentUser(): Promise<IStudent | Teacher | User>;
  updateStudent(userId: number, data: FormData): Promise<IStudent>;
  updateTeacher(userId: number, data: FormData): Promise<Teacher>;
  deleteUser(userId: number): Promise<void>;
}
