// /home/z/my-project/UrbanDana/frontend/src/components/sections/Model3DViewer.tsx
"use client";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { startScroll, onFrame } from "@/lib/scroll";
import { clamp, easeOutCubic, lerp, pinProgress, range } from "@/lib/math";

/**
 * Pure CSS 3D parallax — NO Three.js, NO WebGL.
 *
 * Design principles (Unifiers of Japan-inspired — cinematic, image-first):
 *  - Each product image sits at its NATURAL size (scale 1.0), CENTERED, at FULL
 *    opacity for 92% of its scroll section.
 *  - Only a quick 4% cinematic transition between sections (snappy enter from
 *    one side, quick exit to the other) — image is NEVER faded during the hold.
 *  - First product is fully visible on initial page load (no enter fade for i=0).
 *  - Less total scrolling (320vh = 4 × 80vh) so every product is reachable.
 *  - Subtle parallax on the background (4vh drift, gentle scale) — premium feel
 *    without distracting from the product.
 */

const SECTIONS = [
  { productImg: "/images/3d-bg-1.jpg", bgImg: "/images/3d-bg-1.jpg", label: "Signature Cap", accent: "#c8102e" },
  { productImg: "/images/3d-bg-2.jpg", bgImg: "/images/3d-bg-2.jpg", label: "Paisley T-Shirt", accent: "#d4a017" },
  { productImg: "/images/3d-bg-3.jpg", bgImg: "/images/3d-bg-3.jpg", label: "Olive Leaf Cap", accent: "#10b981" },
  { productImg: "/images/3d-bg-4.jpg", bgImg: "/images/3d-bg-4.jpg", label: "Tribal T-Shirt", accent: "#a855f7" },
];

// 4 sections × 80vh = 320vh total scroll (was 400vh — less scrolling needed)
const STAGE_VH = 320;
const SECTION_COUNT = SECTIONS.length;
const SECTION_SIZE = 1 / SECTION_COUNT; // 0.25 each

// Per-section transition windows (fractions of the section)
const ENTER_END = 0.04;   // first 4% = enter transition
const EXIT_START = 0.96;  // last 4% = exit transition

