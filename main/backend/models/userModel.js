import { pool } from '../src/db.js';
import bcrypt from 'bcryptjs';


export async function findUserByEmail(email) {
  const res = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return res.rows[0];
}

export async function createUser(email, displayName, password) {
  const passwordHash = await bcrypt.hash(password, 10);
  const res = await pool.query(
    `INSERT INTO users (email, display_name, password_hash) VALUES ($1, $2, $3) RETURNING *`,
    [email, displayName, passwordHash]
  );
  return res.rows[0];
}
