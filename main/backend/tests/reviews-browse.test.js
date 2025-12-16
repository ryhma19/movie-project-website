import request from 'supertest';
import app from '../src/app.js';
import { pool } from '../src/db.js';

describe('GET /api/reviews/movie/:tmdbId', () => {
  const tmdbId = 99999111;
  const missingTmdbId = 99999112;

  let userId;
  const displayName = 'TestUser';
  const reviewBody = 'Test review body';
  const rating = 4;

  beforeAll(async () => {
    await pool.query('DELETE FROM media WHERE tmdb_id IN ($1, $2) AND kind = $3', [
      tmdbId,
      missingTmdbId,
      'movie',
    ]);

    const email = `testreview${Date.now()}@example.com`;
    const created = await pool.query(
      'INSERT INTO users (email, display_name, password_hash) VALUES ($1, $2, $3) RETURNING id',
      [email, displayName, 'test_hash']
    );
    userId = created.rows[0].id;

    const createReviewRes = await request(app).post('/api/reviews').send({
      userId,
      tmdbId,
      rating,
      body: reviewBody,
    });

    expect(createReviewRes.status).toBe(201);
    expect(createReviewRes.body?.success).toBe(true);
  });

  afterAll(async () => {
    await pool.query('DELETE FROM media WHERE tmdb_id IN ($1, $2) AND kind = $3', [
      tmdbId,
      missingTmdbId,
      'movie',
    ]);
    await pool.query('DELETE FROM users WHERE id = $1', [userId]);
  });

  test('Palauttaa arvostelut olemassa olevalle tmdbId:lle (200)', async () => {
    const res = await request(app).get(`/api/reviews/movie/${tmdbId}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.reviews)).toBe(true);
    expect(res.body.reviews.length).toBeGreaterThan(0);

    const r = res.body.reviews[0];
    expect(r.user_id).toBe(userId);
    expect(r.rating).toBe(rating);
    expect(r.body).toBe(reviewBody);
    expect(r.display_name).toBe(displayName);
  });

  test('Palauttaa keskiarvon ja määrän (200)', async () => {
    const res = await request(app).get(`/api/reviews/movie/${tmdbId}/average`);

    expect(res.status).toBe(200);
    expect(res.body.count).toBe(1);
    expect(res.body.average).toBe(rating);
  });

  test('Tuntematon tmdbId palauttaa tyhjän listan (200)', async () => {
    const res = await request(app).get(`/api/reviews/movie/${missingTmdbId}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.reviews)).toBe(true);
    expect(res.body.reviews.length).toBe(0);
  });

  test('Tuntematon tmdbId palauttaa count 0 ja average 0 (200)', async () => {
    const res = await request(app).get(`/api/reviews/movie/${missingTmdbId}/average`);

    expect(res.status).toBe(200);
    expect(res.body.count).toBe(0);
    expect(res.body.average).toBe(0);
  });

  test('Virheellinen polku palauttaa 404', async () => {
    const res = await request(app).get('/api/reviews/movie');
    expect(res.status).toBe(404);
  });
});
