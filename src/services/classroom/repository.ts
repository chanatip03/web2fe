import { Classroom, CreateClassRoomRequest, UpdateClassRoomRequest } from "@/domain/classroom";
import { IClassroomRepository } from "./interface";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export class ClassroomRepository implements IClassroomRepository {
    async getclassrooms(): Promise<Classroom[]> {
        const res = await fetch(`${BASE_URL}/classroom`, {
            method: "GET",
            credentials: "include",
        });
    return res.json();   
    }

    async getclassroomById(classroomId: number): Promise<Classroom> {
        const res = await fetch(`${BASE_URL}/classroom/${classroomId}`, {
            method: "GET",
            credentials: "include",
        });
    return res.json();   
    }
    
    async createClassroom(data: CreateClassRoomRequest): Promise<Classroom> {
        const res = await fetch(`${BASE_URL}/classroom/`, {
            method: "POST",
             headers: {"Content-Type": "application/json",},
            credentials: "include",
            body: JSON.stringify(data),
        });
        return res.json();
    }

    async updateClassroom(data: UpdateClassRoomRequest, classroomId: number): Promise<Classroom> {
        const res = await fetch(`${BASE_URL}/classroom/${classroomId}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json",},
            credentials: "include",
            body: JSON.stringify(data),
        });    
        return res.json();
    }
}