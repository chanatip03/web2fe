import { IClassroomMember } from "@/domain/classroom";

export interface IClassroomMemberRepository {
  joinClassroom(code: string): Promise<IClassroomMember>;
  getMembers(classroomId: number): Promise<IClassroomMember[]>;
  deleteMember(classroomId: number, studentId: number): Promise<IClassroomMember>;
}
