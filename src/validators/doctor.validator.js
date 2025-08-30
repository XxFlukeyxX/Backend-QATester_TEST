import Joi from 'joi';

export const searchDoctorSchema = Joi.object({
  specialty: Joi.string().trim().allow('', null),
  specialty_id: Joi.number().integer().positive().messages({
    'number.base': 'specialty_id ต้องเป็นตัวเลข',
    'number.integer': 'specialty_id ต้องเป็นจำนวนเต็ม',
    'number.positive': 'specialty_id ต้องเป็นเลขบวก'
  })
})
.xor('specialty', 'specialty_id')
.messages({
  'object.missing': 'ต้องระบุอย่างน้อยหนึ่งอย่างระหว่าง specialty หรือ specialty_id',
  'object.xor': 'ระบุได้อย่างใดอย่างหนึ่ง: specialty หรือ specialty_id'
});

export const addSlotsSchema = Joi.object({
  slots: Joi.array().items(
    Joi.string().min(3).required().messages({
      'string.base': 'รูปแบบวันที่ต้องเป็นข้อความ',
      'string.min': 'รูปแบบวันที่ไม่ถูกต้อง',
      'any.required': 'กรุณาระบุเวลา'
    })
  ).min(1).required().messages({
    'array.base': 'slots ต้องเป็นรายการ',
    'array.min': 'กรุณาระบุอย่างน้อย 1 เวลา',
    'any.required': 'กรุณาระบุ slots'
  })
});

export const updateSlotSchema = Joi.object({
  slot: Joi.string().min(3).required().messages({
    'string.base': 'รูปแบบวันที่ต้องเป็นข้อความ',
    'string.min': 'รูปแบบวันที่ไม่ถูกต้อง',
    'any.required': 'กรุณาระบุเวลา'
  })
});
