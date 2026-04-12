import type { Container, AdminStudent, AdminTeacher, AdminTeacherRequest, UpdateStudentRequest, UpdateTeacherRequest } from "@/domain/admin";
import { IAdminRepository } from "./interface";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export class AdminRepository implements IAdminRepository {
  async getContainers(): Promise<Container[]> {
    const res = await fetch(`${BASE_URL}/admin/containers`, {
      method: "GET",
      credentials: "include",
    });
    if (!res.ok) throw new Error(`getContainers failed: ${res.status}`);
    return res.json();
  }

  async stopContainer(id: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/admin/containers/${id}/stop`, {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) throw new Error(`stopContainer failed: ${res.status}`);
  }

  async getStudents(search?: string): Promise<AdminStudent[]> {
    const query = search ? `?search=${search}` : "";
    const res = await fetch(`${BASE_URL}/admin/students${query}`, {
      method: "GET",
      credentials: "include",
    });
    if (!res.ok) throw new Error(`getStudents failed: ${res.status}`);
    return res.json();
  }

  async deleteStudent(id: number): Promise<void> {
    const res = await fetch(`${BASE_URL}/admin/students/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) throw new Error(`deleteStudent failed: ${res.status}`);
  }

  async updateStudent(id: number, data: UpdateStudentRequest): Promise<AdminStudent> {
    const res = await fetch(`${BASE_URL}/admin/students/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`updateStudent failed: ${res.status}`);
    return res.json();
  }

  async getTeachers(search?: string): Promise<AdminTeacher[]> {
    const query = search ? `?search=${search}` : "";
    const res = await fetch(`${BASE_URL}/admin/teachers${query}`, {
      method: "GET",
      credentials: "include",
    });
    if (!res.ok) throw new Error(`getTeachers failed: ${res.status}`);
    return res.json();
  }

  async deleteTeacher(id: number): Promise<void> {
    const res = await fetch(`${BASE_URL}/admin/teachers/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) throw new Error(`deleteTeacher failed: ${res.status}`);
  }

  async updateTeacher(id: number, data: UpdateTeacherRequest): Promise<AdminTeacher> {
    const res = await fetch(`${BASE_URL}/admin/teachers/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`updateTeacher failed: ${res.status}`);
    return res.json();
  }

  async getTeacherRequests(search?: string): Promise<AdminTeacherRequest[]> {
    const query = search ? `?search=${search}` : "";
    const res = await fetch(`${BASE_URL}/admin/teacher-requests${query}`, {
      method: "GET",
      credentials: "include",
    });
    if (!res.ok) throw new Error(`getTeacherRequests failed: ${res.status}`);
    return res.json();
  }

  async approveRequest(id: number): Promise<void> {
    const res = await fetch(`${BASE_URL}/admin/teacher-requests/${id}/approve`, {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) throw new Error(`approveRequest failed: ${res.status}`);
  }

  async rejectRequest(id: number): Promise<void> {
    const res = await fetch(`${BASE_URL}/admin/teacher-requests/${id}/reject`, {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) throw new Error(`rejectRequest failed: ${res.status}`);
  }
}
