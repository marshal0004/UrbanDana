"use client";
import { useEffect, useState } from "react";
import { api, type Product } from "@/lib/api";
import Hero from "@/components/sections/Hero";
import DriftScrollVideo from "@/components/drift/DriftScrollVideo";
import Model3DViewer from "@/components/sections/Model3DViewer";
import ProductCarousel from "@/components/ProductCarousel";
import PromoBanners from "@/components/sections/PromoBanners";
import FullStore from "@/components/sections/FullStore";
import CouponCarousel from "@/components/sections/CouponCarousel";
import Stats from "@/components/sections/Stats";
import ThreeStyles from "@/components/sections/ThreeStyles";
import Features from "@/components/sections/Features";
import Founder from "@/components/sections/Founder";
import Testimonials from "@/components/sections/Testimonials";

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

  return (
    <>
      <Hero />

      {/* === DRIFT scroll-controlled cinematic video parallax ===
           Placed directly below Hero, before the 3D model viewer.
           Uses Canvas + 151 pre-extracted JPEG frames for buttery-smooth
           60fps scroll-scrubbing (no <video> codec delays). */}
      <DriftScrollVideo />

      {/* 3D Model Viewer — 2 caps + 2 t-shirts, interactive */}
      <Model3DViewer />

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

      {/* Full-width coupon carousel — 1 per screen, auto-scrolling */}
      <CouponCarousel />

      {/* Full store — all products with infinite scroll loader */}
      <FullStore />

      {/* Restored sections — after all products */}
      <Stats />
      <Features />
      <Founder />
      {/* One Cap · Three Looks — placed AFTER Founder section */}
      <ThreeStyles />
      <Testimonials />
    </>
  );
}
