import request from 'supertest';
import app from '../src/app.js';
import { pool } from '../src/db.js';

describe('POST /api/users/register', () => {
  const testUser = {
    email: 'register.test@example.com',
    displayName: 'Register Test User',
    password: 'secret123',
  };

  beforeAll(async () => {
    await pool.query('DELETE FROM users WHERE email = $1', [testUser.email]);
  });

  afterAll(async () => {
    await pool.query('DELETE FROM users WHERE email = $1', [testUser.email]);
  });

  test('onnistuu uusilla tiedoilla', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        email: testUser.email,
        displayName: testUser.displayName,
        password: testUser.password,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('User registered successfully');
    expect(res.body).toHaveProperty('userId');
  });

  test('epäonnistuu, jos sähköposti on jo käytössä', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        email: testUser.email,
        displayName: testUser.displayName,
        password: testUser.password,
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Email already registered');
  });

  test('epäonnistuu, jos pakolliset kentät puuttuvat', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        email: '',
        displayName: '',
        password: '',
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe(
      'All fields are required'
    );
  });
});
