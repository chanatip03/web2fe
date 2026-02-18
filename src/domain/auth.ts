export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  msg: string;
}

export interface MeResponse {
  userId: string;
  role: "student" | "teacher";
  exp: number;
}