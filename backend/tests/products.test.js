// /home/z/my-project/UrbanDana/backend/tests/products.test.js
import { describe, it, expect, beforeAll } from "@jest/globals";
import request from "supertest";
import app from "../src/app.js";

describe("GET /api/products", () => {
  it("returns paginated list with items array and total", async () => {
    const res = await request(app).get("/api/products?limit=5");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("items");
    expect(res.body).toHaveProperty("total");
    expect(res.body).toHaveProperty("page", 1);
    expect(res.body).toHaveProperty("limit", 5);
    expect(Array.isArray(res.body.items)).toBe(true);
    expect(res.body.items.length).toBeLessThanOrEqual(5);
  });

  it("filters by category", async () => {
    const res = await request(app).get("/api/products?category=Bandana%20Caps");
    expect(res.status).toBe(200);
    expect(res.body.items.every((p) => p.category === "Bandana Caps")).toBe(true);
    expect(res.body.total).toBeGreaterThan(0);
  });

  it("filters by featured=true", async () => {
    const res = await request(app).get("/api/products?featured=true");
    expect(res.status).toBe(200);
    expect(res.body.items.every((p) => p.isFeatured === true)).toBe(true);
  });

  it("filters by limited=true", async () => {
    const res = await request(app).get("/api/products?limited=true");
    expect(res.status).toBe(200);
    expect(res.body.items.every((p) => p.isLimited === true)).toBe(true);
  });

  it("searches by query string", async () => {
    const res = await request(app).get("/api/products?q=red");
    expect(res.status).toBe(200);
    expect(res.body.total).toBeGreaterThan(0);
  });

  it("returns empty result set for non-matching query", async () => {
    const res = await request(app).get("/api/products?q=zzznonexistentzzz");
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(0);
    expect(res.body.items).toEqual([]);
  });

  it("includes images and variants in response", async () => {
    const res = await request(app).get("/api/products?limit=1");
    expect(res.body.items[0]).toHaveProperty("images");
    expect(Array.isArray(res.body.items[0].images)).toBe(true);
    expect(res.body.items[0].images.length).toBeGreaterThan(0);
    expect(res.body.items[0]).toHaveProperty("variants");
  });
});

describe("GET /api/products/:slug", () => {
  let firstSlug;

  beforeAll(async () => {
    const res = await request(app).get("/api/products?limit=1");
    firstSlug = res.body.items[0].slug;
  });

  it("returns single product by slug", async () => {
    const res = await request(app).get(`/api/products/${firstSlug}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("slug", firstSlug);
    expect(res.body).toHaveProperty("title");
    expect(res.body).toHaveProperty("description");
    expect(res.body).toHaveProperty("price");
  });

  it("returns 404 for nonexistent slug", async () => {
    const res = await request(app).get("/api/products/this-slug-does-not-exist-12345");
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error");
  });

  it("includes images and variants in single product", async () => {
    const res = await request(app).get(`/api/products/${firstSlug}`);
    expect(Array.isArray(res.body.images)).toBe(true);
    expect(res.body.images.length).toBeGreaterThan(0);
  });
});

describe("GET /api/products/meta/categories", () => {
  it("returns distinct category list", async () => {
    const res = await request(app).get("/api/products/meta/categories");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toContain("Bandana Caps");
    expect(res.body).toContain("T-Shirts");
    expect(res.body).toContain("Limited Edition");
    expect(res.body).toContain("Combo");
  });

  it("does not duplicate categories", async () => {
    const res = await request(app).get("/api/products/meta/categories");
    expect(res.status).toBe(200);
    const unique = new Set(res.body);
    expect(unique.size).toBe(res.body.length);
  });
});
