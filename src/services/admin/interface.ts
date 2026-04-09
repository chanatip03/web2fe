import type {
  Container,
  AdminStudent,
  AdminTeacher,
  AdminTeacherRequest,
} from "@/domain/admin";

export interface IAdminRepository {
  getContainers(): Promise<Container[]>;
  stopContainer(id: string): Promise<void>;
  getStudents(search?: string): Promise<AdminStudent[]>;
  deleteStudent(id: number): Promise<void>;
  getTeachers(search?: string): Promise<AdminTeacher[]>;
  deleteTeacher(id: number): Promise<void>;
  getTeacherRequests(search?: string): Promise<AdminTeacherRequest[]>;
  approveRequest(id: number): Promise<void>;
  rejectRequest(id: number): Promise<void>;
}
