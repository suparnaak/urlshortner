import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { STATUS, MESSAGES } from '../utils/constants';

interface JwtPayload {
  userId: string;
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token; 
  if (!token) {
    return res.status(STATUS.UNAUTHORIZED).json({ message: MESSAGES.AUTH.UNAUTHORIZED });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    req.user = { id: decoded.userId }; 
    next();
  } catch (err) {
    return res.status(STATUS.UNAUTHORIZED).json({ message: MESSAGES.AUTH.INVALID_TOKEN });
  }
};
