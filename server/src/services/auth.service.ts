import { User } from "../models/user.model";
import { hashPassword, comparePassword } from "../utils/hash.util";
import jwt, { SignOptions } from "jsonwebtoken";
import { MESSAGES, STATUS } from "../utils/constants";
import { RegisterInput, LoginInput } from "../types/auth.types";

export class AuthService {
  async register({ name, email, password }: RegisterInput) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw { status: STATUS.BAD_REQUEST, message: MESSAGES.AUTH.EMAIL_EXISTS };
    }

    const hashedPassword = await hashPassword(password);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    return { message: MESSAGES.AUTH.REGISTER_SUCCESS };
  }

  async login({ email, password }: LoginInput) {
    const user = await User.findOne({ email });
    if (!user) {
      throw { status: STATUS.BAD_REQUEST, message: MESSAGES.AUTH.LOGIN_FAILED };
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      throw { status: STATUS.BAD_REQUEST, message: MESSAGES.AUTH.LOGIN_FAILED };
    }

    const payload = { userId: user._id };
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
    } catch (err) {
      throw { status: STATUS.UNAUTHORIZED, message: MESSAGES.AUTH.REFRESH_TOKEN_MISSING };
    }

    const user = await User.findById(payload.userId);
    if (!user) {
      throw { status: STATUS.UNAUTHORIZED, message: MESSAGES.AUTH.LOGIN_FAILED };
    }

    const newAccessToken = jwt.sign({ userId: user._id }, accessSecret, { expiresIn: "1h" });

    return newAccessToken;
  }
}
