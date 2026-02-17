import { Teacher } from "./teacher";

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