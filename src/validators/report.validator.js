import Joi from 'joi';

export const reportAppointmentsSchema = Joi.object({
  date: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required()
    .messages({
      'any.required': 'กรุณาระบุวันที่',
      'string.pattern.base': 'รูปแบบวันที่ต้องเป็น YYYY-MM-DD'
    })
});
