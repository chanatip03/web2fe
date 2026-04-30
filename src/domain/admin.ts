export interface Container {
  id: string;
  assignmentName: string;
  projectName: string;
  studentId?: string | null;
  teacherName: string;
  memoryUsageMB?: number | null;
  status: string;
  canStop: boolean;
}

export interface ContainerPort {
  containerPort: number;
  hostPort: number;
  protocol?: string;
  serviceName?: string | null;
}

export interface ContainerLogEntry {
  id: string;
  category: string;
  level: string;
  message: string;
}

export interface ContainerDetails {
  status: string;
  currentStep?: number | null;
  previewUrl?: string | null;
  errorMessage?: string | null;
  updatedAt?: string | null;
  containerId?: string | null;
  containerState?: string | null;
  hostPort?: number | null;
  extraPorts: ContainerPort[];
  imageTag?: string | null;
  runtimeLogs: ContainerLogEntry[];
  buildLogs: string;
  canStart: boolean;
}

export interface AdminStudent {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  academy?: string;
  imageUrl?: string;
  studentId?: string;
}

export interface AdminTeacher {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  academy?: string;
  imageUrl?: string;
  certificateUrl?: string;
  isApproved: boolean;
}

export interface AdminTeacherRequest {
  id: number;
  name: string;
  email: string;
  academy: string;
  certificateUrl?: string;
  imageUrl?: string;
}
