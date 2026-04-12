import { IAdminRepository } from "./interface";
import { UpdateStudentRequest, UpdateTeacherRequest } from "@/domain/admin";

export class AdminService {
  constructor(private readonly adminRepository: IAdminRepository) {}

  async getContainers() {
    return this.adminRepository.getContainers();
  }

  async stopContainer(id: string) {
    return this.adminRepository.stopContainer(id);
  }

  async getStudents(search?: string) {
    return this.adminRepository.getStudents(search);
  }

  async updateStudent(id: number, data: UpdateStudentRequest) {
    return this.adminRepository.updateStudent(id, data);
  }

  async deleteStudent(id: number) {
    return this.adminRepository.deleteStudent(id);
  }

  async getTeachers(search?: string) {
    return this.adminRepository.getTeachers(search);
  }

  async updateTeacher(id: number, data: UpdateTeacherRequest) {
    return this.adminRepository.updateTeacher(id, data);
  }

  async deleteTeacher(id: number) {
    return this.adminRepository.deleteTeacher(id);
  }

  async getTeacherRequests(search?: string) {
    return this.adminRepository.getTeacherRequests(search);
  }

  async approveRequest(id: number) {
    return this.adminRepository.approveRequest(id);
  }

  async rejectRequest(id: number) {
    return this.adminRepository.rejectRequest(id);
  }
}
