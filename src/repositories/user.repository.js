import pool from '../config/db.js';

export async function findUserByEmail(email) {
  const [rows] = await pool.query(
    'SELECT * FROM users WHERE email=? LIMIT 1',
    [email]
  );
  return rows[0] || null;
}

export async function createUser({ name, email, passwordHash, role }) {
  const [res] = await pool.query(
    `INSERT INTO users (name, email, password, role) VALUES (?,?,?,?)`,
    [name, email, passwordHash, role]
  );
  return res.insertId;
}

export async function findUserById(id) {
  const [rows] = await pool.query(
    `SELECT id, name, email, role, phone, address, created_at
       FROM users
      WHERE id = ?
      LIMIT 1`,
    [id]
  );
  return rows[0] || null;
}

export async function updateUserById(id, fields = {}) {
  const allow = ['name', 'phone', 'address'];
  const sets = [];
  const params = [];
  for (const key of allow) {
    if (fields[key] !== undefined) {
      sets.push(`${key} = ?`);
      params.push(fields[key]);
    }
  }
  if (!sets.length) return 0;
  params.push(id);
  const [res] = await pool.query(
    `UPDATE users SET ${sets.join(', ')} WHERE id = ?`,
    params
  );
  return res.affectedRows;
}
