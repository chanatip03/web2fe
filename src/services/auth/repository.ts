import { User } from "@/domain/user";
import { IAuthRepository } from "./interface";
import { AuthResponse, CreateUserRequest, LoginRequest, MeResponse } from "@/domain/auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export class AuthRepository implements IAuthRepository {
  async me(): Promise<MeResponse> {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      method: "GET",
      credentials: "include",
    });
    return res.json();
  }

  async loginAdmin(data: LoginRequest): Promise<AuthResponse> {
    const res = await fetch(`${BASE_URL}/auth/login-admin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error(`LoginAdmin failed: ${res.status}`);
    }

    return res.json();
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
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

  async requestOTP(data: FormData): Promise<string> {
    const res = await fetch(`${BASE_URL}/auth/request-otp`, {
      method: "POST",
      body: data,
    });

    if (!res.ok) {
      throw new Error(`Request otp failed: ${res.status}`);
    }

    return res.json();
  }

  async verifyOTP(data: { email: string; otp: string; }):Promise<string> {
    const res = await fetch(`${BASE_URL}/auth/verify-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error(`Verify otp failed: ${res.status}`);
    }

    return res.json();
  }
}
