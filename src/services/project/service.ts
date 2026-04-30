import { IProjectRepository } from "./interface";
import { ProjectUpdateGradingRequest } from "@/domain/project";

export class ProjectService {
  constructor(private readonly projectRepository: IProjectRepository) {}

  async getProjectById(projectId: number) {
    return this.projectRepository.getProjectById(projectId);
  }

  async getProjectsByAssignment(assignmentId: number) {
    return this.projectRepository.getProjectsByAssignment(assignmentId);
  }

  async updateProjectGrading(projectId: number, data: ProjectUpdateGradingRequest) {
    return this.projectRepository.updateProjectGrading(projectId, data);
  }
}
