import pool from '../config/db.js';

export async function countAppointmentsByHour({ startUtc, endUtc, doctorId }) {
  const [rows] = await pool.query(
    `SELECT HOUR(ds.slot_time) AS hour_utc, COUNT(*) AS total
       FROM appointments a
       JOIN doctor_slots ds ON ds.id = a.slot_id
      WHERE a.doctor_id = ?
        AND ds.slot_time >= ? AND ds.slot_time < ?
      GROUP BY HOUR(ds.slot_time)
      ORDER BY HOUR(ds.slot_time) ASC`,
    [doctorId, startUtc, endUtc]
  );
  return rows; 
}

export async function countAppointmentsTotal({ startUtc, endUtc, doctorId }) {
  const [rows] = await pool.query(
    `SELECT COUNT(*) AS total
       FROM appointments a
       JOIN doctor_slots ds ON ds.id = a.slot_id
      WHERE a.doctor_id = ?
        AND ds.slot_time >= ? AND ds.slot_time < ?`,
    [doctorId, startUtc, endUtc]
  );
  return rows[0]?.total || 0;
}

export function mapUtcHourToThai(utcHour) {
  return (Number(utcHour) + 7) % 24;
}
