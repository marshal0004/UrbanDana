import express from "express";
import cors from "cors";
import "dotenv/config";

import productsRouter from "./routes/products.js";
import authRouter from "./routes/auth.js";
import cartRouter from "./routes/cart.js";
import ordersRouter from "./routes/orders.js";
import cmsRouter from "./routes/cms.js";

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN?.split(",") || "*", credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use("/uploads", express.static("uploads"));

// Simple request logger for dev
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

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

// 404
app.use((req, res) => res.status(404).json({ error: "Not found", path: req.path }));

// Error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error", message: err.message });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🧢 UrbanDana API running at http://localhost:${PORT}`);
  console.log(`   → http://localhost:${PORT}/api/products`);
});
