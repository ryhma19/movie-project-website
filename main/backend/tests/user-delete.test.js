import request from "supertest";
import app from "../src/app.js";

describe("DELETE /api/users/:id", () => {
  let createdUserId;
  const email = `test_example_${Date.now()}@example.com`;
  const displayName = "Test Delete User";
  const password = "TestPassword123!";

  beforeAll(async () => {
    const res = await request(app)
      .post("/api/users/register")
      .send({ email, displayName, password });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("userId");

    createdUserId = res.body.userId;
  });

  test("Poistaa olemassa olevan käyttäjän (200)", async () => {
    const res = await request(app).delete(`/api/users/${createdUserId}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "User deleted successfully");

    expect(res.body).toHaveProperty("user");
    expect(res.body.user).toHaveProperty("id");
    expect(res.body.user).toHaveProperty("email");
    expect(res.body.user).toHaveProperty("display_name");
  });

  test("Toinen poisto samalle id:lle epäonnistuu (User not found)", async () => {
    const res = await request(app).delete(`/api/users/${createdUserId}`);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message", "User not found");
  });

  test("Virheellinen id -> 400 Invalid user id", async () => {
    const res = await request(app).delete("/api/users/abc");

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message", "Invalid user id");
  });

  test("Virheellinen id -> 400 Invalid user id", async () => {
    const res = await request(app).delete("/api/users/0");

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message", "Invalid user id");
  });
});
