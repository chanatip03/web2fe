export interface Container {
  id: string;
  name: string;
  cpuPercent: number;
  memoryUsageMB: number;
  uptime: string;
  teacherName: string;
}

export interface AdminStudent {
  id: number;
  studentId: string;
  name: string;
  email: string;
  academy: string;
  imageUrl?: string;
}

export interface AdminTeacher {
  id: number;
  name: string;
  email: string;
  academy: string;
  certificateUrl?: string;
  imageUrl?: string;
}

export interface AdminTeacherRequest {
  id: number;
  name: string;
  email: string;
  academy: string;
  certificateUrl?: string;
  imageUrl?: string;
}

export interface UpdateStudentRequest {
  name?: string;
  email?: string;
  academy?: string;
  studentId?: string;
}

export interface UpdateTeacherRequest {
  name?: string;
  email?: string;
  academy?: string;
}
