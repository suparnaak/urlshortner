import { Request, Response } from 'express';
import { UrlService } from '../services/url.service';
import { validationResult } from 'express-validator';
import { STATUS, MESSAGES } from '../utils/constants';
import { BaseUrlController } from '../abstractions/controllerAbstractions/base.url.controller';
import { BaseUrlService } from '../abstractions/serviceAbstractions/base.url.service';

export class UrlController extends BaseUrlController {
  private urlService: BaseUrlService; 

  constructor(urlService?: BaseUrlService) { 
    super();
    this.urlService = urlService ?? new UrlService();
  }
  async shorten(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(STATUS.BAD_REQUEST).json({ errors: errors.array() });
    }

    try {
      const { originalUrl } = req.body;
      const result = await this.urlService.shortenUrl(originalUrl, req.user!.id);
      if (result.isExisting) {
        return res.status(STATUS.OK).json({
          ...result,
          success: true,
          message: result.message
        });
      }
      return res.status(STATUS.CREATED).json(result);
    } catch (err: any) {
      const status = err.status || STATUS.INTERNAL_SERVER_ERROR;
      const message = err.message || MESSAGES.GENERAL.SERVER_ERROR;
      return res.status(status).json({ message });
    }
  }

  async redirect(req: Request, res: Response) {
    try {
      const shortCode = req.params.code;
      const originalUrl = await this.urlService.redirectUrl(shortCode);
      return res.redirect(originalUrl);
    } catch (err: any) {

      return res.redirect(`${process.env.FRONTEND_URL}/not-found`);
    }
  }

  async list(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    try {
      const data = await this.urlService.getUserUrls(req.user!.id, page, limit);
      return res.status(STATUS.OK).json(data);
    } catch (err: any) {
      const status = err.status || STATUS.INTERNAL_SERVER_ERROR;
      const message = err.message || MESSAGES.GENERAL.SERVER_ERROR;
      return res.status(status).json({ message });
    }
  }


 async delete(req: Request, res: Response) {
  try {
    await this.urlService.deleteUrl(req.params.id, req.user!.id);
    return res.status(STATUS.OK).json({ message: MESSAGES.SHORT_URL.DELETED_SUCCESSFUL });
  } catch (err: any) {
    const status = err.status || STATUS.INTERNAL_SERVER_ERROR;
    const message = err.message || MESSAGES.GENERAL.SERVER_ERROR;
    return res.status(status).json({ message });
  }
}

}
