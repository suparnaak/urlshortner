import { IUser, User } from "../models/user.model";
import { hashPassword, comparePassword } from "../utils/hash.util";
import jwt, { SignOptions } from "jsonwebtoken";
import { MESSAGES, STATUS } from "../utils/constants";
import { RegisterInput, LoginInput } from "../types/auth.types";
import { BaseUserRepository } from "../abstractions/repositoryAbstractions/base.user.repository";
import { UserRepository } from "../repositories/user.repository";
import { Types } from "mongoose";
import { BaseAuthService } from "../abstractions/serviceAbstractions/base.auth.service";

export class AuthService extends BaseAuthService {
  private userRepo: BaseUserRepository;

  constructor(userRepo?: BaseUserRepository) {
    super()
    this.userRepo = userRepo ?? new UserRepository();
  }

  async register({ name, email, password }: RegisterInput) {
    const existingUser = await this.userRepo.findByEmail(email);
    if (existingUser) {
      throw { status: STATUS.BAD_REQUEST, message: MESSAGES.AUTH.EMAIL_EXISTS };
    }

    const hashedPassword = await hashPassword(password);
  
    await this.userRepo.create({ name, email, password: hashedPassword });

    return { message: MESSAGES.AUTH.REGISTER_SUCCESS };
  }

  async login({ email, password }: LoginInput) {
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw { status: STATUS.BAD_REQUEST, message: MESSAGES.AUTH.LOGIN_FAILED };
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      throw { status: STATUS.BAD_REQUEST, message: MESSAGES.AUTH.LOGIN_FAILED };
    }

    const payload = { userId: user._id.toString() };
    const secret = process.env.JWT_SECRET;
    if (!secret)
      throw {
        status: STATUS.INTERNAL_SERVER_ERROR,
        message: MESSAGES.AUTH.JWT_MISSING,
      };

    const options: SignOptions = {
      expiresIn: "1h",
    };

    const token = jwt.sign(payload, secret, options);

    const refreshsecret = process.env.REFRESH_TOKEN_SECRET;
    if (!refreshsecret)
      throw {
        status: STATUS.INTERNAL_SERVER_ERROR,
        message: MESSAGES.AUTH.REFRESH_TOKEN_SECRET_MISSING,
      };

      const refreshOptions: SignOptions = {
      expiresIn: "7d",
    };
    const refreshToken = jwt.sign(payload, refreshsecret, refreshOptions);
    return {
      message: MESSAGES.AUTH.LOGIN_SUCCESS,
      token,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    };
  }
  async refreshToken(refreshToken: string) {
    const refreshSecret = process.env.REFRESH_TOKEN_SECRET!;
    const accessSecret = process.env.JWT_SECRET!;
    if (!refreshSecret || !accessSecret) {
      throw { status: STATUS.INTERNAL_SERVER_ERROR, message: MESSAGES.AUTH.JWT_MISSING };
    }

    let payload: any;
    try {
      payload = jwt.verify(refreshToken, refreshSecret) as any;
    } catch (err: any) {
      console.error("refreshToken verify error:", err.name, err.message);
      throw { status: STATUS.UNAUTHORIZED, message: MESSAGES.AUTH.REFRESH_TOKEN_MISSING };
    }

    const user = await this.userRepo.findById(payload.userId as string | Types.ObjectId);
    if (!user) {
      throw { status: STATUS.UNAUTHORIZED, message: MESSAGES.AUTH.LOGIN_FAILED };
    }

    const newAccessToken = jwt.sign({ userId: user._id }, accessSecret, { expiresIn: "1h" });

    return newAccessToken;
  }
  async getUserProfile(userId: string): Promise<Omit<IUser, 'password'>> {
    const user = await this.userRepo.findByIdWithoutPassword(userId);
    if (!user) {
      throw { status: STATUS.UNAUTHORIZED, message: MESSAGES.AUTH.LOGIN_REQUIRED };
    }
    return user;
  }
}
