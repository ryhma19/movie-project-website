import request from 'supertest';
import app from '../src/app.js';
import { pool } from '../src/db.js';
import { createUser } from '../models/userModel.js';

describe('POST /api/users/login', () => {
  const testUser = {
    email: 'test.login@example.com',
    displayName: 'Test Login',
    password: 'secret123',
  };

  beforeAll(async () => {
    await pool.query('DELETE FROM users WHERE email = $1', [testUser.email]);
    await createUser(
      testUser.email,
      testUser.displayName,
      testUser.password
    );
  });

  afterAll(async () => {
    await pool.end();
  });

  test('onnistuu oikeilla tunnuksilla', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Login successful');
    expect(res.body).toHaveProperty('userId');
    expect(res.body).toHaveProperty('displayName', testUser.displayName);
  });

  test('epäonnistuu väärällä salasanalla', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: testUser.email,
        password: 'wrong-password',
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Invalid email or password');
  });

  test('epäonnistuu, jos kentät puuttuvat', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Email and password are required');
  });
});
