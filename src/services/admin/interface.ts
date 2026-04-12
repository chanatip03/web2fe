import type { Container, AdminStudent, AdminTeacher, AdminTeacherRequest, UpdateStudentRequest, UpdateTeacherRequest } from "@/domain/admin";

export interface IAdminRepository {
  getContainers(): Promise<Container[]>;
  stopContainer(id: string): Promise<void>;

  getStudents(search?: string): Promise<AdminStudent[]>;
  updateStudent(id: number, data: UpdateStudentRequest): Promise<AdminStudent>;
  deleteStudent(id: number): Promise<void>;

  getTeachers(search?: string): Promise<AdminTeacher[]>;
  updateTeacher(id: number, data: UpdateTeacherRequest): Promise<AdminTeacher>;
  deleteTeacher(id: number): Promise<void>;

  getTeacherRequests(search?: string): Promise<AdminTeacherRequest[]>;
  approveRequest(id: number): Promise<void>;
  rejectRequest(id: number): Promise<void>;
}
