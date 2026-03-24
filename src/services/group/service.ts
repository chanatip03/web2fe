import { IGroupRepository } from "./interface";
import { CreateGroupRequest, UpdateGroupRequest } from "@/domain/group";

export class GroupService {
  constructor(private readonly groupRepository: IGroupRepository) {}

  async getMyGroup(assignmentId: number) {
    return this.groupRepository.getMyGroup(assignmentId);
  }

  async createGroup(data: CreateGroupRequest) {
    return this.groupRepository.createGroup(data);
  }

  async updateGroup(groupId: number, data: UpdateGroupRequest) {
    return this.groupRepository.updateGroup(groupId, data);
  }

  async getAvailableMembers(assignmentId: number, classroomId: number) {
    return this.groupRepository.getAvailableMembers(assignmentId, classroomId);
  }
}
