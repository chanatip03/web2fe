import { ApiResponse } from "@/domain/response";
import { AuthResponse } from "@/domain/auth";

export interface IAuthRepository {
  loginAdmin(data: {
    email: string;
    password: string;
  }): Promise<ApiResponse<AuthResponse>>;
  login(data: {
    email: string;
    password: string;
  }): Promise<ApiResponse<AuthResponse>>;
}
