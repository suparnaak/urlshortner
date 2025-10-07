import { IUser } from "../../models/user.model";
import { RegisterInput, LoginInput } from "../../types/auth.types";

export abstract class BaseAuthService {
  abstract register(data: RegisterInput): Promise<{ message: string }>;
  abstract login(data: LoginInput): Promise<{
    message: string;
    token: string;
    refreshToken: string;
    user: {
      id: any;
      name: string;
      email: string;
    };
  }>;
  abstract refreshToken(refreshToken: string): Promise<string>;
  abstract getUserProfile(userId: string): Promise<Omit<IUser, 'password'>>;
}