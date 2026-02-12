import { IAuthRepository } from "./interface";
import { AuthResponse, LoginRequest } from "@/domain/auth";
import { ApiResponse } from "@/domain/response";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export class AuthRepository implements IAuthRepository {
  async loginAdmin(data: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    const res = await fetch(`${BASE_URL}/auth/login-admin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error(`LoginAdmin failed: ${res.status}`);
    }

    return res.json();
  }

  async login(data: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error(`Login failed: ${res.status}`);
    }

    const response = await res.json();
    console.log("response", response);

    return response;
  }
}
