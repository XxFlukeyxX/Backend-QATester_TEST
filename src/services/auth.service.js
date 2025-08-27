import bcrypt from 'bcryptjs';
import { signToken } from '../utils/jwt.js';
import { createUser, findUserByEmail } from '../repositories/user.repository.js';
import { createDoctorProfile, specialtyExists } from '../repositories/doctor.repository.js';

export async function registerService({ name, email, password, role, specialty }) {
  const existing = await findUserByEmail(email);
  if (existing) { const e = new Error('อีเมลนี้ถูกใช้แล้ว'); e.status = 409; throw e; }

  if (role === 'doctor') {
    const ok = await specialtyExists(specialty);
    if (!ok) { const e = new Error('ไม่พบ specialty id นี้'); e.status = 400; throw e; }
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const userId = await createUser({ name, email, passwordHash, role });

  if (role === 'doctor') {
    await createDoctorProfile({ userId, specialtyId: specialty });
  }

  const token = signToken({ sub: userId, role });
  return { token, user: { id: userId, name, email, role } };
}

export async function loginService({ email, password }) {
  const user = await findUserByEmail(email);
  if (!user) { const e = new Error('อีเมลหรือรหัสผ่านไม่ถูกต้อง'); e.status = 401; throw e; }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) { const e = new Error('อีเมลหรือรหัสผ่านไม่ถูกต้อง'); e.status = 401; throw e; }

  const token = signToken({ sub: user.id, role: user.role });
  const { password: _omit, ...safeUser } = user;
  return { token, user: safeUser };
}
