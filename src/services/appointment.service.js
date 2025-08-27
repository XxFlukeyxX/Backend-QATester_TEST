import {
  createAppointmentTx,
  listAppointmentsForPatient,
  listAppointmentsForDoctor
} from '../repositories/appointment.repository.js';

export async function createAppointmentService({ patientUserId, doctorId, slotId }) {
  const did = Number(doctorId), sid = Number(slotId);
  if (!Number.isInteger(did) || did <= 0) { const e = new Error('doctorId ไม่ถูกต้อง'); e.status = 400; throw e; }
  if (!Number.isInteger(sid) || sid <= 0) { const e = new Error('slotId ไม่ถูกต้อง'); e.status = 400; throw e; }
  return createAppointmentTx({ patientId: patientUserId, doctorId: did, slotId: sid });
}

export async function getMyAppointmentsPatientService({ patientUserId }) {
  return listAppointmentsForPatient(patientUserId);
}

export async function getMyAppointmentsDoctorService({ doctorUserId }) {
  return listAppointmentsForDoctor(doctorUserId);
}
