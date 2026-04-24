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
    const url = `${BASE_URL}/classroommember/${classroomId}?student_id=${studentId}`;
    const res = await fetch(url, {
      method: "DELETE",
      credentials: "include",
    });

    if (res.ok) {
      if (res.status === 204) {
        return Promise.resolve({} as IClassroomMember);
      }
      return res.json();
    }

    const data = await res.json().catch(() => ({}));
    const errorMessage = data.detail || data.error || data.message || "Failed to delete classroom member";

    // Treat already-deleted / already-missing member responses as success,
    // because delete is idempotent and the student is already removed from the classroom.
    if (
      (res.status === 400 || res.status === 404 || res.status === 422) &&
      (Object.keys(data).length === 0 ||
        /not in the classroom|not found|already removed|validation error|DetachedInstanceError/i.test(errorMessage))
    ) {
      return Promise.resolve({} as IClassroomMember);
    }

    throw new Error(errorMessage);
  }
}