export default function Model3DViewer() {
  const rootRef = useRef<HTMLElement>(null);
  const bgRefs = useRef<(HTMLDivElement | null)[]>([]);
  const productRefs = useRef<(HTMLDivElement | null)[]>([]);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const hudRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const reduced = useReducedMotion();

  useEffect(() => { const c = startScroll(reduced); return c; }, [reduced]);

  useEffect(() => {
    let lastP = -1;
    return onFrame(() => {
      const root = rootRef.current;
      if (!root) return;
      const { p, rect } = pinProgress(root);
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      if (Math.abs(p - lastP) < 0.0005) return;
      lastP = p;

      // Track which section is currently "active" (for the dot indicator)
      let activeIdx = 0;

      for (let i = 0; i < SECTION_COUNT; i++) {
        const segStart = i * SECTION_SIZE;
        const segEnd = (i + 1) * SECTION_SIZE;
        const segP = range(p, segStart, segEnd);

        // Active section = the one whose segment we're currently inside
        if (p >= segStart && p < segEnd) activeIdx = i;

        // === Background ===
        // First section: visible from p=0 (no enter fade needed).
        // Other sections: quick 6% crossfade with previous.
        const bgEnterStart = i === 0 ? -1 : segStart - 0.03;
        const bgEnterEnd = i === 0 ? 0 : segStart + 0.03;
        const bgIn = easeOutCubic(range(p, bgEnterStart, bgEnterEnd));
        const bgOut = range(p, segEnd - 0.03, segEnd + 0.03);
        if (bgRefs.current[i]) {
          bgRefs.current[i]!.style.opacity = String(bgIn * (1 - bgOut));
          // Subtle parallax: 4vh drift, scale 1.05 → 1.0
          bgRefs.current[i]!.style.transform = `translate3d(0, ${lerp(0, -4, segP)}vh, 0) scale(${lerp(1.05, 1.0, segP)})`;
        }

        // === Product image ===
        // First section: fully visible from p=0 (no enter fade)
        // Other sections: 4% enter transition (snappy)
        const imgEnterStart = i === 0 ? -1 : segStart;
        const imgEnterEnd = i === 0 ? 0 : segStart + ENTER_END;
        const imgIn = i === 0 ? 1 : easeOutCubic(range(p, imgEnterStart, imgEnterEnd));
        const imgOut = i === SECTION_COUNT - 1
          ? range(p, segEnd - 0.02, segEnd) // last section: tiny fade at end
          : easeOutCubic(range(p, segEnd - (1 - EXIT_START), segEnd));

        if (productRefs.current[i]) {
          // HOLD (imgIn=1, imgOut=0): scale 1.0, rotateY 0, translateY 0, translateZ 0
          // ENTER: scale 0.92→1.0, rotateY 10°→0, translateY 3vh→0, translateZ -40→0
          // EXIT:  scale 1.0→0.92, rotateY 0→-10°, translateY 0→-3vh, translateZ 0→-40
          const scale = lerp(0.92, 1.0, imgIn) * lerp(1.0, 0.92, imgOut);
          const yMove = lerp(3, 0, imgIn) - imgOut * 3;
          const rotateY = lerp(10, 0, imgIn) - imgOut * 10;
          const translateZ = lerp(-40, 0, imgIn) - imgOut * 40;
          // Opacity: 1 during hold, fades only during enter/exit
          const opacity = imgIn * (1 - imgOut);
          productRefs.current[i]!.style.transform = `translate3d(0, ${yMove}vh, ${translateZ}px) scale(${scale}) rotateY(${rotateY}deg)`;
          productRefs.current[i]!.style.opacity = String(opacity);
        }

        // === Label ===
        const lIn = i === 0 ? 1 : easeOutCubic(range(p, segStart + 0.01, segStart + 0.04));
        const lOut = range(p, segEnd - 0.04, segEnd - 0.01);
        if (labelRefs.current[i]) {
          labelRefs.current[i]!.style.opacity = String(lIn * (1 - lOut));
          labelRefs.current[i]!.style.letterSpacing = `${lerp(0.3, 0.1, lIn)}em`;
        }
      }

      // === Dot indicator (active = wide, others = small) ===
      for (let i = 0; i < SECTION_COUNT; i++) {
        if (dotRefs.current[i]) {
          const isActive = i === activeIdx;
          dotRefs.current[i]!.style.width = isActive ? "32px" : "8px";
          dotRefs.current[i]!.style.backgroundColor = isActive
            ? SECTIONS[i].accent
            : "rgba(255,255,255,0.25)";
        }
      }

      // === HUD ===
      if (hudRef.current) {
        hudRef.current.style.opacity = String(range(p, 0.01, 0.03) * (1 - range(p, 0.95, 0.99)));
      }
    });
  }, []);

  return (
    <section ref={rootRef} aria-label="3D Product Showcase" className="relative" style={{ height: `${STAGE_VH}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden bg-black">
        {/* Background layers — cover images with subtle parallax */}
        {SECTIONS.map((s, i) => (
          <div
            key={`bg-${i}`}
            ref={(el) => { bgRefs.current[i] = el; }}
            className="absolute inset-0 will-change-transform"
            style={{
              backgroundImage: `url(${s.bgImg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: i === 0 ? 1 : 0,
            }}
          />
        ))}

        {/* Radial vignette — softer than before (35% edge darkening vs 80%) */}
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at center, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.35) 60%, rgba(0,0,0,0.65) 100%)",
          }}
        />

        {/* 3D product layer — perspective container */}
        <div className="absolute inset-0" style={{ perspective: "1200px", transformStyle: "preserve-3d" }}>
          {SECTIONS.map((s, i) => (
            <div
              key={`product-${i}`}
              ref={(el) => { productRefs.current[i] = el; }}
              className="absolute inset-0 flex items-center justify-center will-change-transform"
              style={{
                opacity: i === 0 ? 1 : 0,
                transformStyle: "preserve-3d",
              }}
            >
              {/* Product image — NATURAL size (no growth), subtle drop shadow */}
              <div
                className="relative"
                style={{
                  width: "min(60vw, 420px)",
                  height: "min(60vh, 420px)",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.productImg}
                  alt={s.label}
                  className="w-full h-full object-contain"
                  style={{
                    filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.7)) drop-shadow(0 0 20px rgba(0,0,0,0.4))",
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Labels */}
        {SECTIONS.map((s, i) => (
          <div
            key={`label-${i}`}
            ref={(el) => { labelRefs.current[i] = el; }}
            className="pointer-events-none absolute bottom-20 inset-x-0 text-center z-20"
            style={{ opacity: i === 0 ? 1 : 0 }}
          >
            <p className="text-xs uppercase tracking-[0.4em] font-bold mb-2" style={{ color: s.accent }}>
              Interactive 3D
            </p>
            <h2 className="text-3xl md:text-5xl font-black text-white drop-shadow-2xl">
              {s.label}
            </h2>
          </div>
        ))}

        {/* Section progress dots — right side (Unifiers of Japan style) */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-3">
          {SECTIONS.map((_, i) => (
            <div
              key={i}
              ref={(el) => { dotRefs.current[i] = el; }}
              className="rounded-full transition-all duration-300"
              style={{
                height: "8px",
                width: i === 0 ? "32px" : "8px",
                backgroundColor: i === 0 ? SECTIONS[i].accent : "rgba(255,255,255,0.25)",
              }}
            />
          ))}
        </div>

        {/* Scroll hint */}
        <div
          ref={hudRef}
          className="pointer-events-none absolute inset-x-0 bottom-6 text-center z-20"
          style={{ opacity: 0 }}
        >
          <p className="text-xs uppercase tracking-widest text-white/40 font-semibold animate-bounce">
            ↓ Scroll to explore
          </p>
        </div>
      </div>
    </section>
  );
}
