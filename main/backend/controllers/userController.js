import { findUserByEmail, createUser } from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import { pool } from '../src/db.js'


//Rekisteröi uuden käyttäjän tarkistamalla ensin, onko sähköpostiosoite jo käytössä
export async function register(req, res) {
  const { email, displayName, password } = req.body;
  try {
    // Tarkistetaan, onko käyttäjä jo rekisteröity sähköpostilla
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Luodaan uusi käyttäjä tietokantaan
    const user = await createUser(email, displayName, password);
    res.status(201).json({ message: 'User registered successfully', userId: user.id });

  } catch (err) {
    // Virhetilanteessa palautetaan palvelinvirheviesti
    res.status(500).json({ message: 'Registration error' });
  }
}

//Kirjaa käyttäjän sisään tarkistamalla sähköposti ja salasana
export async function login(req, res) {
  const { email, password } = req.body;
  try {
    // Haetaan käyttäjä sähköpostilla
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Verrataan lähetettyä salasanaa tietokannan hashattuun salasanaan
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Kirjautuminen onnistui, palautetaan käyttäjätiedot
    res.status(200).json({ message: 'Login successful', userId: user.id, displayName: user.display_name });

  } catch (err) {
    // Virhetilanteessa palautetaan palvelinvirheviesti
    res.status(500).json({ message: 'Login error' });
  }
}

export async function deleteUser(req, res) {
  const idParam = req.params.id; 
  
  const id = Number(idParam);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ message: 'Invalid user id'});
  }

  try {
    const result = await pool.query(
      `DELETE FROM users
      WHERE id = $1
      RETURNING id, email, display_name`,
    [id]
    );

    if (result.rowCount === 0) {
      return res.status(400).json({ message: 'User not found' });
    }

    return res.status(200).json({
      message: 'User deleted successfully',
      user: result.rows[0],
    });
  } catch (err) {
    console.error('Delete user error', err);
    return res.status(500).json({ message: 'Delete user failed'});
  }
}