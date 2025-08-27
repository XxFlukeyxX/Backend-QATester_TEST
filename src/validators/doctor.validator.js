import Joi from 'joi';

export const searchDoctorSchema = Joi.object({
  specialty: Joi.string().trim().allow('', null),
  specialty_id: Joi.number().integer().positive()
}).xor('specialty', 'specialty_id');

export const addSlotsSchema = Joi.object({
  slots: Joi.array().items(Joi.string().min(3).required()).min(1).required()
});

export const updateSlotSchema = Joi.object({
  slot: Joi.string().min(3).required()
});
