import { User, UpdateStudentRequest, UpdateTeacherRequest } from "@/domain/user";
import { IStudent } from "@/domain/student";
import { Teacher } from "@/domain/teacher";
import { IUserRepository } from "./interface";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export class UserRepository implements IUserRepository {
  async getUsers(role?: string): Promise<User[]> {
    const url = role ? `${BASE_URL}/user/?role=${role}` : `${BASE_URL}/user/`;
    const res = await fetch(url, {
      method: "GET",
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch users");
    return res.json();
  }

  async getCurrentUser(): Promise<IStudent | Teacher | User> {
    const res = await fetch(`${BASE_URL}/user/me`, {
      method: "GET",
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch current user");
    return res.json();
  }

  async updateStudent(userId: number, data: FormData): Promise<IStudent> {
    const res = await fetch(`${BASE_URL}/user/student/${userId}`, {
      method: "PUT",
      credentials: "include",
      body: data,
    });
    if (!res.ok) throw new Error("Failed to update student");
    return res.json();
  }

  async updateTeacher(userId: number, data: FormData): Promise<Teacher> {
    const res = await fetch(`${BASE_URL}/user/teacher/${userId}`, {
      method: "PUT",
      credentials: "include",
      body: data,
    });
    if (!res.ok) throw new Error("Failed to update teacher");
    return res.json();
  }

  async deleteUser(userId: number): Promise<void> {
    const res = await fetch(`${BASE_URL}/user/${userId}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to delete user");
  }

  async resetPassword(data: {email: string; new_password: string;}): Promise<string> {
    const res = await fetch(`${BASE_URL}/user/reset-password`, {
      method: "POST",
      headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Reset password failed");

    return res.json();
  }

  async changePassword(
    data: {old_password: string; new_password: string;}
  ): Promise<string> {
    const res = await fetch(`${BASE_URL}/user/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Change password failed");

    return res.json();
  }
}
