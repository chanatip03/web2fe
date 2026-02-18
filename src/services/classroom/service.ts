import { IClassroomRepository } from "./interface";
import { CreateClassRoomRequest , UpdateClassRoomRequest } from "@/domain/classroom";

export class ClassroomService {
    constructor(private readonly classroomRepository: IClassroomRepository) {}

    async getclassrooms() {
        return this.classroomRepository.getclassrooms();
    }

    async getclassroomById(classroomId: number) {
        return this.classroomRepository.getclassroomById(classroomId);
    }

    async createClassroom(data: CreateClassRoomRequest) {
        return this.classroomRepository.createClassroom(data);
    }

    async updateClassroom(data: UpdateClassRoomRequest, classroomId: number) {
        return this.classroomRepository.updateClassroom(data, classroomId);
    }
}