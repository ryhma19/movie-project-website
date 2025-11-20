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

app.get('/api/now-playing', async (req, res) => {
  try {
    const region = req.query.region || 'FI';
    const language = req.query.language || 'fi-FI';
    const page = req.query.page || '1';

    const url = new URL('https://api.themoviedb.org/3/movie/now_playing');
    url.search = new URLSearchParams({ region, language, page });

    const tmdbRes = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
        'Content-Type': 'application/json;charset=utf-8',
      },
    });

    if (!tmdbRes.ok) {
      const text = await tmdbRes.text();
      return res.status(tmdbRes.status).json({ error: 'TMDB error', details: text });
    }

    const data = await tmdbRes.json();

    const results = (data.results || []).map(m => ({
      id: m.id,
      title: m.title,
      overview: m.overview,
      release_date: m.release_date,
      vote_average: m.vote_average,
      poster: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : null,
      backdrop: m.backdrop_path ? `https://image.tmdb.org/t/p/w780${m.backdrop_path}` : null,
    }));

    res.json({ page: data.page, total_pages: data.total_pages, results });
  } catch (e) {
    console.error('Now-playing error:', e);
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend running on http://0.0.0.0:${PORT}`);
});
