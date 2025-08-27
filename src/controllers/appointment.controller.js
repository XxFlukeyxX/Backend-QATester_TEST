import {
  createAppointmentService,
  getMyAppointmentsPatientService,
  getMyAppointmentsDoctorService
} from '../services/appointment.service.js';

export async function createAppointment(req, res, next) {
  try {
    const patientUserId = req.user?.sub;
    const { doctorId, slotId } = req.body;
    const result = await createAppointmentService({ patientUserId, doctorId, slotId });
    res.status(201).json({ message: 'จองนัดสำเร็จ', ...result });
  } catch (e) { next(e); }
}

export async function getMyAppointments(req, res, next) {
  try {
    const patientUserId = req.user?.sub;
    const items = await getMyAppointmentsPatientService({ patientUserId });
    res.json({ items });
  } catch (e) { next(e); }
}

export async function getMyAppointmentsDoctor(req, res, next) {
  try {
    const doctorUserId = req.user?.sub;
    const items = await getMyAppointmentsDoctorService({ doctorUserId });
    res.json({ items });
  } catch (e) { next(e); }
}
