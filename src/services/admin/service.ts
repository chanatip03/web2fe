import { IAdminRepository } from "./interface";

export class AdminService {
  constructor(private readonly adminRepository: IAdminRepository) {}

  /* ─── Container ─────────────────────────────────────── */

  async getContainers() {
    return this.adminRepository.getContainers();
  }

  async stopContainer(id: string) {
    return this.adminRepository.stopContainer(id);
  }

  /* ─── Student ───────────────────────────────────────── */

  async getStudents(search?: string) {
    return this.adminRepository.getStudents(search);
  }

  async deleteStudent(id: number) {
    return this.adminRepository.deleteStudent(id);
  }

  /* ─── Teacher ───────────────────────────────────────── */

  async getTeachers(search?: string) {
    return this.adminRepository.getTeachers(search);
  }

  async deleteTeacher(id: number) {
    return this.adminRepository.deleteTeacher(id);
  }

  /* ─── Teacher Request ───────────────────────────────── */

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
