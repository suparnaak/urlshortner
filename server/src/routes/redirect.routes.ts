import { Router } from 'express';
import { urlController } from '../container';

const router = Router();

router.get('/:code', urlController.redirect.bind(urlController));

export default router;