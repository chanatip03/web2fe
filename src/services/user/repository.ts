import { User, UpdateStudentRequest, UpdateTeacherRequest } from "@/domain/user";
import { IStudent } from "@/domain/student";
import { Teacher } from "@/domain/teacher";
import {
  AdminStudent,
  AdminTeacher,
  Container,
  AdminTeacherRequest,
  ContainerDetails,
  ContainerLogEntry,
  ContainerPort,
} from "@/domain/admin";
import { IUserRepository } from "./interface";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

function getPreviewProxyUrl(projectId?: string | null): string | null {
  if (!projectId || !BASE_URL) return null;

  try {
    const apiUrl = new URL(BASE_URL);
    return `${apiUrl.origin}/preview/${projectId}/`;
  } catch {
    const baseWithoutApi = BASE_URL.replace(/\/api\/?$/, "").replace(/\/$/, "");
    return baseWithoutApi ? `${baseWithoutApi}/preview/${projectId}/` : null;
  }
}

type DeploymentStatusResponse = {
  deploymentId: string;
  projectId: string;
  projectName: string;
  status: string;
  currentStep?: number | null;
  previewUrl?: string | null;
  errorMessage?: string | null;
  updatedAt?: string | null;
  containerId?: string | null;
  containerState?: string | null;
  hostPort?: number | null;
  extraPorts?: ContainerPort[];
  imageTag?: string | null;
};

type BuildLogsResponse = {
  build_logs?: string;
};

async function throwIfNotOk(response: Response, fallbackMessage: string): Promise<void> {
  if (response.ok) return;

  let message = fallbackMessage;

  try {
    const rawBody = await response.text();
    if (rawBody) {
      try {
        const parsed = JSON.parse(rawBody) as { detail?: string; message?: string };
        message = parsed.detail || parsed.message || rawBody;
      } catch {
        message = rawBody;
      }
    }
  } catch {
    message = fallbackMessage;
  }

  throw new Error(message);
}

export class UserRepository implements IUserRepository {
  async getUsers(role?: string): Promise<User[]> {
    const url = role ? `${BASE_URL}/user/?role=${role}` : `${BASE_URL}/user/`;
    const res = await fetch(url, {
      method: "GET",
      credentials: "include",
    });
    await throwIfNotOk(res, "Failed to fetch users");
    return res.json();
  }

  async getAdminStudents(search?: string): Promise<AdminStudent[]> {
    const query = search ? `?search=${encodeURIComponent(search)}` : "";
    const res = await fetch(`${BASE_URL}/admin/students${query}`, {
      method: "GET",
      credentials: "include",
    });
    await throwIfNotOk(res, "Failed to fetch students");
    return res.json();
  }

  async getAdminTeachers(search?: string): Promise<AdminTeacher[]> {
    const query = search ? `?search=${encodeURIComponent(search)}` : "";
    const res = await fetch(`${BASE_URL}/admin/teachers${query}`, {
      method: "GET",
      credentials: "include",
    });
    await throwIfNotOk(res, "Failed to fetch teachers");
    return res.json();
  }

  async getCurrentUser(): Promise<IStudent | Teacher | User> {
    const res = await fetch(`${BASE_URL}/user/me`, {
      method: "GET",
      credentials: "include",
    });
    await throwIfNotOk(res, "Failed to fetch current user");
    return res.json();
  }

  async updateStudent(userId: number, data: FormData): Promise<IStudent> {
    const res = await fetch(`${BASE_URL}/user/student/${userId}`, {
      method: "PUT",
      credentials: "include",
      body: data,
    });
    await throwIfNotOk(res, "Failed to update student");
    return res.json();
  }

  async updateTeacher(userId: number, data: FormData): Promise<Teacher> {
    const res = await fetch(`${BASE_URL}/user/teacher/${userId}`, {
      method: "PUT",
      credentials: "include",
      body: data,
    });
    await throwIfNotOk(res, "Failed to update teacher");
    return res.json();
  }

  async deleteUser(userId: number): Promise<void> {
    const res = await fetch(`${BASE_URL}/user/${userId}`, {
      method: "DELETE",
      credentials: "include",
    });
    await throwIfNotOk(res, "Failed to delete user");
  }

