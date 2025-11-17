import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { pool } from './db.js';
import movieRoutes from '../routes/movies.js'; // Elokuvien hakureitti
import userRoutes from '../routes/userRoutes.js'; // Käyttäjärekisteröinti- ja kirjautumisreitit

const app = express();
app.use(cors()); // Sallitaan pyynnöt frontendistä (eri portista)
app.use(express.json()); // Parsitaan JSON-pyyntöjen body

// Root-reitti palvelimen toiminnan varmistamiseksi
app.get('/', (_req, res) => {
  res.send('Server is running');
});

app.use('/api', movieRoutes); // Rekisteröidään elokuvien hakureitti /api-polkuun
app.use('/api/users', userRoutes); // Rekisteröidään käyttäjän rekisteröinti- ja kirjautumisreitit /api/users-polkuun

// Health check -päätepiste: tarkistaa toimiiko backend ja tietokanta
app.get('/api/health', async (_req, res) => {
  try {
    const { rows } = await pool.query('SELECT NOW()');
    res.json({ ok: true, now: rows[0].now });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () =>
  console.log(`Backend running on http://localhost:${PORT}`)
);
