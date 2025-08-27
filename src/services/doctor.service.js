import {
  searchDoctorsBySpecialtyName,
  searchDoctorsBySpecialtyId,
  findDoctorByUserId,
  insertDoctorSlotsPrepared,
  listDoctorSlots,
  updateDoctorSlotPrepared,
  deleteDoctorSlot
} from '../repositories/doctor.repository.js';

export async function searchDoctorService({ specialty, specialty_id }) {
  if (specialty_id !== undefined && specialty_id !== null && specialty_id !== '') {
    const id = Number(specialty_id);
    if (!Number.isInteger(id) || id <= 0) {
      const err = new Error('specialty_id ต้องเป็นจำนวนเต็มบวก'); err.status = 400; throw err;
    }
    return searchDoctorsBySpecialtyId(id);
  }
  return searchDoctorsBySpecialtyName((specialty || '').trim());
}

export async function addSlotsService({ userId, doctorId, prepared }) {
  const mine = await findDoctorByUserId(userId);
  if (!mine || mine.id !== Number(doctorId)) {
    throw { status: 403, response: { message: 'คุณไม่มีสิทธิ์เพิ่มเวลาว่างให้หมอคนนี้' } };
  }
  if (!Array.isArray(prepared) || prepared.length === 0) {
    throw { status: 400, response: { message: 'ไม่มีข้อมูลสล็อทที่จะเพิ่ม' } };
  }
  const added = await insertDoctorSlotsPrepared(doctorId, prepared);
  return { added };
}

export async function getSlotsService(doctorId) {
  const id = Number(doctorId);
  if (!Number.isInteger(id) || id <= 0) {
    const err = new Error('doctorId ไม่ถูกต้อง'); err.status = 400; throw err;
  }
  return listDoctorSlots(id);
}

export async function updateSlotService({ userId, doctorId, slotId, prepared }) {
  const mine = await findDoctorByUserId(userId);
  if (!mine || mine.id !== Number(doctorId)) {
    throw { status: 403, response: { message: 'คุณไม่มีสิทธิ์แก้ไขเวลาว่างของหมอคนนี้' } };
  }
  return updateDoctorSlotPrepared(Number(doctorId), Number(slotId), prepared);
}

export async function deleteSlotService({ userId, doctorId, slotId }) {
  const mine = await findDoctorByUserId(userId);
  if (!mine || mine.id !== Number(doctorId)) {
    throw { status: 403, response: { message: 'คุณไม่มีสิทธิ์ลบเวลาว่างของหมอคนนี้' } };
  }
  return deleteDoctorSlot(Number(doctorId), Number(slotId));
}
