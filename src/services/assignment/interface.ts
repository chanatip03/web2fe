import { Assignment } from "@/domain/assignment";

export interface IAssignmentRepository {
  getAssignments(classroom_id:number): Promise<Assignment[]>;
  getAssignmentById(assignmentId: number): Promise<Assignment>;
  createAssignment(data: FormData): Promise<Assignment>;
  updateAssignment(data: FormData, assignmentId: number): Promise<Assignment>;
  deleteAssignment(assignmentId: number): Promise<Assignment>
}