import { AuthService } from "./auth/service";
import { AuthRepository } from "./auth/repository";
import { ClassroomService } from "./classroom/service";
import { ClassroomRepository } from "./classroom/repository";
import { AssignmentService } from "./assignment/service";
import { AssignmentRepository } from "./assignment/repository";

const authRepository = new AuthRepository();
export const authService = new AuthService(authRepository);
const classroomRepository = new ClassroomRepository();
export const classroomService = new ClassroomService(classroomRepository);
const assignmentRepository = new AssignmentRepository();
export const assignmentService = new AssignmentService(assignmentRepository);
