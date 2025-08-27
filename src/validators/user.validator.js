import Joi from 'joi';

export const updateMeSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  phone: Joi.string()
    .pattern(/^[0-9+\-\s()]{6,20}$/)
    .message('รูปแบบเบอร์โทรไม่ถูกต้อง'),
  address: Joi.string().max(500)
}).min(1);
