import { Router } from 'express';
import { UrlController } from '../controllers/url.controller';

const router = Router();
const urlController = new UrlController();

router.get('/:code', urlController.redirect.bind(urlController));

export default router;
