import { Request, Response, NextFunction, Router } from "express";
export abstract class BaseAuthController {
  abstract register(req: Request, res: Response): Promise<Response | void>;
  abstract login(req: Request, res: Response): Promise<Response | void>;
  abstract refresh(req: Request, res: Response): Promise<Response | void>;
  abstract logout(req: Request, res: Response): Response | Promise<Response>;
  abstract me(req: Request, res: Response): Promise<Response | void>;
}