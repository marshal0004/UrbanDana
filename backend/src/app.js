// /home/z/my-project/UrbanDana/backend/src/app.js
import express from "express";
import cors from "cors";
import "dotenv/config";

// Ensure required env vars have safe defaults for test environment
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = "urbandana-test-secret";
}
if (!process.env.CORS_ORIGIN) {
  process.env.CORS_ORIGIN = "http://localhost:3000";
}

import productsRouter from "./routes/products.js";
import authRouter from "./routes/auth.js";
import cartRouter from "./routes/cart.js";
import ordersRouter from "./routes/orders.js";
import cmsRouter from "./routes/cms.js";
import paymentsRouter from "./routes/payments.js";

export function createApp() {
  const app = express();

  app.use(cors({ origin: process.env.CORS_ORIGIN?.split(",") || "*", credentials: true }));
  app.use(express.json({ limit: "10mb" }));
  app.use("/uploads", express.static("uploads"));

  app.get("/", (_req, res) => res.json({
    name: "UrbanDana API",
    version: "1.0.0",
    docs: "/api",
    health: "ok",
  }));

  app.use("/api/products", productsRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/cart", cartRouter);
  app.use("/api/orders", ordersRouter);
  app.use("/api/cms", cmsRouter);
  app.use("/api/payments", paymentsRouter);

  app.use((req, res) => res.status(404).json({ error: "Not found", path: req.path }));
  app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ error: "Internal server error", message: err.message });
  });

  return app;
}

export default createApp();
