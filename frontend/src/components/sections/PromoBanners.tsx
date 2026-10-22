// /home/z/my-project/UrbanDana/frontend/src/components/sections/PromoBanners.tsx
"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Full-width colored banner backgrounds (not cards)
const BANNERS = [
  {
    eyebrow: "LIMITED EDITION",
    title: "Sunset Art Cap",
    desc: "Hand-drawn sun motif. Only 200 pieces. Numbered & authenticated.",
    cta: "Shop Limited Drops",
    href: "/shop?category=Limited Edition",
    image: "/images/banner-limited.jpg",
    accent: "#d4a017",
    bg: "linear-gradient(135deg, #1a1409 0%, #2a1f0a 100%)",
  },
  {
    eyebrow: "COMBO PACKS",
    title: "Cap + T-Shirt",
    desc: "Get the complete Urbandana look. 1 cap + 1 matching t-shirt in a gift box.",
    cta: "Shop Combos",
    href: "/shop?category=Combo",
    image: "/images/banner-combo.jpg",
    accent: "#10b981",
    bg: "linear-gradient(135deg, #0a1a14 0%, #0a2a1f 100%)",
  },
];

export default function PromoBanners() {
  return (
    <section className="py-10 bg-white">
      <div className="mx-auto" style={{ maxWidth: "100%", padding: "0 12px" }}>
        <div className="grid md:grid-cols-2 gap-4">
          {BANNERS.map((b, i) => (
            <Link
              key={b.title}
              href={b.href}
              className="group relative overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-2xl"
              style={{ background: b.bg, height: "550px" }}
            >
              {/* Background image — full cover */}
              <div className="absolute inset-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={b.image}
                  alt={b.title}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-95 group-hover:scale-105 transition-all duration-700"
                />
                {/* Gradient overlay — left side dark for text readability */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(90deg, ${b.bg.includes("1a1409") ? "#1a1409F5" : "#0a1a14F5"} 0%, rgba(10,10,10,0.65) 45%, rgba(10,10,10,0.25) 100%)`,
                  }}
                />
              </div>

              {/* Content — left-aligned, vertically centered */}
              <div className="relative h-full flex flex-col justify-center p-10 md:p-12 max-w-[60%]">
                <p
                  className="text-xs uppercase tracking-[0.4em] font-bold mb-4"
                  style={{ color: b.accent }}
                >
                  {b.eyebrow}
                </p>
                <h3 className="text-4xl md:text-5xl font-black text-paper mb-4 drop-shadow-lg leading-tight">
                  {b.title}
                </h3>
                <p className="text-paper/85 text-base mb-6 drop-shadow leading-relaxed">
                  {b.desc}
                </p>
                <div className="inline-flex items-center gap-2 text-paper text-xs font-bold uppercase tracking-widest group-hover:gap-3 transition-all">
                  <span
                    className="px-6 py-3 rounded-full"
                    style={{ backgroundColor: b.accent }}
                  >
                    {b.cta}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
