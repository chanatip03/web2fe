import { AuthResponse, MeResponse } from "@/domain/auth";

export interface IAuthRepository {
  me(): Promise<MeResponse>;
  loginAdmin(data: {
    email: string;
    password: string;
  }): Promise<AuthResponse>;
  login(data: {
    email: string;
    password: string;
  }): Promise<AuthResponse>;
}
