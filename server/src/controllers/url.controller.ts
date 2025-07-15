import { Request, Response } from 'express';
import { UrlService } from '../services/url.service';
import { validationResult } from 'express-validator';
import { STATUS, MESSAGES } from '../utils/constants';

export class UrlController {
  private urlService = new UrlService();

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
      const status = err.status || STATUS.INTERNAL_SERVER_ERROR;
      const message = err.message || MESSAGES.GENERAL.SERVER_ERROR;
      return res.status(status).json({ message });
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
      const urlId = req.params.id;
      const userId = req.user!.id;
      const url = await this.urlService.getUrlByIdAndUser(urlId, userId);
      if (!url) {
        return res.status(STATUS.NOT_FOUND).json({ message: MESSAGES.SHORT_URL.URL_NOT_FOUND });
      }
      await url.deleteOne();
      return res.status(STATUS.OK).json({ message: MESSAGES.SHORT_URL.DELETED_SUCCESSFUL });
    } catch (err: any) {
      const status = err.status || STATUS.INTERNAL_SERVER_ERROR;
      const message = err.message || MESSAGES.GENERAL.SERVER_ERROR;
      return res.status(status).json({ message });
    }
  }
}
