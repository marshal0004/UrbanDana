"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowRight, ChevronLeft, ChevronRight, Percent } from "lucide-react";

// Full-width coupon banners — ticket/coupon style with side notches + hourglass middle
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
    leftBg: "#0a0a0a",
    rightBg: "#c8102e",
    accent: "#c8102e",
    textColor: "#ffffff",
  },
  {
    eyebrow: "CAP OFFER",
    title: "BUY 3 CAPS",
    price: "₹599",
    originalPrice: "₹747",
    code: "CAP3",
    desc: "Any 3 bandana caps. Save ₹148. Auto-applied at checkout.",
    href: "/shop?category=Bandana Caps",
    leftBg: "#0a0a0a",
    rightBg: "#10b981",
    accent: "#10b981",
    textColor: "#ffffff",
  },
  {
    eyebrow: "COMBO DEAL",
    title: "CAP + TEE",
    price: "₹499",
    originalPrice: "₹548",
    code: "COMBO49",
    desc: "1 cap + 1 matching tee. Save ₹49. Complete the Urbandana look.",
    href: "/shop?category=Combo",
    leftBg: "#0a0a0a",
    rightBg: "#d4a017",
    accent: "#d4a017",
    textColor: "#0a0a0a",
  },
  {
    eyebrow: "LIMITED EDITION",
    title: "FLAT ₹50 OFF",
    price: "₹199",
    originalPrice: "₹249",
    code: "LIMITED50",
    desc: "On all Limited Edition caps. Only 200 pieces. Once gone, forever gone.",
    href: "/shop?category=Limited Edition",
    leftBg: "#0a0a0a",
    rightBg: "#a855f7",
    accent: "#a855f7",
    textColor: "#ffffff",
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

        {/* Full-width coupon carousel — 1 per screen, ticket-style */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto no-scrollbar scroll-smooth"
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
                className="group relative block"
                style={{ height: "220px" }}
              >
                {/* Ticket-shaped container with side notches via CSS */}
                <div
                  className="relative w-full h-full flex"
                  style={{
                    // Ticket shape: semicircle notches on left & right edges
                    // Using radial-gradient to create notch cutouts
                    WebkitMaskImage: `radial-gradient(circle 12px at 0 50%, transparent 98%, #000 100%), radial-gradient(circle 12px at 100% 50%, transparent 98%, #000 100%), linear-gradient(#000, #000)`,
                    WebkitMaskComposite: "source-in",
                    maskImage: `radial-gradient(circle 12px at 0 50%, transparent 98%, #000 100%), radial-gradient(circle 12px at 100% 50%, transparent 98%, #000 100%), linear-gradient(#000, #000)`,
                    maskComposite: "intersect",
                  }}
                >
                  {/* Left section — dark background, offer text */}
                  <div
                    className="flex-1 p-8 md:p-10 flex flex-col justify-center relative"
                    style={{ backgroundColor: c.leftBg }}
                  >
                    <p
                      className="text-xs uppercase tracking-[0.4em] font-bold mb-2"
                      style={{ color: c.accent }}
                    >
                      {c.eyebrow}
                    </p>
                    <h3 className="text-2xl md:text-4xl font-black text-white mb-2 leading-tight">
                      {c.title}
                    </h3>
                    <div className="flex items-baseline gap-3">
                      <span className="text-3xl md:text-4xl font-black" style={{ color: c.accent }}>
                        {c.price}
                      </span>
                      <span className="text-base text-white/50 line-through">
                        {c.originalPrice}
                      </span>
                    </div>
                  </div>

                  {/* Middle — hourglass divider (2 semicircles facing each other) */}
                  <div className="relative flex items-center" style={{ width: "40px" }}>
                    {/* Left semicircle (cut from left section) */}
                    <div
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-16 rounded-r-full"
                      style={{ backgroundColor: c.rightBg, left: "-4px" }}
                    />
                    {/* Right semicircle (cut from right section) */}
                    <div
                      className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-16 rounded-l-full"
                      style={{ backgroundColor: c.leftBg, right: "-4px" }}
                    />
                    {/* Dashed line in middle */}
                    <div
                      className="absolute top-4 bottom-4 left-1/2 -translate-x-1/2"
                      style={{
                        borderLeft: "2px dashed rgba(255,255,255,0.3)",
                      }}
                    />
                  </div>

                  {/* Right section — colored background, coupon code + message */}
                  <div
                    className="flex-1 p-6 md:p-8 flex flex-col items-center justify-center text-center"
                    style={{ backgroundColor: c.rightBg }}
                  >
                    {/* Decorative % tags */}
                    <div className="flex gap-2 mb-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: c.textColor === "#ffffff" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)" }}
                      >
                        <Percent className="w-5 h-5" style={{ color: c.textColor }} />
                      </div>
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: c.textColor === "#ffffff" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)" }}
                      >
                        <Percent className="w-5 h-5" style={{ color: c.textColor }} />
                      </div>
                    </div>
                    <p
                      className="text-[11px] uppercase tracking-widest mb-1 font-semibold"
                      style={{ color: c.textColor, opacity: 0.8 }}
                    >
                      Use Code
                    </p>
                    <p
                      className="text-2xl md:text-3xl font-black tracking-wider mb-2"
                      style={{ color: c.textColor }}
                    >
                      {c.code}
                    </p>
                    <p
                      className="text-[11px] uppercase tracking-widest"
                      style={{ color: c.textColor, opacity: 0.7 }}
                    >
                      Offer auto-applies at checkout
                    </p>
                  </div>
                </div>

                {/* Slide indicators */}
                <div className="flex justify-center gap-1.5 mt-4">
                  {COUPONS.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActive(idx); }}
                      className={cn(
                        "h-1.5 rounded-full transition-all",
                        active === idx ? "w-6 bg-brand-red" : "w-1.5 bg-brand-black/20"
                      )}
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
