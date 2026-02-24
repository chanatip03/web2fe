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
  requestOTP(data : FormData): Promise<string>;
  verifyOTP(data: {
    email:string,
    otp:string
  }):Promise<string>
}
