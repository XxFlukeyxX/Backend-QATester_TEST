import Joi from 'joi';

export const updateMeSchema = Joi.object({
  name: Joi.string().min(2).max(100).messages({
    'string.min': 'ชื่อต้องมีอย่างน้อย 2 ตัวอักษร',
    'string.max': 'ชื่อต้องไม่เกิน 100 ตัวอักษร'
  }),
  phone: Joi.string()
    .pattern(/^[0-9+\-\s()]{6,20}$/)
    .messages({
      'string.pattern.base': 'รูปแบบเบอร์โทรไม่ถูกต้อง'
    }),
  address: Joi.string().max(500).messages({
    'string.max': 'ที่อยู่ต้องไม่เกิน 500 ตัวอักษร'
  })
})
.min(1)
.messages({
  'object.min': 'กรุณาระบุข้อมูลที่ต้องการแก้อย่างน้อย 1 ฟิลด์'
});
