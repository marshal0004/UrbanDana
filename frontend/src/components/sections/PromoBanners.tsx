"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Eye-catching promotional banners built with real product/model photos
const BANNERS = [
  {
    eyebrow: "LIMITED EDITION",
    title: "Sunset Art Cap",
    desc: "Hand-drawn sun motif. Only 200 pieces. Numbered & authenticated.",
    cta: "Shop Limited Drops",
    href: "/shop?category=Limited Edition",
    image: "/images/banner-model-1.jpg",
    accent: "#d4a017",
    bg: "linear-gradient(135deg, #1a1409 0%, #2a1f0a 100%)",
  },
  {
    eyebrow: "COMBO PACKS",
    title: "Cap + Tee",
    desc: "Get the complete Urbandana look. 1 cap + 1 matching tee in a gift box.",
    cta: "Shop Combos",
    href: "/shop?category=Combo",
    image: "/images/banner-combo-1.jpg",
    accent: "#10b981",
    bg: "linear-gradient(135deg, #0a1a14 0%, #0a2a1f 100%)",
  },
];

export default function PromoBanners() {
  return (
    <section className="py-12 bg-brand-cream">
      <div className="mx-auto" style={{ maxWidth: "100%", padding: "0 12px" }}>
        <div className="grid md:grid-cols-2 gap-4">
          {BANNERS.map((b, i) => (
            <Link
              key={b.title}
              href={b.href}
              className="group relative overflow-hidden rounded-3xl border-2 border-brand-black/10 hover:border-brand-red transition-all duration-300"
              style={{ background: b.bg, minHeight: "320px" }}
            >
              <div className="absolute inset-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={b.image}
                  alt={b.title}
                  className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0" style={{ background: `linear-gradient(90deg, ${b.bg.replace("linear-gradient(135deg, ", "").replace(" 0%, ", ", ").replace(" 100%)", ")")} 0%, transparent 70%)` }} />
              </div>
              <div className="relative h-full p-8 flex flex-col justify-center min-h-[320px]">
                <p className="text-[10px] uppercase tracking-[0.4em] font-bold mb-3" style={{ color: b.accent }}>
                  {b.eyebrow}
                </p>
                <h3 className="text-4xl md:text-5xl font-black text-paper mb-3 drop-shadow-lg">
                  {b.title}
                </h3>
                <p className="text-paper/80 max-w-sm mb-5 drop-shadow">{b.desc}</p>
                <div className="inline-flex items-center gap-2 text-paper text-xs font-bold uppercase tracking-widest group-hover:gap-3 transition-all">
                  <span
                    className="px-5 py-2.5 rounded-full"
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
