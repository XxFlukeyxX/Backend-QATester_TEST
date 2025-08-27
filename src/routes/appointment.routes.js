import { Router } from 'express';
import { createAppointment, getMyAppointments, getMyAppointmentsDoctor } from '../controllers/appointment.controller.js';
import { validate } from '../middlewares/validate.js';
import { auth, allow } from '../middlewares/auth.js';
import { createAppointmentSchema } from '../validators/appointment.validator.js';

const router = Router();

router.post('/', auth(true), allow('patient'), validate(createAppointmentSchema), createAppointment);

router.get('/me', auth(true), allow('patient'), getMyAppointments);

router.get('/doctor/me', auth(true), allow('doctor'), getMyAppointmentsDoctor);

export default router;
