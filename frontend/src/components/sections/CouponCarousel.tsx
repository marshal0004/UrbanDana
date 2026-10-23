"use client";
// /home/z/my-project/UrbanDana/frontend/src/components/sections/CouponCarousel.tsx
//
// Horizontal infinite auto-scrolling coupon marquee.
// - Cards scroll horizontally forever (CSS animation)
// - Speed: normal (40s per loop) — visible but not jarring
// - PAUSE on hover, RESUME when hover leaves
// - Short height — compact banner strip
// - Each card is a ticket-style coupon with side notches + hourglass middle

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Tag } from "lucide-react";

interface Coupon {
  eyebrow: string;
  title: string;
  price: string;
  originalPrice: string;
  code: string;
  desc: string;
  href: string;
  leftBg: string;
  rightBg: string;
  accent: string;
  textColor: string;
}

const COUPONS: Coupon[] = [
  {
    eyebrow: "T-SHIRT OFFER",
    title: "BUY 2 T-SHIRTS",
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
    title: "CAP + T-SHIRT",
    price: "₹499",
    originalPrice: "₹548",
    code: "COMBO49",
    desc: "1 cap + 1 matching t-shirt. Save ₹49. Complete the Urbandana look.",
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
  const trackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  // Infinite horizontal scroll via requestAnimationFrame.
  // The track is duplicated (COUPONS × 2) so when the first set scrolls
  // completely out of view, we reset position to 0 seamlessly.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let offset = 0;
    let rafId: number | null = null;
    let lastTime = performance.now();
    // Speed: 60 pixels per second = "normal" (visible but not jarring)
    const SPEED_PX_PER_SEC = 60;

    const tick = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      if (!paused) {
        offset += SPEED_PX_PER_SEC * dt;

        // Get the width of ONE set of coupons (half the track)
        const halfWidth = track.scrollWidth / 2;
        if (halfWidth > 0 && offset >= halfWidth) {
          offset -= halfWidth; // Seamless loop — jump back by one set
        }

        track.style.transform = `translateX(${-offset}px)`;
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [paused]);

  // Duplicate the coupons array so the track is seamless when it loops
  const items = [...COUPONS, ...COUPONS];

  return (
    <section
      className="w-full py-6"
      style={{ background: "#f4f1ee" }}
      aria-label="Special offers and coupon codes"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="overflow-hidden">
        <div
          ref={trackRef}
          className="flex will-change-transform"
          style={{ width: "max-content", gap: "24px", padding: "0 12px" }}
        >
          {items.map((coupon, i) => (
            <CouponCard key={i} coupon={coupon} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CouponCard({ coupon }: { coupon: Coupon }) {
  return (
    <Link
      href={coupon.href}
      className="shrink-0 block no-underline"
      style={{
        width: "380px",
        // Compact height — shorter than before
        height: "180px",
        // Ticket shape: side notches via CSS mask
        WebkitMaskImage:
          "radial-gradient(circle 12px at 0 50%, transparent 99%, black 100%), radial-gradient(circle 12px at 100% 50%, transparent 99%, black 100%)",
        WebkitMaskComposite: "source-in",
        maskImage:
          "radial-gradient(circle 12px at 0 50%, transparent 99%, black 100%), radial-gradient(circle 12px at 100% 50%, transparent 99%, black 100%)",
        maskComposite: "intersect",
      }}
    >
      <div className="flex h-full">
        {/* Left section — dark, offer text */}
        <div
          className="flex flex-col justify-between p-5"
          style={{
            width: "60%",
            background: coupon.leftBg,
            color: coupon.textColor,
          }}
        >
          <div>
            <p
              className="text-[10px] font-semibold uppercase tracking-[0.18em]"
              style={{ color: coupon.accent, margin: "0 0 6px 0" }}
            >
              {coupon.eyebrow}
            </p>
            <p
              className="font-bold leading-tight"
              style={{ fontSize: "1.125rem", margin: "0 0 4px 0" }}
            >
              {coupon.title}
            </p>
            <div className="flex items-baseline gap-2">
              <span
                className="font-black"
                style={{ fontSize: "1.75rem", color: coupon.accent }}
              >
                {coupon.price}
              </span>
              <span
                className="text-xs line-through"
                style={{ opacity: 0.5 }}
              >
                {coupon.originalPrice}
              </span>
            </div>
          </div>
          <p className="text-[11px] leading-snug" style={{ opacity: 0.7, margin: 0 }}>
            {coupon.desc}
          </p>
        </div>

        {/* Middle — hourglass divider (dashed line) */}
        <div
          style={{
            width: "1px",
            background: `repeating-linear-gradient(to bottom, ${coupon.accent} 0 4px, transparent 4px 8px)`,
            margin: "12px 0",
          }}
        />

        {/* Right section — colored, coupon code */}
        <div
          className="flex flex-col items-center justify-center gap-2 p-4"
          style={{
            width: "40%",
            background: coupon.rightBg,
            color: coupon.textColor,
          }}
        >
          <Tag
            className="w-5 h-5"
            style={{ color: coupon.leftBg === "#0a0a0a" ? coupon.textColor : coupon.leftBg }}
          />
          <p
            className="text-[9px] font-semibold uppercase tracking-[0.2em]"
            style={{ opacity: 0.7, margin: 0 }}
          >
            Use Code
          </p>
          <p
            className="font-black tracking-wider"
            style={{ fontSize: "1.25rem", margin: 0, letterSpacing: "0.08em" }}
          >
            {coupon.code}
          </p>
          <p
            className="text-[9px] text-center leading-tight"
            style={{ opacity: 0.6, margin: 0 }}
          >
            Offer auto-applies at checkout
          </p>
        </div>
      </div>
    </Link>
  );
}
