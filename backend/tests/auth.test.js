// /home/z/my-project/UrbanDana/backend/tests/auth.test.js
import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import request from "supertest";
import app from "../src/app.js";
import prisma from "../src/lib/prisma.js";

const TEST_PASSWORD = "testpass123";

async function cleanupTestUser(email) {
  try {
    await prisma.user.delete({ where: { email } });
  } catch {}
}

describe("POST /api/auth/register", () => {
  const email = `jest_auth_${Date.now()}@jest.test`;

  afterAll(async () => await cleanupTestUser(email));

  it("registers a new customer and returns token + user with role CUSTOMER", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        email,
        password: TEST_PASSWORD,
        firstName: "Jest",
        lastName: "User",
        phone: "+91 9999999999",
      });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("token");
    expect(typeof res.body.token).toBe("string");
    expect(res.body.user).toHaveProperty("email", email);
    expect(res.body.user).toHaveProperty("role", "CUSTOMER");
  });

  it("rejects duplicate email with 409", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email, password: TEST_PASSWORD });
    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty("error");
  });

  it("returns 400 when email or password missing", async () => {
    const res = await request(app).post("/api/auth/register").send({});
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });
});

describe("POST /api/auth/login", () => {
  const email = `jest_login_${Date.now()}@jest.test`;

  beforeAll(async () => {
    await cleanupTestUser(email);
    await request(app).post("/api/auth/register").send({
      email, password: TEST_PASSWORD, firstName: "Login", lastName: "Test",
    });
  });

  afterAll(async () => await cleanupTestUser(email));

  it("logs in with valid credentials and returns token", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email, password: TEST_PASSWORD,
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user).toHaveProperty("email", email);
  });

  it("rejects wrong password with 401", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email, password: "wrongpassword",
    });
    expect(res.status).toBe(401);
  });

  it("rejects unknown user with 401", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "nobody@nowhere.test", password: "x",
    });
    expect(res.status).toBe(401);
  });
});

describe("GET /api/auth/me", () => {
  const email = `jest_me_${Date.now()}@jest.test`;
  let token;

  beforeAll(async () => {
    await cleanupTestUser(email);
    const res = await request(app).post("/api/auth/register").send({
      email, password: TEST_PASSWORD, firstName: "Me", lastName: "Test",
    });
    token = res.body.token;
  });

  afterAll(async () => await cleanupTestUser(email));

  it("returns current user when valid token provided", async () => {
    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.user).toHaveProperty("email", email);
    expect(res.body.user).toHaveProperty("firstName", "Me");
  });

  it("returns 401 without token", async () => {
    const res = await request(app).get("/api/auth/me");
    expect(res.status).toBe(401);
  });

  it("returns 401 with invalid token", async () => {
    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", "Bearer invalidtoken123");
    expect(res.status).toBe(401);
  });
});
