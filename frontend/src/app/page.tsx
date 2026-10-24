"use client";
import Hero from "@/components/sections/Hero";
import HeroMarquee from "@/components/drift/HeroMarquee";
import { CathedralScrollVideo, BotanicaScrollVideo } from "@/components/drift/scrollVideoSections";
import EditorialOpening from "@/components/drift/editorial/EditorialOpening";
import EditorialRooms from "@/components/drift/editorial/EditorialRooms";
import EditorialLetters from "@/components/drift/editorial/EditorialLetters";
import EditorialDay from "@/components/drift/editorial/EditorialDay";
import CouponCarousel from "@/components/sections/CouponCarousel";
import DriftProductRows from "@/components/drift/DriftProductRows";
import Stats from "@/components/sections/Stats";
import ThreeStyles from "@/components/sections/ThreeStyles";
import Features from "@/components/sections/Features";
import Founder from "@/components/sections/Founder";
import Testimonials from "@/components/sections/Testimonials";

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* === MARQUEE STRIP — infinite horizontal scroll, touches Hero + ScrollVideo === */}
      <HeroMarquee />

      {/* === DRIFT scroll-controlled cinematic video #1 (Cathedral → T-Shirt) === */}
      <CathedralScrollVideo />

      {/* === DRIFT scroll-controlled cinematic video #2 (Retail Store → Botanical Cap) === */}
      <BotanicaScrollVideo />

      {/* === EDITORIAL SECTIONS (adapted from Sill template) === */}
      <EditorialOpening />
      <EditorialRooms />
      <EditorialLetters />
      <EditorialDay />

      {/* === COUPON CAROUSEL — horizontal infinite auto-scroll, pause on hover === */}
      <CouponCarousel />

      {/* === PRODUCT ROWS (replaces FullStore) ===
           Row 1: 3D arc carousel (R→L, perspective + rotateY) — featured products
           Row 2: Bandana Caps (L→R)
           Row 3: T-Shirts (R→L)
           Row 4: Combos (L→R)
           Row 5: Limited Edition (R→L)
           Each row auto-scrolls infinitely, pauses on hover. */}
      <DriftProductRows />

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
