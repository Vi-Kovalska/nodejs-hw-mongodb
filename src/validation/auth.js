import Joi from 'joi';
import { validEmail, validPassword } from '../constants/auth.js';

export const registerUserSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().pattern(validEmail).required(),
  password: Joi.string().pattern(validPassword).required(),
});

export const loginUserSchema = Joi.object({
  email: Joi.string().pattern(validEmail).required(),
  password: Joi.string().pattern(validPassword).required(),
});

export const requestResetEmailSchema = Joi.object({
  email: Joi.string().pattern(validEmail).required(),
});
export const resetPasswordSchema = Joi.object({
  password: Joi.string().pattern(validPassword).required(),
  token: Joi.string().required(),
});
