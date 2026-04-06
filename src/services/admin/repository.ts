import type {
  Container,
  AdminStudent,
  AdminTeacher,
  AdminTeacherRequest,
} from "@/domain/admin";
import { IAdminRepository } from "./interface";
import {
  mockContainers,
  mockStudents,
  mockTeachers,
  mockTeacherRequests,
} from "./mockData";

/**
 * Mock repository — returns static data.
 * Replace the body of each method with a real `fetch()` call
 * when the backend API is ready (see AuthRepository for reference).
 */
export class AdminRepository implements IAdminRepository {
  /* ─── Container ─────────────────────────────────────── */

  async getContainers(): Promise<Container[]> {
    // TODO: replace with fetch(`${BASE_URL}/admin/containers`)
    return mockContainers;
  }

  async stopContainer(id: string): Promise<void> {
    // TODO: replace with fetch(`${BASE_URL}/admin/containers/${id}/stop`, { method: "POST" })
    console.log(`[mock] stopped container ${id}`);
  }

  /* ─── Student ───────────────────────────────────────── */

  async getStudents(search?: string): Promise<AdminStudent[]> {
    // TODO: replace with fetch(`${BASE_URL}/admin/students?search=${search}`)
    if (!search) return mockStudents;
    const q = search.toLowerCase();
    return mockStudents.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.studentId.includes(q) ||
        s.email.toLowerCase().includes(q),
    );
  }

  async deleteStudent(id: number): Promise<void> {
    // TODO: replace with fetch(`${BASE_URL}/admin/students/${id}`, { method: "DELETE" })
    console.log(`[mock] deleted student ${id}`);
  }

  /* ─── Teacher ───────────────────────────────────────── */

  async getTeachers(search?: string): Promise<AdminTeacher[]> {
    // TODO: replace with fetch(`${BASE_URL}/admin/teachers?search=${search}`)
    if (!search) return mockTeachers;
    const q = search.toLowerCase();
    return mockTeachers.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.email.toLowerCase().includes(q),
    );
  }

  async deleteTeacher(id: number): Promise<void> {
    // TODO: replace with fetch(`${BASE_URL}/admin/teachers/${id}`, { method: "DELETE" })
    console.log(`[mock] deleted teacher ${id}`);
  }

  /* ─── Teacher Request ───────────────────────────────── */

  async getTeacherRequests(search?: string): Promise<AdminTeacherRequest[]> {
    // TODO: replace with fetch(`${BASE_URL}/admin/teacher-requests?search=${search}`)
    if (!search) return mockTeacherRequests;
    const q = search.toLowerCase();
    return mockTeacherRequests.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q),
    );
  }

  async approveRequest(id: number): Promise<void> {
    // TODO: replace with fetch(`${BASE_URL}/admin/teacher-requests/${id}/approve`, { method: "POST" })
    console.log(`[mock] approved request ${id}`);
  }

  async rejectRequest(id: number): Promise<void> {
    // TODO: replace with fetch(`${BASE_URL}/admin/teacher-requests/${id}/reject`, { method: "POST" })
    console.log(`[mock] rejected request ${id}`);
  }
}
