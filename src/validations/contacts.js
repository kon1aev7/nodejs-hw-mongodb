import Joi from 'joi';
import { typeList } from '../constants/contacts.js';

export const contactAddSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    'string.base': 'ContactName should be a string',
    'string.min': 'ContactName should have at least {#limit} characters',
    'string.max': 'ContactName should have at most {#limit} characters',
    'any.required': 'ContactName is required',
  }),

  phoneNumber: Joi.string().min(3).max(20).required().messages({
    'string.base': 'PhoneNumber should be a string',
    'string.min': 'PhoneNumber should have at least {#limit} characters',
    'string.max': 'PhoneNumber should have at most {#limit} characters',
    'any.required': 'PhoneNumber is required',
  }),

  email: Joi.string().email().messages({
    'string.email': 'Email must be a valid email address',
  }),

  isFavourite: Joi.boolean(),

  contactType: Joi.string()
    .valid(...typeList)
    .required()
    .messages({
      'string.base': 'ContactType should be a string',
      'string.min': 'ContactType should have at least {#limit} characters',
      'string.max': 'ContactType should have at most {#limit} characters',
      'any.required': 'ContactType is required',
    }),
});

export const contactUpdateSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  phoneNumber: Joi.string().min(3).max(20),
  email: Joi.string(),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid(...typeList),
});
