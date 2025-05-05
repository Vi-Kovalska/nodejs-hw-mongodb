import Joi from 'joi';
import { contactTypes, validEmail, validPhone } from '../constants/contacts.js';
import { isValidObjectId } from 'mongoose';
export const postContactSchema = Joi.object({
  userId: Joi.string().custom((value, helper) => {
    if (value && !isValidObjectId(value)) {
      return helper.message('userId should be a valid mongo id');
    }
    return true;
  }),
  name: Joi.string().min(3).max(20).required().messages({
    'string.base': 'Username should be a string',
    'string.min': 'Username should have at least {#limit} characters',
    'string.max': 'Username should have at most {#limit} characters',
    'any.required': 'Username is required',
  }),
  phoneNumber: Joi.string()
    .min(3)
    .max(20)
    .pattern(validPhone)
    .required()
    .messages({
      'string.base':
        'Phone number should be a string in format: +XXX XXX XXX XXX',
      'string.min': 'Phone number should have at least {#limit} characters',
      'string.max': 'Phone number should have at most {#limit} characters',
      'any.required': 'Phone number is required',
    }),
  email: Joi.string().min(3).max(20).pattern(validEmail).messages({
    'string.base': 'Email should be a string in format of email',
    'string.min': 'Email should have at least {#limit} characters',
    'string.max': 'Email should have at most {#limit} characters',
  }),
  isFavourite: Joi.boolean(),
  type: Joi.string()
    .valid(...contactTypes)
    .min(3)
    .max(20)
    .required(),
});

export const patchContactSchema = Joi.object({
  userId: Joi.string().custom((value, helper) => {
    if (value && !isValidObjectId(value)) {
      return helper.message('userId should be a valid mongo id');
    }
    return true;
  }),
  name: Joi.string().min(3).max(20).messages({
    'string.base': 'Username should be a string',
    'string.min': 'Username should have at least {#limit} characters',
    'string.max': 'Username should have at most {#limit} characters',
    'any.required': 'Username is required',
  }),
  phoneNumber: Joi.string().min(3).max(20).pattern(validPhone).messages({
    'string.base':
      'Phone number should be a string in format: +XXX XXX XXX XXX',
    'string.min': 'Phone number should have at least {#limit} characters',
    'string.max': 'Phone number should have at most {#limit} characters',
    'any.required': 'Phone number is required',
  }),
  email: Joi.string().min(3).max(20).pattern(validEmail).messages({
    'string.base': 'Email should be a string in format of email',
    'string.min': 'Email should have at least {#limit} characters',
    'string.max': 'Email should have at most {#limit} characters',
  }),
  isFavourite: Joi.boolean(),
  type: Joi.string()
    .valid(...contactTypes)
    .min(3)
    .max(20),
});
