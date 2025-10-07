import { AuthController } from '../controllers/auth.controller';
import { UrlController } from '../controllers/url.controller';
import { AuthService } from '../services/auth.service';
import { UrlService } from '../services/url.service';
import { UserRepository } from '../repositories/user.repository';
import { UrlRepository } from '../repositories/url.repository';

const userRepository = new UserRepository();
const urlRepository = new UrlRepository();

const authService = new AuthService(userRepository);
const urlService = new UrlService(urlRepository);

export const authController = new AuthController(authService);
export const urlController = new UrlController(urlService);

export const container = {
  authController,
  urlController,
};