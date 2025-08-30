import Joi from 'joi';

export const createAppointmentSchema = Joi.object({
  doctorId: Joi.number().integer().positive().required().messages({
    'any.required': 'กรุณาระบุ doctorId',
    'number.base': 'doctorId ต้องเป็นตัวเลข',
    'number.integer': 'doctorId ต้องเป็นจำนวนเต็ม',
    'number.positive': 'doctorId ต้องเป็นเลขบวก'
  }),
  slotId: Joi.number().integer().positive().required().messages({
    'any.required': 'กรุณาระบุ slotId',
    'number.base': 'slotId ต้องเป็นตัวเลข',
    'number.integer': 'slotId ต้องเป็นจำนวนเต็ม',
    'number.positive': 'slotId ต้องเป็นเลขบวก'
  })
});
