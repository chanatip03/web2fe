import { IAssignmentRepository } from "./interface";
import { CraeteAssignment, UpdateAssignment } from "@/domain/assignment";

export class AssignmentService {
    constructor(private readonly assignmentRepository: IAssignmentRepository) {}

    async getAssignments(classroomId:number) {
        return this.assignmentRepository.getAssignments(classroomId);
    }

    async getAssignmentById(assignmentId: number) {
        return this.assignmentRepository.getAssignmentById(assignmentId);
    }

    async createAssignment(data: CraeteAssignment,testcase?: File,attachment?: File[]) {
        const formData = new FormData();

        Object.entries(data).forEach(([key, value]) => {

        if (value === undefined || value === null) return;

        if (value instanceof Date) {
            formData.append(key, value.toISOString());
        } else {
            formData.append(key, String(value));
        }
    });

    if (testcase) {
        formData.append("testcase", testcase);
    }

    if (attachment && attachment.length > 0) {
        attachment.forEach((file) => {
        formData.append("attachment", file);
        });
    }
        return this.assignmentRepository.createAssignment(formData);
    }

    async updateAssignment(data: UpdateAssignment, assignmentId: number ,testcase?: File ,attachment?: File[]) {
        const formData = new FormData();

        Object.entries(data).forEach(([key, value]) => {
        if (value === undefined || value === null) return;

        if (Array.isArray(value)) {
            value.forEach((v) => formData.append(key, String(v)));
        } else {
            formData.append(key, String(value));
        }
    });

    if (testcase) {
        formData.append("testcase", testcase);
    }

    if (attachment?.length) {
        attachment.forEach((file) => {
        formData.append("attachment", file);
        });
    }
        return this.assignmentRepository.updateAssignment(formData, assignmentId);
    }

    async deleteAssignment(assignmentId: number) {
         return this.assignmentRepository.deleteAssignment(assignmentId);
    }
}