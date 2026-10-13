import { Router } from "express";
import prisma from "../lib/prisma.js";
import { authMiddleware } from "../lib/auth.js";

const router = Router();
router.use(authMiddleware);

/** Get or create cart for current session/user */
async function getOrCreateCart(req) {
  const sessionId = req.headers["x-session-id"] || req.user?.id || "guest";
  let cart = await prisma.cart.findFirst({
    where: sessionId === req.user?.id ? { userId: sessionId } : { sessionId },
    include: { items: { include: { product: { include: { images: true } } } } },
  });
  if (!cart) {
    cart = await prisma.cart.create({
      data: sessionId === req.user?.id ? { userId: sessionId } : { sessionId },
      include: { items: { include: { product: { include: { images: true } } } } },
    });
  }
  return cart;
}

router.get("/", async (req, res, next) => {
  try {
    const cart = await getOrCreateCart(req);
    res.json(cart);
  } catch (e) {
    next(e);
  }
});

router.post("/items", async (req, res, next) => {
  try {
    const { productId, quantity = 1, variant } = req.body;
    const cart = await getOrCreateCart(req);
    const existing = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId, variant: variant || null },
    });
    if (existing) {
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: { cartId: cart.id, productId, quantity, variant: variant || null },
      });
    }
    const updated = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: { items: { include: { product: { include: { images: true } } } } },
    });
    res.json(updated);
  } catch (e) {
    next(e);
  }
});

router.patch("/items/:itemId", async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const item = await prisma.cartItem.update({
      where: { id: req.params.itemId },
      data: { quantity: Math.max(1, quantity) },
    });
    res.json(item);
  } catch (e) {
    next(e);
  }
});

router.delete("/items/:itemId", async (req, res, next) => {
  try {
    await prisma.cartItem.delete({ where: { id: req.params.itemId } });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

router.delete("/", async (req, res, next) => {
  try {
    const cart = await getOrCreateCart(req);
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

export default router;
