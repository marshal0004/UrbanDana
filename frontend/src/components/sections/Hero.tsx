"use client";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";

export default function Hero() {
  const { ref, inView } = useInView();

  return (
    <section ref={ref} className="relative min-h-[92vh] flex flex-col justify-end overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 -z-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1521369909029-2afed882baee?w=2000&q=80&auto=format&fit=crop"
          alt=""
          className="w-full h-full object-cover opacity-50"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1600 900'%3E%3Crect width='100%25' height='100%25' fill='%230a0a0a'/%3E%3C/svg%3E";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-black/40 via-brand-black/30 to-brand-black" />
      </div>

      {/* Floating "NEW DROP" pill */}
      <div className="absolute top-32 left-1/2 -translate-x-1/2 z-10">
        <div className="inline-flex items-center gap-2 bg-brand-red/90 backdrop-blur-sm text-paper text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full">
          <Sparkles className="w-3 h-3" />
          New Drop — Sunset Art Cap · 200 pieces only
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 pb-20">
        <div className={cn("max-w-3xl transition-all duration-1000", inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
          <p className="text-xs uppercase tracking-[0.4em] text-brand-red mb-5 font-semibold">
            India's Original Bandana Cap
          </p>
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter text-paper leading-[0.9]">
            STYLE THAT
            <br />
            <span className="text-brand-red">NEVER</span> STOPS.
          </h1>
          <p className="mt-8 text-lg text-paper/70 max-w-xl leading-relaxed">
            One cap. Three looks. Wear it forward, backward, or fold it low.
            Handcrafted in India. No restocks. No rules.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link
              href="/shop"
              className="group inline-flex items-center justify-center gap-2 bg-brand-red hover:bg-brand-red-soft text-paper text-sm font-bold uppercase tracking-widest px-8 py-4 rounded-full transition"
            >
              Shop the Drop
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center gap-2 border border-white/20 hover:border-white text-paper text-sm font-bold uppercase tracking-widest px-8 py-4 rounded-full transition backdrop-blur-sm"
            >
              The Urbandana Story
            </Link>
          </div>

          {/* Trust row */}
          <div className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-3 text-[11px] uppercase tracking-widest text-paper/50">
            <span>★ 4.8/5 from 700+ reviews</span>
            <span className="opacity-40">|</span>
            <span>Free shipping over ₹999</span>
            <span className="opacity-40">|</span>
            <span>7-day easy returns</span>
            <span className="opacity-40">|</span>
            <span>COD available</span>
          </div>
        </div>
      </div>

      {/* Bottom-right scroll cue */}
      <div className="absolute bottom-6 right-6 z-10 hidden lg:flex flex-col items-center gap-2 text-paper/40">
        <span className="text-[10px] uppercase tracking-widest [writing-mode:vertical-rl]">Scroll</span>
        <span className="block w-px h-12 bg-gradient-to-b from-paper/40 to-transparent" />
      </div>
    </section>
  );
}
