"use client";
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
    bgImage: "/images/hero-cap-red.jpg",
    accent: "#c8102e",
    overlay: "linear-gradient(90deg, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.5) 60%, rgba(10,10,10,0.3) 100%)",
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
    bgImage: "/images/hero-cap-sunset.jpg",
    accent: "#d4a017",
    overlay: "linear-gradient(90deg, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.5) 60%, rgba(10,10,10,0.3) 100%)",
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
    bgImage: "/images/hero-cap-green.jpg",
    accent: "#10b981",
    overlay: "linear-gradient(90deg, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.5) 60%, rgba(10,10,10,0.3) 100%)",
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
      className="relative min-h-[88vh] flex flex-col justify-end overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background — real Urbandana cap photo, changes per slide */}
      <div className="absolute inset-0 -z-10 transition-all duration-1000">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={slide.bgImage}
          src={slide.bgImage}
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: slide.overlay }} />
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
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter text-paper leading-[0.9] drop-shadow-2xl">
            {slide.title}
            <br />
            <span style={{ color: slide.accent }}>{slide.titleAccent}</span> {slide.titleEnd}
          </h1>
          <p className="mt-8 text-lg text-paper/90 max-w-xl leading-relaxed drop-shadow-lg">
            {slide.subtitle}
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
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

          <div className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-3 text-[11px] uppercase tracking-widest text-paper/60">
            <span>★ 4.8/5 from 700+ reviews</span>
            <span className="opacity-40">|</span>
            <span>Caps ₹249 · T-Shirts ₹299</span>
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
