import Joi from 'joi';

const th = {
  'any.required': 'ต้องระบุ {{#label}}',
  'string.empty': '{{#label}} ห้ามเว้นว่าง',
  'string.email': 'รูปแบบ {{#label}} ไม่ถูกต้อง',
  'string.min': '{{#label}} ต้องยาวอย่างน้อย {{#limit}} อักขระ',
  'any.only': '{{#label}} ไม่ถูกต้อง',
  'number.base': '{{#label}} ต้องเป็นตัวเลข',
  'number.integer': '{{#label}} ต้องเป็นจำนวนเต็ม',
  'number.positive': '{{#label}} ต้องมากกว่า 0'
};

const commonPrefs = {
  abortEarly: false,
  errors: {
    wrap: { label: false }   
  }
};

export const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).required().label('ชื่อ').messages(th),
  email: Joi.string().email({ tlds: { allow: false } }).required().label('อีเมล').messages(th),
  password: Joi.string().min(6).required().label('รหัสผ่าน').messages(th),
  role: Joi.string().valid('patient', 'doctor').required().label('บทบาท').messages(th),
  specialty: Joi.alternatives().conditional('role', {
    is: 'doctor',
    then: Joi.number().integer().positive().required().label('สาขา (specialty)').messages(th),
    otherwise: Joi.forbidden()
  })
}).prefs(commonPrefs);

export const loginSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).required().label('อีเมล').messages(th),
  password: Joi.string().min(6).required().label('รหัสผ่าน').messages(th)
}).prefs(commonPrefs);
