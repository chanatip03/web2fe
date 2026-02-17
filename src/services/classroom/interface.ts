import {Classroom , CreateClassRoomRequest , UpdateClassRoomRequest} from "@/domain/classroom";

export interface IClassroomRepository {
  getclassrooms(): Promise<Classroom[]>;
  getclassroomById(classroomId: number): Promise<Classroom>;
  createClassroom(data: CreateClassRoomRequest): Promise<Classroom>;
  updateClassroom(data: UpdateClassRoomRequest, classroomId: number): Promise<Classroom>;
}