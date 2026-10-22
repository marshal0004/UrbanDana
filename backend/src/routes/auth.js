import { Router } from "express";
import prisma from "../lib/prisma.js";
import { signToken, authMiddleware, requireAdmin } from "../lib/auth.js";
import bcrypt from "bcryptjs";

const router = Router();

router.post("/register", async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;
    if (!email || !password) return res.status(400).json({ error: "email and password required" });
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ error: "Email already registered" });
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashed, firstName, lastName, phone },
    });
    const token = signToken({ id: user.id, email: user.email, role: user.role });
    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
      },
    });
  } catch (e) {
    next(e);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });
    const token = signToken({ id: user.id, email: user.email, role: user.role });
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
      },
    });
  } catch (e) {
    next(e);
  }
});

router.get("/me", authMiddleware, async (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Not authenticated" });
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({ user: { id: user.id, email: user.email, role: user.role, firstName: user.firstName, lastName: user.lastName, phone: user.phone } });
});

/** DEV ONLY — bootstrap an admin user */
router.post("/bootstrap-admin", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.upsert({
      where: { email },
      update: { password: hashed, role: "ADMIN" },
      create: { email, password: hashed, role: "ADMIN" },
    });
    res.json({ ok: true, id: user.id });
  } catch (e) {
    next(e);
  }
});

export default router;
