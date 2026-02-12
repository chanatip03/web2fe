import { AuthService } from "./auth/service";
import { AuthRepository } from "./auth/repository";

const authRepository = new AuthRepository();
export const authService = new AuthService(authRepository);
