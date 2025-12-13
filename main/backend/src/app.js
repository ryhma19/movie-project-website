import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { pool } from './db.js'; // Fixed: app.js is in src/, so just ./db.js

import userRoutes from '../routes/userRoutes.js'; // Käyttäjärekisteröinti- ja kirjautumisreitit
import favoriteRoutes from '../routes/favoriteRoutes.js'; // Suosikkilistan reitit
import movieRoutes from '../routes/movies.js'; // Elokuvien hakureitti
import reviewRoutes from '../routes/reviewRoutes.js'; // Arvostelureitit

// ryhmäreitit
import groupRoutes from '../routes/groupRoutes.js'; // Ryhmien luonti, jäsenet, poistot

const app = express();
app.use(cors()); // Sallitaan pyynnöt frontendistä (eri portista)
app.use(express.json()); // Parsitaan JSON-pyyntöjen body

// Root-reitti palvelimen toiminnan varmistamiseksi
app.get('/', (_req, res) => {
  res.send('Server is running');
});

// app.use('/api', movieRoutes); // Rekisteröidään elokuvien hakureitti /api-polkuun
app.use('/api/users', userRoutes); // Rekisteröidään käyttäjän rekisteröinti- ja kirjautumisreitit /api/users-polkuun
app.use('/api/favorites', favoriteRoutes); // Rekisteröidään suosikkilistan reitit /api/favorites-polkuun
app.use('/api/reviews', reviewRoutes); // Rekisteröidään arvostelureitit /api/reviews-polkuun

// rekisteröidään ryhmäreitit /api/groups
app.use('/api/groups', groupRoutes); // Rekisteröidään ryhmätoiminnot

// Health check -päätepiste: tarkistaa toimiiko backend ja tietokanta
app.get('/api/health', async (_req, res) => {
  try {
    const { rows } = await pool.query('SELECT NOW()');
    res.json({ ok: true, now: rows[0].now });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.use('/api/movies', movieRoutes);

export default app;
