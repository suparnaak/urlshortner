import { User } from '../models/user.model';
import { hashPassword, comparePassword } from '../utils/hash.util';
import jwt, { SignOptions } from 'jsonwebtoken';
import { MESSAGES, STATUS } from '../utils/constants';
import { RegisterInput, LoginInput } from '../types/auth.types';

export class AuthService {
  async register({ name, email, password }: RegisterInput) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw { status: STATUS.BAD_REQUEST, message: MESSAGES.AUTH.EMAIL_EXISTS };
    }

    const hashedPassword = await hashPassword(password);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    return { message: MESSAGES.AUTH.REGISTER_SUCCESS };
  }

  async login({ email, password }: LoginInput) {
    const user = await User.findOne({ email });
    if (!user) {
      throw { status: STATUS.BAD_REQUEST, message: MESSAGES.AUTH.LOGIN_FAILED };
    }
 
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      throw { status: STATUS.BAD_REQUEST, message: MESSAGES.AUTH.LOGIN_FAILED };
    }

    const payload = { userId: user._id };
    const secret = process.env.JWT_SECRET;
if (!secret) throw { status: STATUS.INTERNAL_SERVER_ERROR, message: MESSAGES.AUTH.JWT_MISSING };
    const options: SignOptions = {
      expiresIn:'1h'
    };

    const token = jwt.sign(payload, secret, options);

    return {
  message: MESSAGES.AUTH.LOGIN_SUCCESS,
  token,
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
  },
};
  }
}
