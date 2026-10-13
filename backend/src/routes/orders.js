import { Router } from "express";
import prisma from "../lib/prisma.js";
import { generateOrderNumber } from "../lib/utils.js";

const router = Router();

router.post("/", async (req, res, next) => {
  try {
    const {
      email, phone, firstName, lastName, address, city, state, pincode,
      items, paymentMethod = "COD",
    } = req.body;
    if (!items?.length) return res.status(400).json({ error: "Cart is empty" });

    // Fetch product prices from DB (don't trust client)
    const productIds = items.map((i) => i.productId);
    const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
    const priceMap = new Map(products.map((p) => [p.id, p.price]));

    const orderItems = items.map((i) => ({
      productId: i.productId,
      title: products.find((p) => p.id === i.productId)?.title || "Unknown",
      price: priceMap.get(i.productId) || 0,
      quantity: i.quantity,
      variant: i.variant || null,
    }));
    const totalAmount = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        email, phone, firstName, lastName, address, city, state, pincode,
        totalAmount, paymentMethod,
        items: { create: orderItems },
      },
      include: { items: true },
    });
    res.status(201).json(order);
  } catch (e) {
    next(e);
  }
});

router.get("/:orderNumber", async (req, res, next) => {
  try {
    const order = await prisma.order.findUnique({
      where: { orderNumber: req.params.orderNumber },
      include: { items: true },
    });
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (e) {
    next(e);
  }
});

export default router;
