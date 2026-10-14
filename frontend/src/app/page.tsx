"use client";
import { useEffect, useState } from "react";
import { api, type Product } from "@/lib/api";
import Hero from "@/components/sections/Hero";
import ProductCarousel from "@/components/ProductCarousel";
import PromoBanners from "@/components/sections/PromoBanners";
import FullStore from "@/components/sections/FullStore";

export default function HomePage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.listProducts({ limit: 100 })
      .then((res) => setAllProducts(res.items))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  // Split products for different carousels
  const capsAndCombos = allProducts.filter((p) =>
    p.category === "Bandana Caps" || p.category === "Combo"
  );
  const tees = allProducts.filter((p) => p.category === "T-Shirts");
  const limited = allProducts.filter((p) =>
    p.category === "Limited Edition" || p.category === "Visors"
  );

  return (
    <>
      <Hero />

      {/* Auto-scroll carousel 1 — Caps + Combos */}
      {!loading && capsAndCombos.length > 0 && (
        <ProductCarousel
          products={capsAndCombos}
          eyebrow="Trending Now"
          title="Caps & Combos"
          autoScroll={true}
        />
      )}

      {/* Eye-catching promo banners */}
      <PromoBanners />

      {/* Auto-scroll carousel 2 — T-shirts */}
      {!loading && tees.length > 0 && (
        <ProductCarousel
          products={tees}
          eyebrow="Bandana-Inspired"
          title="T-Shirts"
          autoScroll={true}
        />
      )}

      {/* Full store — all products with category filter */}
      <FullStore />
    </>
  );
}
