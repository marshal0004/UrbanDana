"use client";
import { useEffect, useState } from "react";
import { api, type Product } from "@/lib/api";
import Hero from "@/components/sections/Hero";
import { CathedralScrollVideo, BotanicaScrollVideo } from "@/components/drift/scrollVideoSections";
import EditorialOpening from "@/components/drift/editorial/EditorialOpening";
import EditorialRooms from "@/components/drift/editorial/EditorialRooms";
import EditorialLetters from "@/components/drift/editorial/EditorialLetters";
import EditorialDay from "@/components/drift/editorial/EditorialDay";
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

  return (
    <>
      <Hero />

      {/* === DRIFT scroll-controlled cinematic video #1 (Cathedral → T-Shirt) === */}
      <CathedralScrollVideo />

      {/* === DRIFT scroll-controlled cinematic video #2 (Retail Store → Botanical Cap) === */}
      <BotanicaScrollVideo />

      {/* === EDITORIAL SECTIONS (adapted from Sill template) — replaces ProductCarousel + PromoBanners === */}
      <EditorialOpening />
      <EditorialRooms />
      <EditorialLetters />
      <EditorialDay />

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
