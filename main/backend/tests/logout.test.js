import request from "supertest";
import app from "../src/app.js";

describe("POST /api/users/logout", () => {
  test("Palauttaa 200 ja viestin Logged out", async () => {
    const res = await request(app).post("/api/users/logout");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Logged out");
  });
});
