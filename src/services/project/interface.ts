import { Project, ProjectSourceCode, ProjectUpdateGradingRequest } from "@/domain/project";

export interface IProjectRepository {
  getProjectById(projectId: number): Promise<Project>;
  getProjectsByAssignment(assignmentId: number): Promise<Project[]>;
  updateProjectGrading(projectId: number, data: ProjectUpdateGradingRequest): Promise<Project>;
  getProjectSourceCode(projectId: number): Promise<ProjectSourceCode>;
}
