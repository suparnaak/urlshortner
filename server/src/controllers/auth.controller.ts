import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { AuthService } from '../services/auth.service';
import { MESSAGES, STATUS } from '../utils/constants';
import { User } from '../models/user.model';

export class AuthController {
  private authService = new AuthService();

  async register(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(STATUS.BAD_REQUEST).json({ message: errors.array()[0].msg });
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
      return res.status(STATUS.BAD_REQUEST).json({ message: errors.array()[0].msg });
    }

    const { email, password } = req.body;
    try {
      const result = await this.authService.login({ email, password });
      res.cookie('token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 3600000,
      });
      return res.status(STATUS.OK).json({ message: result.message, user: result.user });
    } catch (err: any) {
      const status = err.status || STATUS.INTERNAL_SERVER_ERROR;
      const message = err.message || MESSAGES.GENERAL.SERVER_ERROR;
      return res.status(status).json({ message });
    }
  }

  logout(req: Request, res: Response) {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    return res.status(STATUS.OK).json({ message: MESSAGES.AUTH.LOGOUT });
  }

  async me(req: Request, res: Response) {
    try {
      const user = await User.findById(req.user!.id).select('-password');
      if (!user) {
        return res.status(STATUS.UNAUTHORIZED).json({ message: MESSAGES.AUTH.LOGIN_REQUIRED });
      }
      return res.status(STATUS.OK).json({ user });
    } catch {
      return res.status(STATUS.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.GENERAL.SERVER_ERROR });
    }
  }
}