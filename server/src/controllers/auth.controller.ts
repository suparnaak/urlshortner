import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { AuthService } from "../services/auth.service";
import { MESSAGES, STATUS } from "../utils/constants";
import { User } from "../models/user.model";
import { BaseAuthController } from "../abstractions/controllerAbstractions/base.auth.controller";
import { BaseAuthService } from "../abstractions/serviceAbstractions/base.auth.service";

export class AuthController extends BaseAuthController{
  private authService: BaseAuthService; 

  constructor(authService?: BaseAuthService) { 
    super();
    this.authService = authService ?? new AuthService();
  }

  async register(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(STATUS.BAD_REQUEST)
        .json({ message: errors.array()[0].msg });
    }

    const { name, email, password } = req.body;
    try {
      const result = await this.authService.register({ name, email, password });
      return res.status(STATUS.CREATED).json(result);
    } catch (err: any) {
      const status = err.status || STATUS.INTERNAL_SERVER_ERROR;
      const message = err.message || MESSAGES.GENERAL.SERVER_ERROR;
      return res.status(status).json({ message });
    }
  }

  async login(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(STATUS.BAD_REQUEST)
        .json({ message: errors.array()[0].msg });
    }

    const { email, password } = req.body;
    try {
      const result = await this.authService.login({ email, password });
      res.cookie("token", result.token, {
        httpOnly: true,
        /* secure: true,
        sameSite: "none", */
        secure: process.env.NODE_ENV === "production", 
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 60 * 60 * 1000,
      });
      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        /* secure: true,
        sameSite: "none", */
        path: "/",
        secure: process.env.NODE_ENV === "production", 
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return res
        .status(STATUS.OK)
        .json({ message: result.message, user: result.user });
    } catch (err: any) {
      const status = err.status || STATUS.INTERNAL_SERVER_ERROR;
      const message = err.message || MESSAGES.GENERAL.SERVER_ERROR;
      return res.status(status).json({ message });
    }
  }
   async refresh(req: Request, res: Response) {
console.log("refresh called; incoming cookies:", req.cookies);
    try {
      const refreshToken = req.cookies?.refreshToken;
      if (!refreshToken) {
        return res.status(STATUS.UNAUTHORIZED).json({ message: MESSAGES.AUTH.REFRESH_TOKEN_MISSING });
      }

      const accessToken = await this.authService.refreshToken(refreshToken);

      res.cookie("token", accessToken, {
        httpOnly: true,
        /* secure: true,
        sameSite: "none", */
        secure: process.env.NODE_ENV === "production", 
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/",
        maxAge: 60 * 60 * 1000, 
      });

      return res.status(STATUS.OK).json({ message: MESSAGES.AUTH.TOKEN_REFRESHED });
    } catch (err: any) {
      const status = err.status || STATUS.UNAUTHORIZED;
      const message = err.message || MESSAGES.GENERAL.SERVER_ERROR;
      return res.status(status).json({ message });
    }
  }

  logout(req: Request, res: Response) {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.clearCookie("refreshToken", {
  httpOnly: true,
  secure: true,
  sameSite: "none",
});

    return res.status(STATUS.OK).json({ message: MESSAGES.AUTH.LOGOUT });
  }

  
 async me(req: Request, res: Response) {
    try {
      const user = await this.authService.getUserProfile(req.user!.id);
      return res.status(STATUS.OK).json({ user });
    } catch (err: any) {
      const status = err.status || STATUS.INTERNAL_SERVER_ERROR;
      const message = err.message || MESSAGES.GENERAL.SERVER_ERROR;
      return res.status(status).json({ message });
    }
  }
}
