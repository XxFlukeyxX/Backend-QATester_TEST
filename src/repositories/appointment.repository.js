import pool from '../config/db.js';

export async function createAppointmentTx({ patientId, doctorId, slotId }) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [slotRows] = await conn.query(
      `SELECT id, doctor_id, is_booked, slot_time, slot_time_th, slot_time_en
         FROM doctor_slots
        WHERE id = ?
        FOR UPDATE`,
      [slotId]
    );
    const slot = slotRows[0];
    if (!slot) {
      const e = new Error('ไม่พบ slot ที่เลือก');
      e.status = 404; throw e;
    }
    if (slot.doctor_id !== doctorId) {
      const e = new Error('slot นี้ไม่ใช่ของแพทย์ที่ระบุ');
      e.status = 400; throw e;
    }
    if (slot.is_booked) {
    const err = { status: 409, response: { message: 'slot นี้ถูกจองไปแล้ว' } };
    throw err;
    }

    const [ins] = await conn.query(
      `INSERT INTO appointments (patient_id, doctor_id, slot_id)
       VALUES (?,?,?)`,
      [patientId, doctorId, slotId]
    );

    await conn.query(
      `UPDATE doctor_slots SET is_booked = 1 WHERE id = ?`,
      [slotId]
    );

    await conn.commit();
    return {
      appointmentId: ins.insertId,
      slot: {
        id: slot.id,
        slot_time: slot.slot_time,       
        slot_time_th: slot.slot_time_th, 
        slot_time_en: slot.slot_time_en  
      }
    };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

export async function listAppointmentsForPatient(userId) {
  const [rows] = await pool.query(
    `SELECT a.id AS appointment_id,
            a.created_at,
            d.id AS doctor_id,
            du.name AS doctor_name,
            du.email AS doctor_email,
            s.name AS specialty,
            ds.id AS slot_id,
            ds.slot_time,
            ds.slot_time_th,
            ds.slot_time_en
       FROM appointments a
       JOIN doctors d         ON d.id = a.doctor_id
       JOIN users du          ON du.id = d.user_id
       JOIN specialties s     ON s.id = d.specialty_id
       JOIN doctor_slots ds   ON ds.id = a.slot_id
      WHERE a.patient_id = ?
      ORDER BY ds.slot_time ASC`,
    [userId]
  );
  return rows;
}

export async function listAppointmentsForDoctor(userId) {
  const [docRows] = await pool.query(
    `SELECT id FROM doctors WHERE user_id = ? LIMIT 1`,
    [userId]
  );
  const doc = docRows[0];
  if (!doc) return [];

  const [rows] = await pool.query(
    `SELECT a.id AS appointment_id,
            a.created_at,
            u.id AS patient_id,
            u.name AS patient_name,
            u.email AS patient_email,
            ds.id AS slot_id,
            ds.slot_time,
            ds.slot_time_th,
            ds.slot_time_en
       FROM appointments a
       JOIN users u         ON u.id = a.patient_id
       JOIN doctor_slots ds ON ds.id = a.slot_id
      WHERE a.doctor_id = ?
      ORDER BY ds.slot_time ASC`,
    [doc.id]
  );
  return rows;
}
