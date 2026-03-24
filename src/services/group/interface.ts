import { Group, CreateGroupRequest, UpdateGroupRequest } from "@/domain/group";
import { IStudent } from "@/domain/student";

export interface IGroupRepository {
  getMyGroup(assignmentId: number): Promise<Group | null>;
  createGroup(data: CreateGroupRequest): Promise<Group>;
  updateGroup(groupId: number, data: UpdateGroupRequest): Promise<Group>;
  getAvailableMembers(assignmentId: number, classroomId: number): Promise<IStudent[]>;
}
