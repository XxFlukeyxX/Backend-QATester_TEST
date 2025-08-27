import pool from '../config/db.js';

export async function specialtyExists(id) {
  const [rows] = await pool.query(`SELECT id FROM specialties WHERE id=? LIMIT 1`, [id]);
  return !!rows[0];
}
export async function createDoctorProfile({ userId, specialtyId }) {
  const [res] = await pool.query(
    `INSERT INTO doctors (user_id, specialty_id) VALUES (?, ?)`,
    [userId, specialtyId]
  );
  return res.insertId;
}

export async function searchDoctorsBySpecialtyName(keyword = '') {
  const like = `%${keyword}%`;
  const [rows] = await pool.query(
    `SELECT d.id AS doctor_id,
            u.id AS user_id,
            u.name AS doctor_name,
            u.email,
            s.id AS specialty_id,
            s.name AS specialty
       FROM doctors d
       JOIN users u       ON u.id = d.user_id
       JOIN specialties s ON s.id = d.specialty_id
      WHERE s.name LIKE ?
      ORDER BY u.name ASC`,
    [like]
  );
  return rows;
}
export async function searchDoctorsBySpecialtyId(id) {
  const [rows] = await pool.query(
    `SELECT d.id AS doctor_id,
            u.id AS user_id,
            u.name AS doctor_name,
            u.email,
            s.id AS specialty_id,
            s.name AS specialty
       FROM doctors d
       JOIN users u       ON u.id = d.user_id
       JOIN specialties s ON s.id = d.specialty_id
      WHERE s.id = ?
      ORDER BY u.name ASC`,
    [id]
  );
  return rows;
}

export async function findDoctorByUserId(userId) {
  const [rows] = await pool.query(
    `SELECT id, user_id, specialty_id FROM doctors WHERE user_id = ? LIMIT 1`,
    [userId]
  );
  return rows[0] || null;
}
export async function insertDoctorSlotsPrepared(doctorId, preparedSlots = []) {
  if (!preparedSlots.length) return 0;
  const values = preparedSlots.map(() => '(?,?,0,?,?)').join(',');
  const params = [];
  preparedSlots.forEach(p => { params.push(doctorId, p.mysqlUTC, p.th, p.en); });
  const [res] = await pool.query(
    `INSERT INTO doctor_slots (doctor_id, slot_time, is_booked, slot_time_th, slot_time_en)
     VALUES ${values}`,
    params
  );
  return res.affectedRows;
}
export async function listDoctorSlots(doctorId) {
  const [rows] = await pool.query(
    `SELECT id, slot_time, is_booked, slot_time_th, slot_time_en
       FROM doctor_slots
      WHERE doctor_id = ?
      ORDER BY slot_time ASC`,
    [doctorId]
  );
  return rows;
}

export async function updateDoctorSlotPrepared(doctorId, slotId, prepared) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [rows] = await conn.query(
      `SELECT id, doctor_id, is_booked FROM doctor_slots WHERE id=? FOR UPDATE`,
      [slotId]
    );
    const slot = rows[0];
    if (!slot) throw { status: 404, response: { message: 'ไม่พบ slot นี้' } };
    if (slot.doctor_id !== doctorId) throw { status: 403, response: { message: 'ไม่มีสิทธิ์แก้ไข slot นี้' } };
    if (slot.is_booked) throw { status: 409, response: { message: 'slot นี้ถูกจองไปแล้ว แก้ไขไม่ได้' } };

    try {
      await conn.query(
        `UPDATE doctor_slots
           SET slot_time = ?, slot_time_th = ?, slot_time_en = ?
         WHERE id = ?`,
        [prepared.mysqlUTC, prepared.th, prepared.en, slotId]
      );
    } catch (e) {
      if (e?.code === 'ER_DUP_ENTRY') {
        throw { status: 409, response: { message: 'เวลานี้มีอยู่แล้ว' } };
      }
      throw e;
    }

    await conn.commit();
    return { updated: 1 };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

export async function deleteDoctorSlot(doctorId, slotId) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [rows] = await conn.query(
      `SELECT id, doctor_id, is_booked FROM doctor_slots WHERE id=? FOR UPDATE`,
      [slotId]
    );
    const slot = rows[0];
    if (!slot) throw { status: 404, response: { message: 'ไม่พบ slot นี้' } };
    if (slot.doctor_id !== doctorId) throw { status: 403, response: { message: 'ไม่มีสิทธิ์ลบ slot นี้' } };
    if (slot.is_booked) throw { status: 409, response: { message: 'slot นี้ถูกจองไปแล้ว ลบไม่ได้' } };

    await conn.query(`DELETE FROM doctor_slots WHERE id=?`, [slotId]);
    await conn.commit();
    return { deleted: 1 };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

export const searchDoctors = searchDoctorsBySpecialtyName;
