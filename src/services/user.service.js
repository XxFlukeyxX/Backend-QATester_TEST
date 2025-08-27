import { findUserById, updateUserById } from '../repositories/user.repository.js';

export async function getMeService(userId) {
  const user = await findUserById(userId);
  if (!user) throw { status: 404, response: { message: 'ไม่พบผู้ใช้' } };
  return user;
}

export async function updateMeService(userId, payload) {
  const allowed = (({ name, phone, address }) => ({ name, phone, address }))(payload);

  const changed = await updateUserById(userId, allowed);
  if (!changed) throw { status: 400, response: { message: 'ไม่มีข้อมูลที่เปลี่ยนแปลง' } };

  return getMeService(userId);
}
