import { Router } from "express";
import prisma from "../lib/prisma.js";

const router = Router();

/**
 * GET /api/products
 * Optional query: ?category=Bandana Caps&featured=true&limited=true&q=red&page=1&limit=20
 */
router.get("/", async (req, res, next) => {
  try {
    const { category, featured, limited, q, page = 1, limit = 50 } = req.query;
    const where = {};
    if (category) where.category = category;
    if (featured === "true") where.isFeatured = true;
    if (limited === "true") where.isLimited = true;
    if (q) {
      where.OR = [
        { title: { contains: q } },
        { description: { contains: q } },
        { subtitle: { contains: q } },
      ];
    }
    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { images: { orderBy: { position: "asc" } }, variants: true },
        orderBy: { createdAt: "desc" },
        skip,
        take: Number(limit),
      }),
      prisma.product.count({ where }),
    ]);
    res.json({ items, total, page: Number(page), limit: Number(limit) });
  } catch (e) {
    next(e);
  }
});

/** GET /api/products/meta/categories — MUST come before /:slug */
router.get("/meta/categories", async (_req, res, next) => {
  try {
    const cats = await prisma.product.findMany({
      select: { category: true },
      distinct: ["category"],
    });
    res.json(cats.map((c) => c.category));
  } catch (e) {
    next(e);
  }
});

/** GET /api/products/:slug */
router.get("/:slug", async (req, res, next) => {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: req.params.slug },
      include: { images: { orderBy: { position: "asc" } }, variants: true },
    });
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (e) {
    next(e);
  }
});

export default router;
