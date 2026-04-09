import type {
  Container,
  AdminStudent,
  AdminTeacher,
  AdminTeacherRequest,
} from "@/domain/admin";
import { IAdminRepository } from "./interface";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export class AdminRepository implements IAdminRepository {
  async getContainers(): Promise<Container[]> {
    const res = await fetch(`${BASE_URL}/admin/containers`, {
      method: "GET",
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch containers: ${res.status}`);
    }
    return res.json();
  }

  async stopContainer(id: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/admin/containers/${id}/stop`, {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error(`Failed to stop container: ${res.status}`);
    }
  }

  async getStudents(search?: string): Promise<AdminStudent[]> {
    const query = search ? `?search=${encodeURIComponent(search)}` : "";
    const res = await fetch(`${BASE_URL}/admin/students${query}`, {
      method: "GET",
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch students: ${res.status}`);
    }
    return res.json();
  }

  async deleteStudent(id: number): Promise<void> {
    const res = await fetch(`${BASE_URL}/admin/students/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error(`Failed to delete student: ${res.status}`);
    }
  }

  async getTeachers(search?: string): Promise<AdminTeacher[]> {
    const query = search ? `?search=${encodeURIComponent(search)}` : "";
    const res = await fetch(`${BASE_URL}/admin/teachers${query}`, {
      method: "GET",
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch teachers: ${res.status}`);
    }
    return res.json();
  }

  async deleteTeacher(id: number): Promise<void> {
    const res = await fetch(`${BASE_URL}/admin/teachers/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error(`Failed to delete teacher: ${res.status}`);
    }
  }

  async getTeacherRequests(search?: string): Promise<AdminTeacherRequest[]> {
    const query = search ? `?search=${encodeURIComponent(search)}` : "";
    const res = await fetch(`${BASE_URL}/admin/teacher-requests${query}`, {
      method: "GET",
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch teacher requests: ${res.status}`);
    }
    return res.json();
  }

  async approveRequest(id: number): Promise<void> {
    const res = await fetch(`${BASE_URL}/admin/teacher-requests/${id}/approve`, {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error(`Failed to approve request: ${res.status}`);
    }
  }

  async rejectRequest(id: number): Promise<void> {
    const res = await fetch(`${BASE_URL}/admin/teacher-requests/${id}/reject`, {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error(`Failed to reject request: ${res.status}`);
    }
  }
}
