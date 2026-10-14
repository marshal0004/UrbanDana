// /home/z/my-project/UrbanDana/backend/tests/cms.test.js
import { describe, it, expect } from "@jest/globals";
import request from "supertest";
import app from "../src/app.js";

describe("GET /api/cms/founder", () => {
  it("returns founder story with name, origin, story", async () => {
    const res = await request(app).get("/api/cms/founder");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("name", "Vikram Kumar");
    expect(res.body).toHaveProperty("origin");
    expect(res.body.origin).toMatch(/Dehradun/);
    expect(res.body).toHaveProperty("story");
    expect(res.body.story.length).toBeGreaterThan(50);
  });
});

describe("GET /api/cms/brand", () => {
  it("returns brand info with name, tagline, country, established", async () => {
    const res = await request(app).get("/api/cms/brand");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("name", "URBANDANA");
    expect(res.body).toHaveProperty("tagline", "Style That Never Stops");
    expect(res.body).toHaveProperty("country", "India");
    expect(res.body).toHaveProperty("established", "2024");
  });
});

describe("GET / (health)", () => {
  it("returns API info with health=ok", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("name", "UrbanDana API");
    expect(res.body).toHaveProperty("health", "ok");
  });
});
