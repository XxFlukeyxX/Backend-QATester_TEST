import pool from '../config/db.js';

export async function listSpecialties() {
  const [rows] = await pool.query(
    `SELECT id, name FROM specialties ORDER BY name ASC`
  );
  return rows;
}
