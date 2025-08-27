import { Router } from 'express';
import authRoutes from './auth.routes.js';
import doctorRoutes from './doctor.routes.js';
import specialtyRoutes from './specialty.routes.js';
import appointmentRoutes from './appointment.routes.js';
import userRoutes from './user.routes.js';
import reportRoutes from './report.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/doctors', doctorRoutes);
router.use('/specialties', specialtyRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/users', userRoutes);
router.use('/reports', reportRoutes); 

export default router;