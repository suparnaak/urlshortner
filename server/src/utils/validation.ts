import { body } from 'express-validator';
import { MESSAGES } from './constants';

export const registerValidation = [
  body('name')
  .trim()
    .notEmpty().withMessage(MESSAGES.VALIDATION.NAME_REQUIRED).bail()
    .isLength({ min: 2 }).withMessage(MESSAGES.VALIDATION.NAME_TOO_SHORT).bail()
    .matches(/^[A-Za-z\s]+$/).withMessage(MESSAGES.VALIDATION.NAME_INVALID),

  body('email')
    .notEmpty().withMessage(MESSAGES.VALIDATION.EMAIL_REQUIRED).bail()
    .isEmail().withMessage(MESSAGES.VALIDATION.INVALID_EMAIL),

  body('password')
    .notEmpty().withMessage(MESSAGES.VALIDATION.PASSWORD_REQUIRED).bail()
    .isLength({ min: 6 }).withMessage(MESSAGES.VALIDATION.PASSWORD_TOO_SHORT),

  body('confirmPassword')
    .notEmpty().withMessage(MESSAGES.VALIDATION.CONFIRM_PASSWORD_REQUIRED).bail()
    .custom((value, { req }) => value === req.body.password).bail()
    .withMessage(MESSAGES.VALIDATION.PASSWORDS_NOT_MATCHING)
];

export const loginValidation = [
  body('email')
    .notEmpty().withMessage(MESSAGES.VALIDATION.EMAIL_REQUIRED).bail()
    .isEmail().withMessage(MESSAGES.VALIDATION.INVALID_EMAIL),

  body('password')
    .notEmpty().withMessage(MESSAGES.VALIDATION.PASSWORD_REQUIRED)
];
