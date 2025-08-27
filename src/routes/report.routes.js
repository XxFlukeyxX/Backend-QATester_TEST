import { Router } from 'express';
import { auth, allow } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { getAppointmentsReport } from '../controllers/report.controller.js';
import { reportAppointmentsSchema } from '../validators/report.validator.js';

const router = Router();

router.get(
  '/appointments',
  auth(true), allow('doctor'),
  validate(reportAppointmentsSchema),
  getAppointmentsReport
);

export default router;
