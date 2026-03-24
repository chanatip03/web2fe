import { Teacher } from "./teacher";
import { IStudent } from "./student";

export interface Classroom {
  id: string;
  name: string;
  semester: string;
  description?: string;
  learningoutcomes?: string;
  code:string
  teacher: Teacher;
}

export interface CreateClassRoomRequest {
  name: string;
  semester: string;
  description?: string;
  learningoutcomes?: string;
}

export interface UpdateClassRoomRequest {
  name?: string;
  semester?: string;
  year?: number;
  description?: string;
  learningoutcomes?: string;
}

export interface IClassroomMember {
  id: number;
  classroom_id: number;
  student: IStudent;
}
