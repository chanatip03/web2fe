import { IClassroomMemberRepository } from "./interface";

export class ClassroomMemberService {
  constructor(private readonly repository: IClassroomMemberRepository) {}

  async joinClassroom(code: string) {
    return this.repository.joinClassroom(code);
  }

  async getMembers(classroomId: number) {
    return this.repository.getMembers(classroomId);
  }

  async deleteMember(classroomId: number, studentId: number) {
    return this.repository.deleteMember(classroomId, studentId);
  }
}
