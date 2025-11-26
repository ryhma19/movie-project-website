import { pool } from '../src/db.js'; //Tuo tietokantayhteyden
import bcrypt from 'bcryptjs'; //Tuo bcrypt salasanojen hashaukseen

//Etsi käyttäjä sähköpostin perusteella
export async function findUserByEmail(email) {
  const res = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return res.rows[0] || null; // Palauta käyttäjä tai null, jos ei löydy
}

// Luo uusi käyttäjä tietokantaan
export async function createUser(email, displayName, password) {
  const passwordHash = await bcrypt.hash(password, 10); //Hashaa salasana
  const res = await pool.query(
    `INSERT INTO users (email, display_name, password_hash) VALUES ($1, $2, $3) RETURNING *`,
    [email, displayName, passwordHash]
  );
  return res.rows[0]; //Palauta luotu käyttäjä
}
