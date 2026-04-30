import { IProjectRepository } from "./interface";
import { Project, ProjectUpdateGradingRequest } from "@/domain/project";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export class ProjectRepository implements IProjectRepository {

  async getProjectById(projectId: number): Promise<Project> {
    const res = await fetch(`${BASE_URL}/project/${projectId}`, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.detail || "Failed to fetch project");
    }

    return res.json();
  }

  async getProjectsByAssignment(assignmentId: number): Promise<Project[]> {
    const res = await fetch(`${BASE_URL}/project/assignment/${assignmentId}`, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.detail || "Failed to fetch projects");
    }

    return res.json();
  }

  async updateProjectGrading(
    projectId: number,
    data: ProjectUpdateGradingRequest
  ): Promise<Project> {
    const res = await fetch(`${BASE_URL}/project/${projectId}/grading`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Failed to update grading");
    }

    return res.json();
  }
}