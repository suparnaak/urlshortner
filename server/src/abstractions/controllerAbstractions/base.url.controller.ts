import { Request, Response } from "express";

export abstract class BaseUrlController {
  abstract shorten(req: Request, res: Response): Promise<Response | void>;
  abstract redirect(req: Request, res: Response): Promise<Response | void>;
  abstract list(req: Request, res: Response): Promise<Response | void>;
  abstract delete(req: Request, res: Response): Promise<Response | void>;
}