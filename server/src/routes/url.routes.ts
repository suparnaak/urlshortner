import { Router } from 'express';
import { urlController } from '../container';
import { authenticate } from '../middleware/auth.middleware';
import { body } from 'express-validator';
import { MESSAGES } from '../utils/constants';

const router = Router();

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

router.delete(
  '/:id',
  authenticate,
  urlController.delete.bind(urlController)
);

export default router;