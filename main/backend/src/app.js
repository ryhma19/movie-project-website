import express from 'express';
import cors from 'cors';
import { pool } from './db.js';

import userRoutes from '../routes/userRoutes.js';
import favoriteRoutes from '../routes/favoriteRoutes.js';
import movieRoutes from '../routes/movies.js';
import reviewRoutes from '../routes/reviewRoutes.js';
import groupRoutes from '../routes/groupRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.send('Server is running');
});

app.use('/api/users', userRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/movies', movieRoutes);

app.get('/api/health', async (_req, res) => {
  try {
    const { rows } = await pool.query('SELECT NOW()');
    res.json({ ok: true, now: rows[0].now });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

export default app;
