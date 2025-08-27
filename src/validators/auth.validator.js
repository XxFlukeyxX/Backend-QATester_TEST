import Joi from 'joi';

export const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().max(100).required(),
  password: Joi.string().min(6).max(100).required(),
  role: Joi.string().valid('patient','doctor').required(),
  specialty: Joi.when('role', {
    is: 'doctor',
    then: Joi.number().integer().positive().required(),
    otherwise: Joi.forbidden()
  })
});

export const loginSchema = Joi.object({
  email: Joi.string().email().max(100).required(),
  password: Joi.string().min(6).max(100).required()
});
