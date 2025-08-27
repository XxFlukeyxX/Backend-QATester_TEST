import Joi from 'joi';

export const createAppointmentSchema = Joi.object({
  doctorId: Joi.number().integer().positive().required(),
  slotId:   Joi.number().integer().positive().required()
});
