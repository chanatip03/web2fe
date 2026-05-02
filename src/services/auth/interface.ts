import { AuthResponse, MeResponse} from "@/domain/auth";
import { User } from "@/domain/user";

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
  requestRegisterOTP(data : FormData): Promise<string>;
  requestResetPasswordOTP(data: { email: string }): Promise<string>;
  verifyOTP(data: {
    email:string,
    otp:string
  }):Promise<string>;
  logout(): Promise<void>;
}
