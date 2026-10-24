"use client";
// /home/z/my-project/UrbanDana/frontend/src/components/sections/Hero.tsx
//
// Hero section with VIDEO backgrounds (parallax cap videos) — NO dark overlay.
// Cap colors are fully visible (no fade/gradient covering the video).
// 3 slides crossfade every 6s, each with a different cap color video.

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const SLIDES = [
  {
    pill: "NEW DROP — SUNSET ART CAP",
    pillIcon: Sparkles,
    eyebrow: "India's Original Bandana Cap",
    title: "STYLE THAT",
    titleAccent: "NEVER",
    titleEnd: "STOPS.",
    subtitle: "One cap. Three looks. Wear it forward, backward, or fold it low. Handcrafted in India. No restocks. No rules.",
    primaryCta: { href: "/shop", label: "Shop the Drop" },
    secondaryCta: { href: "/about", label: "The Urbandana Story" },
    bgVideo: "/videos/hero/hero-bg-red.mp4",
    accent: "#c8102e",
  },
  {
    pill: "LIMITED — 200 PIECES ONLY",
    pillIcon: Sparkles,
    eyebrow: "Hand-drawn. Hand-finished.",
    title: "WHEN IT'S GONE,",
    titleAccent: "IT'S GONE",
    titleEnd: "FOREVER.",
    subtitle: "Sunset Art Cap — hand-drawn sun motif in golden orange against deep indigo. Numbered authenticity tag. Only 200 made.",
    primaryCta: { href: "/product/sunset-art-cap", label: "Get the Sunset Art Cap" },
    secondaryCta: { href: "/shop?category=Limited Edition", label: "All Limited Drops" },
    bgVideo: "/videos/hero/hero-bg-blue.mp4",
    accent: "#d4a017",
  },
  {
    pill: "BEST VALUE — COMBO PACKS",
    pillIcon: Sparkles,
    eyebrow: "The complete collection",
    title: "SIX CAPS.",
    titleAccent: "ONE",
    titleEnd: "BOX.",
    subtitle: "All 6 signature colourways in a premium wooden gift box with numbered certificate. The ultimate Urbandana collector's item.",
    primaryCta: { href: "/shop?category=Combo", label: "Get Combo Packs" },
    secondaryCta: { href: "/shop", label: "Shop All" },
    bgVideo: "/videos/hero/hero-bg-green.mp4",
    accent: "#10b981",
  },
];

export default function Hero() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const slide = SLIDES[active];

  const next = useCallback(() => setActive((i) => (i + 1) % SLIDES.length), []);
  const prev = useCallback(() => setActive((i) => (i - 1 + SLIDES.length) % SLIDES.length), []);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, [next, paused]);

  return (
    <section
      className="relative min-h-[92vh] flex flex-col justify-end overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background — parallax cap VIDEO, NO dark overlay (cap colors fully visible) */}
      <div className="absolute inset-0 -z-10">
        {SLIDES.map((s, i) => (
          <video
            key={s.bgVideo}
            src={s.bgVideo}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
            style={{
              opacity: active === i ? 1 : 0,
              objectPosition: "center center",
            }}
            aria-hidden={active !== i}
          />
        ))}
        {/* Subtle bottom gradient ONLY — keeps cap colors visible at top,
            makes white text readable at bottom. NOT a full dark overlay. */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.35) 65%, rgba(0,0,0,0.55) 100%)",
          }}
        />
      </div>

      {/* Slide indicators (right side) */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className="group relative w-1 h-12 rounded-full bg-white/20 overflow-hidden"
            aria-label={`Slide ${i + 1}`}
          >
            <span
              className={cn("absolute inset-0 transition-all", active === i ? "h-full" : "h-0")}
              style={{ backgroundColor: slide.accent }}
            />
          </button>
        ))}
      </div>

      {/* Arrows (desktop) */}
      <button
        onClick={prev}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-20 hidden md:flex w-10 h-10 rounded-full bg-white/5 backdrop-blur-md border border-white/10 items-center justify-center text-paper/80 hover:text-paper hover:bg-white/10 transition"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={next}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-20 hidden md:flex w-10 h-10 rounded-full bg-white/5 backdrop-blur-md border border-white/10 items-center justify-center text-paper/80 hover:text-paper hover:bg-white/10 transition"
        style={{ marginRight: "32px" }}
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Floating NEW DROP pill */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 z-10">
        <div
          className="inline-flex items-center gap-2 backdrop-blur-sm text-paper text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full"
          style={{ backgroundColor: `${slide.accent}E6` }}
        >
          <slide.pillIcon className="w-3 h-3" />
          {slide.pill}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 pb-20">
        <div key={active} className="max-w-3xl animate-[fadeIn_0.6s_ease]">
          <p className="text-xs uppercase tracking-[0.4em] mb-5 font-semibold" style={{ color: slide.accent }}>
            {slide.eyebrow}
          </p>
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter text-paper leading-[0.9] drop-shadow-2xl">
            {slide.title}
            <br />
            <span style={{ color: slide.accent }}>{slide.titleAccent}</span> {slide.titleEnd}
          </h1>
          <p className="mt-8 text-lg text-paper/90 max-w-xl leading-relaxed drop-shadow-lg">
            {slide.subtitle}
          </p>

          <div className="mt-6 sm:mt-10 flex flex-col sm:flex-row gap-4">
            <Link
              href={slide.primaryCta.href}
              className="group inline-flex items-center justify-center gap-2 text-paper text-sm font-bold uppercase tracking-widest px-8 py-4 rounded-full transition hover:scale-105"
              style={{ backgroundColor: slide.accent }}
            >
              {slide.primaryCta.label}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </Link>
            <Link
              href={slide.secondaryCta.href}
              className="inline-flex items-center justify-center gap-2 border border-white/20 hover:border-white text-paper text-sm font-bold uppercase tracking-widest px-8 py-4 rounded-full transition backdrop-blur-sm"
            >
              {slide.secondaryCta.label}
            </Link>
          </div>

          <div className="mt-8 sm:mt-14 flex flex-wrap items-center gap-x-8 gap-y-3 text-[11px] uppercase tracking-widest text-paper/60">
            <span>★ 4.8/5 from 700+ reviews</span>
            <span className="opacity-40">|</span>
            <span>Caps ₹249 · T-Shirts ₹349</span>
            <span className="opacity-40">|</span>
            <span>7-day easy returns</span>
            <span className="opacity-40">|</span>
            <span>COD available</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
