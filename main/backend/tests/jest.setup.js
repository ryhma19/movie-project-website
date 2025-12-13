import { pool } from "../src/db.js";

afterAll(async () => {
  await pool.end();
});
