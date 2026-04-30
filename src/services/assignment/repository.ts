import { Assignment} from "@/domain/assignment";
import { IAssignmentRepository } from "./interface";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export class AssignmentRepository implements IAssignmentRepository {
    async getAssignments(classroomId:number): Promise<Assignment[]> {
        const res = await fetch(`${BASE_URL}/assignment/?classroom_id=${classroomId}`, {
            method: "GET",
            credentials: "include",
        });
    return res.json();   
    }

    async getAssignmentById(assignmentId: number): Promise<Assignment> {
        const res = await fetch(`${BASE_URL}/assignment/${assignmentId}`, {
            method: "GET",
            credentials: "include",
        });
    return res.json();   
    }
    
    async createAssignment(data: FormData): Promise<Assignment> {
        const res = await fetch(`${BASE_URL}/assignment/`, {
            method: "POST",
            credentials: "include",
            body:data,
        });
        return res.json();
    }

    async updateAssignment(data: FormData, assignmentId: number): Promise<Assignment> {
        const res = await fetch(`${BASE_URL}/assignment/${assignmentId}`, {
            method: "PUT",
            credentials: "include",
            body: data,
        });    
        return res.json();
    }

    async deleteAssignment(assignmentId: number) {
        const res = await fetch(`${BASE_URL}/assignment/${assignmentId}`, {
            method: "DELETE",
            credentials: "include",
        });    
        return res.json();
    }
}