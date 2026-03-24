import { Group, CreateGroupRequest, UpdateGroupRequest } from "@/domain/group";
import { IGroupRepository } from "./interface";
import { IStudent } from "@/domain/student";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export class GroupRepository implements IGroupRepository {
  async getMyGroup(assignmentId: number): Promise<Group | null> {
    const res = await fetch(`${BASE_URL}/group/my-group/${assignmentId}`, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) {
      if (res.status === 404) {
        return null; // User doesn't have a group yet
      }
      throw new Error("Failed to fetch group");
    }

    return res.json();
  }

  async createGroup(data: CreateGroupRequest): Promise<Group> {
    const res = await fetch(`${BASE_URL}/group/`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create group");
    return res.json();
  }

  async updateGroup(groupId: number, data: UpdateGroupRequest): Promise<Group> {
    const res = await fetch(`${BASE_URL}/group/${groupId}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update group");
    return res.json();
  }

  async getAvailableMembers(assignmentId: number, classroomId: number): Promise<IStudent[]> {
    const res = await fetch(`${BASE_URL}/group/available/${assignmentId}?classroom_id=${classroomId}`, {
      method: "GET",
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch available members");
    return res.json();
  }
}
