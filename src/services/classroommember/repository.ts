import { IClassroomMember } from "@/domain/classroom";
import { IClassroomMemberRepository } from "./interface";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export class ClassroomMemberRepository implements IClassroomMemberRepository {
  async joinClassroom(code: string): Promise<IClassroomMember> {
    const res = await fetch(`${BASE_URL}/classroommember/?code=${code}`, {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.detail || "Failed to join classroom");
    }
    return res.json();
  }

  async getMembers(classroomId: number): Promise<IClassroomMember[]> {
    const res = await fetch(`${BASE_URL}/classroommember/${classroomId}`, {
      method: "GET",
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error("Failed to fetch classroom members");
    }
    return res.json();
  }

  async deleteMember(classroomId: number, studentId: number): Promise<IClassroomMember> {
    const res = await fetch(`${BASE_URL}/classroommember/${classroomId}?student_id=${studentId}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.detail || "Failed to delete classroom member");
    }
    return res.json();
  }
}
