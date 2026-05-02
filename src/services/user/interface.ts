import { User, UpdateStudentRequest, UpdateTeacherRequest} from "@/domain/user";
import { IStudent } from "@/domain/student";
import { Teacher } from "@/domain/teacher";
import { AdminStudent, AdminTeacher, Container, AdminTeacherRequest, ContainerDetails } from "@/domain/admin";

export interface IUserRepository {
  getUsers(role?: string): Promise<User[]>;
  getAdminStudents(search?: string): Promise<AdminStudent[]>;
  getAdminTeachers(search?: string): Promise<AdminTeacher[]>;
  getCurrentUser(): Promise<IStudent | Teacher | User>;
  updateStudent(userId: number, data: FormData): Promise<IStudent>;
  updateTeacher(userId: number, data: FormData): Promise<Teacher>;
  deleteUser(userId: number): Promise<void>;
  getContainers(): Promise<Container[]>;
  getContainerDetails(id: string): Promise<ContainerDetails>;
  startContainer(id: string): Promise<void>;
  stopContainer(id: string): Promise<void>;
  deleteContainer(id: string): Promise<void>;
  getTeacherRequests(search?: string): Promise<AdminTeacherRequest[]>;
  approveRequest(id: number): Promise<void>;
  rejectRequest(id: number): Promise<void>;
  resetPassword(data: {
    email: string;
    new_password: string;
  }): Promise<string>;
  changePassword(data: {
    old_password: string;
    new_password: string;
  }): Promise<string>;
}
