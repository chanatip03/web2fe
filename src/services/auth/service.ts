import { CreateUserRequest } from "@/domain/auth";
import { IAuthRepository } from "./interface";

export class AuthService {
  constructor(private readonly authRepository: IAuthRepository) {}
  async me() {
    return this.authRepository.me();
  }

  async loginAdmin(data: { email: string; password: string }) {
    return this.authRepository.loginAdmin(data);
  }

  async login(data: { email: string; password: string }) {
    return this.authRepository.login(data);
  }

  async requestOTP(data : CreateUserRequest , role_id:number ,certificate?:File | null , studentId? :string | null){
     const formData = new FormData();
    
        formData.append("first_name", data.first_name);
        formData.append("last_name", data.last_name);
        formData.append("academy", data.academy);
        formData.append("email", data.email);
        formData.append("password", data.password);
        formData.append("role_id", role_id.toString());
        if(studentId)formData.append("student_id",studentId);
        if(certificate) formData.append("certificate", certificate);

    return this.authRepository.requestOTP(formData);
  }

  async verifyOTP(data: {email: string; otp: string }){
    return this.authRepository.verifyOTP(data);
  }

  async logout(): Promise<void> {
    return this.authRepository.logout();
  }
}
