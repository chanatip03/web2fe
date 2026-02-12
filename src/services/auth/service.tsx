import { IAuthRepository } from "./interface";

export class AuthService {
  constructor(private readonly authRepository: IAuthRepository) {}

  async loginAdmin(data: { email: string; password: string }) {
    return this.authRepository.loginAdmin(data);
  }

  async login(data: { email: string; password: string }) {
    return this.authRepository.login(data);
  }
}
