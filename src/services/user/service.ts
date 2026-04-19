import { IUserRepository } from "./interface";
import { UpdateStudentRequest, UpdateTeacherRequest } from "@/domain/user";

export class UserService {
  constructor(private readonly userRepository: IUserRepository) { }

  async getUsers(role?: string) {
    return this.userRepository.getUsers(role);
  }

  async getCurrentUser() {
    return this.userRepository.getCurrentUser();
  }

  async updateStudent(userId: number, data: UpdateStudentRequest, previewImage?: File | null) {
    const formData = new FormData();
    if (data.first_name) formData.append("first_name", data.first_name);
    if (data.last_name) formData.append("last_name", data.last_name);
    if (data.email) formData.append("email", data.email);
    if (data.academy) formData.append("academy", data.academy);
    if (data.password) formData.append("password", data.password);
    if (data.student_id) formData.append("student_id", data.student_id);
    if (previewImage instanceof File) formData.append("image_url", previewImage);

    return this.userRepository.updateStudent(userId, formData);
  }

  async updateTeacher(userId: number, data: UpdateTeacherRequest, previewImage?: File | null) {

    const formData = new FormData();
    if (data.first_name) formData.append("first_name", data.first_name);
    if (data.last_name) formData.append("last_name", data.last_name);
    if (data.email) formData.append("email", data.email);
    if (data.academy) formData.append("academy", data.academy);
    if (data.password) formData.append("password", data.password);
    if (previewImage instanceof File) formData.append("image_url", previewImage);

    return this.userRepository.updateTeacher(userId, formData);
  }

  async deleteUser(userId: number) {
    return this.userRepository.deleteUser(userId);
  }
}
