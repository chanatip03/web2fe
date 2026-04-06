/** Docker container monitored by admin */
export interface Container {
  id: string;
  name: string;
  cpuPercent: number;
  memoryUsageMB: number;
  uptime: string;
  teacherName: string;
}

/** Student record shown in admin panel */
export interface AdminStudent {
  id: number;
  studentId: string;
  name: string;
  email: string;
  academy: string;
  imageUrl?: string;
}

/** Teacher record shown in admin panel */
export interface AdminTeacher {
  id: number;
  name: string;
  email: string;
  academy: string;
  certificateUrl?: string;
  imageUrl?: string;
}

/** Pending teacher registration request */
export interface AdminTeacherRequest {
  id: number;
  name: string;
  email: string;
  academy: string;
  certificateUrl?: string;
  imageUrl?: string;
}
