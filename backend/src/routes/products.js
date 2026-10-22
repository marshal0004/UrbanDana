import { Router } from "express";
import prisma from "../lib/prisma.js";

const router = Router();

/**
 * Search synonyms — map common user terms to canonical DB terms.
 * Keys are lowercased user queries; values are arrays of terms to match
 * (each will be checked case-insensitively against title/description/
 * subtitle/category).
 */
const SEARCH_SYNONYMS = {
  // Cap variants
  caps: ["cap", "caps", "bandana caps"],
  cap: ["cap", "bandana caps"],
  hats: ["cap", "hat", "hats"],
  hat: ["cap", "hat"],
  // T-Shirt variants
  tshirts: ["t-shirt", "tshirts", "tees", "tee", "t-shirts"],
  "t-shirts": ["t-shirt", "tshirts", "tees", "tee", "t-shirts"],
  tshirt: ["t-shirt", "tshirts", "t-shirts"],
  tees: ["t-shirt", "tees", "tee", "t-shirts"],
  tee: ["t-shirt", "tee", "t-shirts"],
  // Combo variants
  combos: ["combo", "combos", "bundle", "bundles"],
  combo: ["combo", "bundle"],
  bundles: ["combo", "bundle", "bundles"],
  bundle: ["combo", "bundle"],
  // Limited edition variants
  limited: ["limited", "limited edition"],
};

/**
 * GET /api/products
 * Optional query: ?category=Bandana Caps&featured=true&limited=true&q=red&page=1&limit=50
 *
 * Search behavior (q parameter):
 *  - Case-insensitive (lowercases both the query and the product fields)
 *  - Searches across title, description, subtitle, AND category
 *  - Synonym expansion: "caps"→[cap,caps,Bandana Caps], "tshirts"→[t-shirt,tees,T-Shirts], etc.
 *  - Multi-word AND logic: "red cap" matches products that have BOTH "red" AND a cap synonym
 */
router.get("/", async (req, res, next) => {
  try {
    const { category, featured, limited, q, page = 1, limit = 50 } = req.query;

    // Build base where clause for non-search filters
    const where = {};
    if (category) where.category = category;
    if (featured === "true") where.isFeatured = true;
    if (limited === "true") where.isLimited = true;

    const skip = (Number(page) - 1) * Number(limit);

    // If there's a search query, fetch all (with base filter), then filter in JS.
    // This avoids SQLite's case-sensitivity quirks and allows synonym expansion.
    // For 50 products, fetching all and filtering in JS is instant.
    if (q) {
      const query = String(q).toLowerCase().trim();
      const queryWords = query.split(/\s+/).filter((w) => w.length > 0);

      const allProducts = await prisma.product.findMany({
        where,
        include: { images: { orderBy: { position: "asc" } }, variants: true },
        orderBy: { createdAt: "desc" },
      });

      // AND logic across words, OR logic within each word's synonyms.
      // Also compute a relevance score to sort category matches first.
      const scored = allProducts
        .map((p) => {
          const titleLower = (p.title || "").toLowerCase();
          const descLower = (p.description || "").toLowerCase();
          const subtitleLower = (p.subtitle || "").toLowerCase();
          const categoryLower = (p.category || "").toLowerCase();
          const haystack = [titleLower, descLower, subtitleLower, categoryLower].join(" ");

          // Each query word must match at least one of its synonym terms
          const allWordsMatch = queryWords.every((word) => {
            const terms = SEARCH_SYNONYMS[word] || [word];
            return terms.some((term) => haystack.includes(term.toLowerCase()));
          });
          if (!allWordsMatch) return null;

          // Relevance score (higher = more relevant, sorts first):
          //   +5 per word that matches the CATEGORY (strongest signal)
          //   +3 per word that matches the TITLE
          //   +1 per word that matches the SUBTITLE or DESCRIPTION
          let score = 0;
          for (const word of queryWords) {
            const terms = SEARCH_SYNONYMS[word] || [word];
            for (const term of terms) {
              const t = term.toLowerCase();
              if (categoryLower.includes(t)) score += 5;
              if (titleLower.includes(t)) score += 3;
              if (subtitleLower.includes(t)) score += 1;
              if (descLower.includes(t)) score += 1;
            }
          }
          return { product: p, score };
        })
        .filter((x) => x !== null)
        .sort((a, b) => b.score - a.score);

      const filtered = scored.map((x) => x.product);
      const items = filtered.slice(skip, skip + Number(limit));
      return res.json({
        items,
        total: filtered.length,
        page: Number(page),
        limit: Number(limit),
      });
    }

    // No search query — use normal Prisma pagination
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
