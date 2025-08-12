import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { registerValidation, loginValidation } from '../utils/validation';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
const authController = new AuthController();


router.post(
  '/register',
  registerValidation,
  authController.register.bind(authController)
);


router.post(
  '/login',
  loginValidation,
  authController.login.bind(authController)
);


router.post(
  '/logout',
  authenticate,
  authController.logout.bind(authController)
);

router.post(
  '/refresh-token',
  authController.refresh.bind(authController)
);


router.get(
  '/me',
  authenticate,
  authController.me.bind(authController)
);

export default router;