  async getContainers(): Promise<Container[]> {
    const res = await fetch(`${BASE_URL}/admin/containers`, {
      method: "GET",
      credentials: "include",
    });
    await throwIfNotOk(res, "Failed to fetch containers");
    return res.json();
  }

  async getContainerDetails(id: string): Promise<ContainerDetails> {
    const [statusResponse, logsResponse, buildLogsResponse] = await Promise.all([
      fetch(`${BASE_URL}/deployments/${id}/status`, {
        method: "GET",
        credentials: "include",
      }),
      fetch(`${BASE_URL}/deployments/${id}/logs`, {
        method: "GET",
        credentials: "include",
      }),
      fetch(`${BASE_URL}/deployments/${id}/build-logs`, {
        method: "GET",
        credentials: "include",
      }),
    ]);

    await throwIfNotOk(statusResponse, "Failed to fetch container details");
    await throwIfNotOk(logsResponse, "Failed to fetch container logs");
    await throwIfNotOk(buildLogsResponse, "Failed to fetch container build logs");

    const statusData = await statusResponse.json() as DeploymentStatusResponse;
    const runtimeLogs = await logsResponse.json() as ContainerLogEntry[];
    const buildLogsData = await buildLogsResponse.json() as BuildLogsResponse;
    const runtimeState = (statusData.containerState || statusData.status || "").toLowerCase();
    const proxyPreviewUrl = getPreviewProxyUrl(statusData.projectId);

    return {
      status: statusData.status,
      currentStep: statusData.currentStep ?? null,
      previewUrl: proxyPreviewUrl ?? statusData.previewUrl ?? null,
      errorMessage: statusData.errorMessage ?? null,
      updatedAt: statusData.updatedAt ?? null,
      containerId: statusData.containerId ?? null,
      containerState: statusData.containerState ?? null,
      hostPort: statusData.hostPort ?? null,
      extraPorts: statusData.extraPorts ?? [],
      imageTag: statusData.imageTag ?? null,
      runtimeLogs,
      buildLogs: buildLogsData.build_logs ?? "",
      canStart: !["running", "analyzing", "building", "deploying"].includes(runtimeState),
    };
  }

  async startContainer(id: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/deployments/${id}/start`, {
      method: "POST",
      credentials: "include",
    });
    await throwIfNotOk(res, "Failed to start container");
  }

  async stopContainer(id: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/admin/containers/${id}/stop`, {
      method: "POST",
      credentials: "include",
    });
    await throwIfNotOk(res, "Failed to stop container");
  }

  async deleteContainer(id: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/deployments/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    await throwIfNotOk(res, "Failed to delete container");
  }

  async getTeacherRequests(search?: string): Promise<AdminTeacherRequest[]> {
    const query = search ? `?search=${encodeURIComponent(search)}` : "";
    const res = await fetch(`${BASE_URL}/admin/teacher-requests${query}`, {
      method: "GET",
      credentials: "include",
    });
    await throwIfNotOk(res, "Failed to fetch teacher requests");
    return res.json();
  }

  async approveRequest(id: number): Promise<void> {
    const res = await fetch(`${BASE_URL}/admin/teacher-requests/${id}/approve`, {
      method: "POST",
      credentials: "include",
    });
    await throwIfNotOk(res, "Failed to approve request");
  }

  async rejectRequest(id: number): Promise<void> {
    const res = await fetch(`${BASE_URL}/admin/teacher-requests/${id}/reject`, {
      method: "POST",
      credentials: "include",
    });
    await throwIfNotOk(res, "Failed to reject request");
  }

  async resetPassword(data: {email: string; new_password: string;}): Promise<string> {
    const res = await fetch(`${BASE_URL}/user/reset-password`, {
      method: "POST",
      headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Reset password failed");

    return res.json();
  }

  async changePassword(
    data: {old_password: string; new_password: string;}
  ): Promise<string> {
    const res = await fetch(`${BASE_URL}/user/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Change password failed");

    return res.json();
  }
}
