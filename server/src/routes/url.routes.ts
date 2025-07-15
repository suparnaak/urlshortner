import { Router } from 'express';
import { UrlController } from '../controllers/url.controller';
import { authenticate } from '../middleware/auth.middleware';
import { body } from 'express-validator';
import { MESSAGES } from '../utils/constants';

const router = Router();
const urlController = new UrlController();

router.post(
  '/shorten',
  authenticate,
  body('originalUrl')
    .isURL()
    .withMessage(MESSAGES.VALIDATION.ORIGINAL_URL_REQUIRED),
  urlController.shorten.bind(urlController)
);

router.get(
  '/my',
  authenticate,
  urlController.list.bind(urlController)
);

router.get(
  '/:code',
  urlController.redirect.bind(urlController)
);

router.delete(
  '/:id',
  authenticate,
  urlController.delete.bind(urlController)
);

export default router;
