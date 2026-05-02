import { Assignment} from "@/domain/assignment";
import { IAssignmentRepository } from "./interface";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export class AssignmentRepository implements IAssignmentRepository {
    private async handleResponse<T>(res: Response): Promise<T> {
        const contentType = res.headers.get("content-type") || "";
        let responseBody: any = null;

        if (contentType.includes("application/json")) {
            responseBody = await res.json();
        }

        if (!res.ok) {
            const message =
                responseBody?.message ||
                responseBody?.detail ||
                responseBody?.error ||
                JSON.stringify(responseBody) ||
                `Request failed with status ${res.status}`;
            throw new Error(message);
        }

        return responseBody as T;
    }

    async getAssignments(classroomId:number): Promise<Assignment[]> {
        const res = await fetch(`${BASE_URL}/assignment/${classroomId}`, {
            method: "GET",
            credentials: "include",
        });
        return this.handleResponse<Assignment[]>(res);
    }

    async getAssignmentById(assignmentId: number): Promise<Assignment> {
        const res = await fetch(`${BASE_URL}/assignment/${assignmentId}`, {
            method: "GET",
            credentials: "include",
        });
        return this.handleResponse<Assignment>(res);
    }
    
    async createAssignment(data: FormData): Promise<Assignment> {
        const res = await fetch(`${BASE_URL}/assignment/`, {
            method: "POST",
            credentials: "include",
            body:data,
        });
        return this.handleResponse<Assignment>(res);
    }

    async updateAssignment(data: FormData, assignmentId: number): Promise<Assignment> {
        const res = await fetch(`${BASE_URL}/assignment/${assignmentId}`, {
            method: "PUT",
            credentials: "include",
            body: data,
        });    
        return this.handleResponse<Assignment>(res);
    }

    async deleteAssignment(assignmentId: number) {
        const res = await fetch(`${BASE_URL}/assignment/${assignmentId}`, {
            method: "DELETE",
            credentials: "include",
        });    
        return this.handleResponse<any>(res);
    }
}