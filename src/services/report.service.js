import { thaiDateToUtcRange } from '../utils/daterange.js';
import {
  countAppointmentsByHour,
  countAppointmentsTotal,
  mapUtcHourToThai
} from '../repositories/report.repository.js';
import pool from '../config/db.js';

async function findDoctorIdByUserId(userId) {
  const [rows] = await pool.query(`SELECT id FROM doctors WHERE user_id = ? LIMIT 1`, [userId]);
  return rows[0]?.id || null;
}

export async function reportAppointmentsService({ date, userId, role }) {
  if (role !== 'doctor') {
    throw { status: 403, response: { message: 'อนุญาตเฉพาะแพทย์' } };
  }

  const doctorId = await findDoctorIdByUserId(userId);
  if (!doctorId) throw { status: 403, response: { message: 'ไม่พบสิทธิ์แพทย์ของผู้ใช้' } };

  const { startUtc, endUtc } = thaiDateToUtcRange(date);

  const [byHour, total] = await Promise.all([
    countAppointmentsByHour({ startUtc, endUtc, doctorId }),
    countAppointmentsTotal({ startUtc, endUtc, doctorId })
  ]);

  const hours = Array.from({ length: 24 }, (_, h) => h);
  const map = new Map();
  for (const row of byHour) {
    const thHour = mapUtcHourToThai(row.hour_utc);
    map.set(thHour, Number(row.total));
  }
  const perHour = hours.map(h => ({ hour_th: h, total: map.get(h) || 0 }));

  return {
    date,            
    doctorId,        
    total,           
    per_hour: perHour
  };
}
