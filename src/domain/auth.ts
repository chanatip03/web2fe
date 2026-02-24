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

export interface CreateUserRequest {
  first_name :string
  last_name:string
  email: string,
  password: string,
  academy: string,
} 