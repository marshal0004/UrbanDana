// /home/z/my-project/UrbanDana/backend/tests/cart.test.js
import { describe, it, expect, beforeAll } from "@jest/globals";
import request from "supertest";
import app from "../src/app.js";

const SESSION_ID = `jest_cart_${Date.now()}`;
let productId;
let itemId;

beforeAll(async () => {
  const res = await request(app).get("/api/products?limit=1");
  productId = res.body.items[0].id;
});

describe("GET /api/cart", () => {
  it("returns empty cart for new session", async () => {
    const res = await request(app)
      .get("/api/cart")
      .set("x-session-id", SESSION_ID);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("items");
    expect(Array.isArray(res.body.items)).toBe(true);
  });
});

describe("POST /api/cart/items", () => {
  it("adds a product to cart and returns updated cart with 1 item", async () => {
    const res = await request(app)
      .post("/api/cart/items")
      .set("x-session-id", SESSION_ID)
      .send({ productId, quantity: 2 });
    expect(res.status).toBe(200);
    expect(res.body.items.length).toBe(1);
    expect(res.body.items[0]).toHaveProperty("quantity", 2);
    itemId = res.body.items[0].id;
  });

  it("increments quantity when same product added again", async () => {
    const res = await request(app)
      .post("/api/cart/items")
      .set("x-session-id", SESSION_ID)
      .send({ productId, quantity: 1 });
    expect(res.status).toBe(200);
    expect(res.body.items.length).toBe(1);
    expect(res.body.items[0].quantity).toBe(3);
  });

  it("adds a second different product to cart", async () => {
    const allRes = await request(app).get("/api/products?limit=2");
    const secondId = allRes.body.items[1].id;
    const res = await request(app)
      .post("/api/cart/items")
      .set("x-session-id", SESSION_ID)
      .send({ productId: secondId, quantity: 1 });
    expect(res.status).toBe(200);
    expect(res.body.items.length).toBe(2);
  });
});

describe("PATCH /api/cart/items/:itemId", () => {
  it("updates item quantity", async () => {
    const res = await request(app)
      .patch(`/api/cart/items/${itemId}`)
      .set("x-session-id", SESSION_ID)
      .send({ quantity: 5 });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("quantity", 5);
  });

  it("clamps quantity to 1 when 0 provided", async () => {
    const res = await request(app)
      .patch(`/api/cart/items/${itemId}`)
      .set("x-session-id", SESSION_ID)
      .send({ quantity: 0 });
    expect(res.status).toBe(200);
    expect(res.body.quantity).toBeGreaterThanOrEqual(1);
  });
});

describe("DELETE /api/cart/items/:itemId", () => {
  it("removes an item from cart", async () => {
    const res = await request(app)
      .delete(`/api/cart/items/${itemId}`)
      .set("x-session-id", SESSION_ID);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("ok", true);
  });
});

describe("DELETE /api/cart (clear)", () => {
  it("clears all items from cart", async () => {
    const res = await request(app)
      .delete("/api/cart")
      .set("x-session-id", SESSION_ID);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("ok", true);

    const cartRes = await request(app)
      .get("/api/cart")
      .set("x-session-id", SESSION_ID);
    expect(cartRes.body.items.length).toBe(0);
  });
});
