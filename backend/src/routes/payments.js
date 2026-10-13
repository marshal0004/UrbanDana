/**
 * Razorpay payment routes — production-ready
 *
 * Endpoints:
 *   POST /api/payments/create-order  → creates Razorpay order, returns order_id + amount + currency
 *   POST /api/payments/verify        → verifies Razorpay signature, marks order PAID
 *
 * Required env vars:
 *   RAZORPAY_KEY_ID      — your Razorpay Key ID (test or live)
 *   RAZORPAY_KEY_SECRET  — your Razorpay Key Secret
 *   RAZORPAY_WEBHOOK_SECRET (optional, for webhook verification)
 *
 * If keys are not set, the routes return 503 with a clear message — no silent failures.
 */
import { Router } from "express";
import crypto from "node:crypto";
import prisma from "../lib/prisma.js";
import { authMiddleware } from "../lib/auth.js";

const router = Router();

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

function razorpayAvailable() {
  return Boolean(RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET);
}

/**
 * Helper: call Razorpay's REST API to create an order.
 * Razorpay orders are the source of truth — the client opens the checkout
 * modal against this order_id, and we verify the payment server-side.
 */
async function createRazorpayOrder(amountInPaise, receipt) {
  const auth = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString("base64");
  const res = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      "Authorization": `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: amountInPaise, // in paise
      currency: "INR",
      receipt,
      payment_capture: 1, // auto-capture
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Razorpay order creation failed: ${res.status} ${text}`);
  }
  return res.json();
}

/**
 * POST /api/payments/create-order
 * Body: { amount: number (paise), orderId?: string (UrbanDana order ID) }
 * Returns: { razorpayOrderId, amount, currency, keyId }
 */
router.post("/create-order", authMiddleware, async (req, res, next) => {
  try {
    // Auth check FIRST (authMiddleware handles 401, but be explicit)
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const { amount, orderId } = req.body;
    if (!amount || amount < 100) {
      return res.status(400).json({ error: "amount (paise, min 100) is required" });
    }

    // NOW check Razorpay availability
    if (!razorpayAvailable()) {
      return res.status(503).json({
        error: "Razorpay not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET on the server.",
        mode: "COD_ONLY",
      });
    }

    // If we have an UrbanDana order, fetch it to verify amount matches
    let receipt = `urbandana_${Date.now()}`;
    if (orderId) {
      const order = await prisma.order.findUnique({ where: { id: orderId } });
      if (!order) return res.status(404).json({ error: "Order not found" });
      if (order.totalAmount !== amount) {
        return res.status(400).json({ error: "amount mismatch with order total" });
      }
      receipt = order.orderNumber;
    }

    const rzpOrder = await createRazorpayOrder(amount, receipt);
    console.log(`Razorpay order created: ${rzpOrder.id} for ₹${amount / 100}`);

    res.json({
      razorpayOrderId: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
      keyId: RAZORPAY_KEY_ID,
      status: rzpOrder.status,
    });
  } catch (e) {
    console.error("create-order error:", e);
    next(e);
  }
});

/**
 * POST /api/payments/verify
 * Body: {
 *   razorpay_order_id, razorpay_payment_id, razorpay_signature,
 *   orderId (UrbanDana order ID)
 * }
 * Verifies signature, marks order PAID.
 */
router.post("/verify", authMiddleware, async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: "Missing Razorpay payment fields" });
    }

    if (!razorpayAvailable()) {
      return res.status(503).json({ error: "Razorpay not configured", mode: "COD_ONLY" });
    }

    // Verify signature: HMAC-SHA256(razorpay_order_id|razorpay_payment_id, key_secret)
    const expected = crypto
      .createHmac("sha256", RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expected !== razorpay_signature) {
      console.warn(`Signature mismatch for order ${orderId}`);
      return res.status(400).json({ error: "Invalid payment signature" });
    }

    // Mark the UrbanDana order as PAID
    if (orderId) {
      const updated = await prisma.order.update({
        where: { id: orderId },
        data: {
          status: "PAID",
          paymentMethod: "RAZORPAY",
        },
      });
      console.log(`Order ${updated.orderNumber} marked PAID via Razorpay ${razorpay_payment_id}`);
    }

    res.json({
      verified: true,
      razorpay_payment_id,
      razorpay_order_id,
      orderId: orderId || null,
    });
  } catch (e) {
    console.error("verify error:", e);
    next(e);
  }
});

/**
 * GET /api/payments/health
 * Returns whether Razorpay is configured. Useful for the frontend to decide
 * whether to show online payment options or COD only.
 */
router.get("/health", (_req, res) => {
  res.json({
    razorpay: razorpayAvailable(),
    mode: razorpayAvailable() ? "LIVE" : "COD_ONLY",
    keyId: razorpayAvailable() ? RAZORPAY_KEY_ID : null,
  });
});

export default router;
