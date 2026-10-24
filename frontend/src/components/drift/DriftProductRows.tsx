"use client";
// /home/z/my-project/UrbanDana/frontend/src/components/drift/DriftProductRows.tsx
//
// Combines the 3D arc carousel (Row 1) + multiple horizontal infinite
// auto-scrolling rows (Rows 2+) with alternating direction.
//
// Row 1: DriftArcCarousel (3D arc, R→L scroll) — featured products
// Row 2: DriftInfiniteRow direction="ltr" — Bandana Caps
// Row 3: DriftInfiniteRow direction="rtl" — T-Shirts
// Row 4: DriftInfiniteRow direction="ltr" — Combos
// Row 5: DriftInfiniteRow direction="rtl" — Limited Edition
//
// Replaces the old FullStore section.

import { useEffect, useState } from "react";
import { api, type Product } from "@/lib/api";
import DriftArcCarousel from "./DriftArcCarousel";
import DriftInfiniteRow from "./DriftInfiniteRow";

export default function DriftProductRows() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.listProducts({ limit: 100 });
        if (cancelled) return;
        setAllProducts(res.items);
      } catch (err) {
        console.error("DriftProductRows: failed to load products", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Split products by category for different rows
  const caps = allProducts.filter((p) => p.category === "Bandana Caps");
  const tees = allProducts.filter((p) => p.category === "T-Shirts");
  const combos = allProducts.filter((p) => p.category === "Combo");
  const limited = allProducts.filter((p) => p.category === "Limited Edition");

  if (loading) {
    return (
      <div
        className="py-32 text-center"
        style={{ background: "#f4f1ee", color: "#0b0a0a" }}
      >
        <div className="text-sm uppercase tracking-[0.3em] opacity-40">
          Loading products…
        </div>
      </div>
    );
  }

  return (
    <>
      {/* === ROW 1: 3D ARC CAROUSEL (R→L, perspective + rotateY) === */}
      <DriftArcCarousel />

      {/* === ROW 2: Bandana Caps (L→R) === */}
      {caps.length > 0 && (
        <DriftInfiniteRow
          products={caps}
          direction="ltr"
          eyebrow="Hand-knotted"
          title="Bandana Caps"
        />
      )}

      {/* === ROW 3: T-Shirts (R→L) === */}
      {tees.length > 0 && (
        <DriftInfiniteRow
          products={tees}
          direction="rtl"
          eyebrow="Oversized · Pure Cotton"
          title="T-Shirts"
        />
      )}

      {/* === ROW 4: Combos (L→R) === */}
      {combos.length > 0 && (
        <DriftInfiniteRow
          products={combos}
          direction="ltr"
          eyebrow="Cap + Tee · Gift Box"
          title="Combos"
        />
      )}

      {/* === ROW 5: Limited Edition (R→L) === */}
      {limited.length > 0 && (
        <DriftInfiniteRow
          products={limited}
          direction="rtl"
          eyebrow="Numbered · 200 Only"
          title="Limited Edition"
        />
      )}

      {/* Visors row removed per user request */}

    </>
  );
}
