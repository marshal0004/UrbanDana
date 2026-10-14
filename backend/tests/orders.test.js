// /home/z/my-project/UrbanDana/backend/tests/orders.test.js
import { describe, it, expect, beforeAll } from "@jest/globals";
import request from "supertest";
import app from "../src/app.js";

let productId;
let orderNumber;

beforeAll(async () => {
  const res = await request(app).get("/api/products?limit=1");
  productId = res.body.items[0].id;
});

describe("POST /api/orders", () => {
  it("creates an order and returns orderNumber + totalAmount", async () => {
    const res = await request(app)
      .post("/api/orders")
      .send({
        email: `jest_order_${Date.now()}@jest.test`,
        phone: "+91 9999999999",
        firstName: "Jest",
        lastName: "Order",
        address: "123 Test St",
        city: "Mumbai",
        state: "MH",
        pincode: "400001",
        items: [{ productId, quantity: 2 }],
        paymentMethod: "COD",
      });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("orderNumber");
    expect(res.body.orderNumber).toMatch(/^UD-/);
    expect(res.body).toHaveProperty("totalAmount");
    expect(res.body.totalAmount).toBeGreaterThan(0);
    expect(res.body).toHaveProperty("status", "PENDING");
    expect(res.body).toHaveProperty("paymentMethod", "COD");
    orderNumber = res.body.orderNumber;
  });

  it("returns 400 when items array is empty", async () => {
    const res = await request(app)
      .post("/api/orders")
      .send({
        email: "jest@jest.test",
        phone: "x",
        firstName: "A",
        lastName: "B",
        address: "x",
        city: "x",
        state: "x",
        pincode: "x",
        items: [],
      });
    expect(res.status).toBe(400);
  });
});

describe("GET /api/orders/:orderNumber", () => {
  it("fetches order by orderNumber", async () => {
    const res = await request(app).get(`/api/orders/${orderNumber}`);
    expect(res.status).toBe(200);
    expect(res.body.orderNumber).toBe(orderNumber);
    expect(res.body.items.length).toBeGreaterThan(0);
  });

  it("returns 404 for unknown orderNumber", async () => {
    const res = await request(app).get("/api/orders/UD-FAKE-DOESNOTEXIST");
    expect(res.status).toBe(404);
  });
});

describe("GET /api/orders (list)", () => {
  it("returns 401 without authentication", async () => {
    const res = await request(app).get("/api/orders");
    expect(res.status).toBe(401);
  });

  it("returns orders list when authenticated as admin", async () => {
    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({ email: "admin@urbandana.in", password: "admin123" });
    expect(loginRes.status).toBe(200);

    const res = await request(app)
      .get("/api/orders")
      .set("Authorization", `Bearer ${loginRes.body.token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
});
