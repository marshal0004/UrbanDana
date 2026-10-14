// /home/z/my-project/UrbanDana/backend/tests/payments.test.js
import { describe, it, expect, beforeAll } from "@jest/globals";
import request from "supertest";
import app from "../src/app.js";

let customerToken;

beforeAll(async () => {
  const email = `jest_pay_${Date.now()}@jest.test`;
  const regRes = await request(app)
    .post("/api/auth/register")
    .send({
      email,
      password: "testpass123",
      firstName: "Pay",
      lastName: "Test",
    });
  customerToken = regRes.body.token;
});

describe("GET /api/payments/health", () => {
  it("returns razorpay=false and mode=COD_ONLY when keys not set", async () => {
    const res = await request(app).get("/api/payments/health");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("razorpay", false);
    expect(res.body).toHaveProperty("mode", "COD_ONLY");
  });
});

describe("POST /api/payments/create-order", () => {
  it("returns 401 without auth", async () => {
    const res = await request(app)
      .post("/api/payments/create-order")
      .send({ amount: 149900 });
    expect(res.status).toBe(401);
  });

  it("returns 400 when amount < 100 paise", async () => {
    const res = await request(app)
      .post("/api/payments/create-order")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ amount: 50 });
    expect(res.status).toBe(400);
  });

  it("returns 400 when amount missing", async () => {
    const res = await request(app)
      .post("/api/payments/create-order")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({});
    expect(res.status).toBe(400);
  });

  it("returns 503 with 'Razorpay not configured' when keys missing", async () => {
    const res = await request(app)
      .post("/api/payments/create-order")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ amount: 149900 });
    expect(res.status).toBe(503);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toMatch(/Razorpay not configured/);
    expect(res.body).toHaveProperty("mode", "COD_ONLY");
  });
});

describe("POST /api/payments/verify", () => {
  it("returns 401 without auth", async () => {
    const res = await request(app)
      .post("/api/payments/verify")
      .send({
        razorpay_order_id: "fake",
        razorpay_payment_id: "fake",
        razorpay_signature: "fake",
      });
    expect(res.status).toBe(401);
  });

  it("returns 400 when payment fields missing", async () => {
    const res = await request(app)
      .post("/api/payments/verify")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({});
    expect(res.status).toBe(400);
  });

  it("returns 503 when Razorpay not configured", async () => {
    const res = await request(app)
      .post("/api/payments/verify")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({
        razorpay_order_id: "fake",
        razorpay_payment_id: "fake",
        razorpay_signature: "fake",
      });
    expect(res.status).toBe(503);
  });
});
