export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  msg: string;
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  image_url: string | null;
  academy: string;
  role_id: number;
}

export interface Role {
  id: number;
  name: string; // หรือ "student" | "teacher"
}

export interface Student {
  id: number;
  student_id: string;
  discord_user_id: string | null;
}

export interface Teacher {
  id: number;
  certificate_url: string | null;
  is_approved: boolean;
}

export interface MeResponse {
  user: User;
  roles: Role;
}

export interface CreateUserRequest {
  first_name :string
  last_name:string
  email: string,
  password: string,
  academy: string,
} 