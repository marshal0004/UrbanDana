"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Tag, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

// Full-width coupon banners — 1 per screen, auto-scrolling
// Based on real product prices: caps ₹249, tees ₹299, combos ₹548
const COUPONS = [
  {
    eyebrow: "T-SHIRT OFFER",
    title: "BUY 2 TEES",
    price: "₹549",
    originalPrice: "₹598",
    code: "TEE2",
    desc: "Mix & match any 2 t-shirts. Auto-applied at checkout.",
    href: "/shop?category=T-Shirts",
    bg: "linear-gradient(135deg, #0a0a0a 0%, #1a0507 50%, #2a0a10 100%)",
    accent: "#c8102e",
    ticketBg: "#c8102e",
  },
  {
    eyebrow: "CAP OFFER",
    title: "BUY 3 CAPS",
    price: "₹599",
    originalPrice: "₹747",
    code: "CAP3",
    desc: "Any 3 bandana caps. Save ₹148. Auto-applied at checkout.",
    href: "/shop?category=Bandana Caps",
    bg: "linear-gradient(135deg, #0a0a0a 0%, #0a1a14 50%, #0a2a1f 100%)",
    accent: "#10b981",
    ticketBg: "#10b981",
  },
  {
    eyebrow: "COMBO DEAL",
    title: "CAP + TEE",
    price: "₹499",
    originalPrice: "₹548",
    code: "COMBO49",
    desc: "1 cap + 1 matching tee. Save ₹49. Complete the Urbandana look.",
    href: "/shop?category=Combo",
    bg: "linear-gradient(135deg, #0a0a0a 0%, #1a1409 50%, #2a1f0a 100%)",
    accent: "#d4a017",
    ticketBg: "#d4a017",
  },
  {
    eyebrow: "LIMITED EDITION",
    title: "FLAT ₹50 OFF",
    price: "₹199",
    originalPrice: "₹249",
    code: "LIMITED50",
    desc: "On all Limited Edition caps. Only 200 pieces. Once gone, forever gone.",
    href: "/shop?category=Limited Edition",
    bg: "linear-gradient(135deg, #0a0a0a 0%, #0f0a1a 50%, #1a0a2a 100%)",
    accent: "#a855f7",
    ticketBg: "#a855f7",
  },
];

export default function CouponCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll — 4 seconds per coupon
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      setActive((i) => (i + 1) % COUPONS.length);
    }, 4000);
    return () => clearInterval(t);
  }, [paused]);

  // Sync scroll position when active changes
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ left: active * el.clientWidth, behavior: "smooth" });
  }, [active]);

  const scrollByDir = (dir: "left" | "right") => {
    setActive((i) => {
      if (dir === "left") return (i - 1 + COUPONS.length) % COUPONS.length;
      return (i + 1) % COUPONS.length;
    });
  };

  return (
    <section
      className="py-8 bg-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mx-auto" style={{ maxWidth: "100%", padding: "0 12px" }}>
        {/* Header with arrows */}
        <div className="flex items-end justify-between gap-4 mb-4 px-2">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-brand-red mb-1 font-semibold">
              Special Offers
            </p>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-brand-black">
              Deals & Coupons
            </h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => scrollByDir("left")}
              className="w-9 h-9 rounded-full bg-brand-black/5 hover:bg-brand-red hover:text-paper text-brand-black transition flex items-center justify-center"
              aria-label="Previous coupon"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scrollByDir("right")}
              className="w-9 h-9 rounded-full bg-brand-black/5 hover:bg-brand-red hover:text-paper text-brand-black transition flex items-center justify-center"
              aria-label="Next coupon"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Full-width coupon carousel — 1 per screen */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto no-scrollbar scroll-smooth rounded-2xl"
          style={{ scrollSnapType: "x mandatory", scrollbarWidth: "none" }}
        >
          {COUPONS.map((c, i) => (
            <div
              key={i}
              className="shrink-0 w-full"
              style={{ scrollSnapAlign: "start" }}
            >
              <Link
                href={c.href}
                className="group relative block overflow-hidden rounded-2xl"
                style={{ background: c.bg, minHeight: "260px" }}
              >
                <div className="flex items-stretch">
                  {/* Left side — offer text */}
                  <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
                    <p
                      className="text-xs uppercase tracking-[0.4em] font-bold mb-3"
                      style={{ color: c.accent }}
                    >
                      {c.eyebrow}
                    </p>
                    <h3 className="text-3xl md:text-5xl font-black text-paper mb-2 leading-tight">
                      {c.title}
                    </h3>
                    <div className="flex items-baseline gap-3 mb-3">
                      <span className="text-4xl md:text-5xl font-black" style={{ color: c.accent }}>
                        {c.price}
                      </span>
                      <span className="text-lg text-paper/50 line-through">
                        {c.originalPrice}
                      </span>
                    </div>
                    <p className="text-paper/70 text-sm mb-5 max-w-md">{c.desc}</p>
                    <div className="inline-flex items-center gap-2 text-paper text-xs font-bold uppercase tracking-widest group-hover:gap-3 transition-all">
                      <span
                        className="px-5 py-2.5 rounded-full"
                        style={{ backgroundColor: c.accent }}
                      >
                        Shop Now
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Right side — coupon ticket */}
                  <div className="relative flex items-center pr-8 md:pr-12" style={{ minWidth: "200px" }}>
                    {/* Dotted divider */}
                    <div
                      className="absolute left-0 top-0 bottom-0 flex flex-col justify-between py-4"
                      style={{ borderLeft: "2px dashed rgba(255,255,255,0.2)" }}
                    >
                      <div className="w-4 h-4 rounded-full -ml-2.5 bg-white" />
                      <div className="w-4 h-4 rounded-full -ml-2.5 bg-white" />
                    </div>
                    {/* Ticket */}
                    <div
                      className="ml-6 p-5 rounded-xl text-center"
                      style={{ backgroundColor: c.ticketBg }}
                    >
                      <Tag className="w-6 h-6 text-paper mx-auto mb-2" />
                      <p className="text-[10px] uppercase tracking-widest text-paper/80 mb-1">Use Code</p>
                      <p className="text-2xl font-black text-paper tracking-wider">{c.code}</p>
                      <p className="text-[10px] uppercase tracking-widest text-paper/80 mt-1">
                        at checkout
                      </p>
                    </div>
                  </div>
                </div>

                {/* Slide indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {COUPONS.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => { e.preventDefault(); setActive(idx); }}
                      className={cn(
                        "h-1.5 rounded-full transition-all",
                        active === idx ? "w-6" : "w-1.5 bg-white/30"
                      )}
                      style={active === idx ? { backgroundColor: c.accent } : {}}
                      aria-label={`Go to coupon ${idx + 1}`}
                    />
                  ))}
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
