// /home/z/my-project/UrbanDana/frontend/src/components/sections/Model3DViewer.tsx
"use client";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { startScroll, onFrame } from "@/lib/scroll";
import { clamp, easeOutCubic, lerp, pinProgress, range } from "@/lib/math";

/**
 * Pure CSS 3D parallax — Editorial Hero design (Unifiers of Japan inspired).
 *
 * DESIGN PRINCIPLES:
 *  - Background = MOOD / lifestyle photo (styled flat-lay or model shot)
 *  - Foreground = CLEAN product cutout on white card (separated from background)
 *  - The two layers use DIFFERENT images — NO "picture-in-picture" recursion.
 *  - Product sits on a soft radial white glow + card so it floats ABOVE the bg.
 *  - Background is slightly blurred (filter: blur) so it recedes behind product.
 *  - Bottom 35% has dark gradient so the label is always legible.
 *
 * SCROLL BEHAVIOR:
 *  - First product fully visible on page load (no fade-in).
 *  - Snappy 4% enter / 92% hold / 4% exit per section.
 *  - During HOLD: product at natural size (scale 1.0), centered, opacity 1.
 *  - Stage height = 320vh (4 × 80vh) — less scrolling than before.
 *  - Active progress dot on the right shows current section.
 */

// Section data — DIFFERENT images for background vs product (no recursion)
//   bgImg       = lifestyle/mood photo (styled flat-lay with props)
//   productImg  = clean catalog cutout (single product on simple bg)
const SECTIONS = [
  {
    bgImg: "/images/hero-cap-red.jpg",       // styled hero photo (red bandana + props)
    productImg: "/images/cat-caps.jpg",      // clean catalog cutout
    label: "Signature Cap",
    accent: "#c8102e",
  },
  {
    bgImg: "/images/3d-bg-2.jpg",            // paisley fabric texture
    productImg: "/images/cat-tshirts.jpg",   // clean t-shirt catalog
    label: "Paisley T-Shirt",
    accent: "#d4a017",
  },
  {
    bgImg: "/images/hero-cap-green.jpg",     // olive-green hero photo
    productImg: "/images/cat-caps.jpg",      // clean cap catalog
    label: "Olive Leaf Cap",
    accent: "#10b981",
  },
  {
    bgImg: "/images/3d-bg-4.jpg",            // tribal fabric texture
    productImg: "/images/cat-tshirts.jpg",   // clean t-shirt catalog
    label: "Tribal T-Shirt",
    accent: "#a855f7",
  },
];

const STAGE_VH = 320;
const SECTION_COUNT = SECTIONS.length;
const SECTION_SIZE = 1 / SECTION_COUNT;

// Per-section transition windows
const ENTER_END = 0.04;
const EXIT_START = 0.96;

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

      let activeIdx = 0;

      for (let i = 0; i < SECTION_COUNT; i++) {
        const segStart = i * SECTION_SIZE;
        const segEnd = (i + 1) * SECTION_SIZE;
        const segP = range(p, segStart, segEnd);

        if (p >= segStart && p < segEnd) activeIdx = i;

        // === Background layer ===
        // First section visible from p=0; others crossfade over 6%.
        const bgIn = i === 0 ? 1 : easeOutCubic(range(p, segStart - 0.03, segStart + 0.03));
        const bgOut = range(p, segEnd - 0.03, segEnd + 0.03);
        if (bgRefs.current[i]) {
          bgRefs.current[i]!.style.opacity = String(bgIn * (1 - bgOut));
          // Subtle parallax: 4vh drift + scale 1.05 → 1.0
          bgRefs.current[i]!.style.transform = `translate3d(0, ${lerp(0, -4, segP)}vh, 0) scale(${lerp(1.05, 1.0, segP)})`;
        }

        // === Product (foreground) ===
        // First section fully visible from p=0; others snap in over 4%.
        const imgIn = i === 0 ? 1 : easeOutCubic(range(p, segStart, segStart + ENTER_END));
        const imgOut = i === SECTION_COUNT - 1
          ? range(p, segEnd - 0.02, segEnd)
          : easeOutCubic(range(p, segEnd - (1 - EXIT_START), segEnd));

        if (productRefs.current[i]) {
          // HOLD: scale 1.0, rotateY 0, translateY 0, translateZ 0, opacity 1
          const scale = lerp(0.92, 1.0, imgIn) * lerp(1.0, 0.92, imgOut);
          const yMove = lerp(3, 0, imgIn) - imgOut * 3;
          const rotateY = lerp(10, 0, imgIn) - imgOut * 10;
          const translateZ = lerp(-40, 0, imgIn) - imgOut * 40;
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

      // Active dot indicator
      for (let i = 0; i < SECTION_COUNT; i++) {
        if (dotRefs.current[i]) {
          const isActive = i === activeIdx;
          dotRefs.current[i]!.style.width = isActive ? "32px" : "8px";
          dotRefs.current[i]!.style.backgroundColor = isActive
            ? SECTIONS[i].accent
            : "rgba(255,255,255,0.25)";
        }
      }

      // HUD scroll hint
      if (hudRef.current) {
        hudRef.current.style.opacity = String(range(p, 0.01, 0.03) * (1 - range(p, 0.95, 0.99)));
      }
    });
  }, []);

  return (
    <section ref={rootRef} aria-label="3D Product Showcase" className="relative" style={{ height: `${STAGE_VH}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden bg-black">
        {/* === BACKGROUND LAYER === mood/lifestyle photos, slightly blurred so they recede */}
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
              // Slight blur pushes the background behind the floating product
              filter: "blur(3px) brightness(0.85)",
            }}
          />
        ))}

        {/* === GRADIENT OVERLAY === top fade (subtle) + bottom 35% dark for text legibility */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, transparent 25%, transparent 50%, rgba(0,0,0,0.55) 80%, rgba(0,0,0,0.85) 100%)",
          }}
        />

        {/* === PRODUCT LAYER === clean catalog cutouts floating on white radial glow */}
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
              {/* Soft white radial glow behind product — separates it from bg */}
              <div
                className="absolute"
                style={{
                  width: "min(85vw, 700px)",
                  height: "min(85vh, 700px)",
                  background: "radial-gradient(circle, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.55) 35%, rgba(255,255,255,0) 70%)",
                  borderRadius: "50%",
                  filter: "blur(20px)",
                  zIndex: 0,
                }}
              />
              {/* Product image — bumped +20% to 70vw/70vh, max 560px */}
              <div
                className="relative"
                style={{
                  width: "min(70vw, 560px)",
                  height: "min(70vh, 560px)",
                  zIndex: 1,
                  background: "rgba(255,255,255,0.95)",
                  borderRadius: "24px",
                  padding: "20px",
                  boxShadow: "0 30px 60px rgba(0,0,0,0.5), 0 0 80px rgba(255,255,255,0.15)",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.productImg}
                  alt={s.label}
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
            </div>
          ))}
        </div>

        {/* === LABELS === bottom-center, legible on the dark gradient */}
        {SECTIONS.map((s, i) => (
          <div
            key={`label-${i}`}
            ref={(el) => { labelRefs.current[i] = el; }}
            className="pointer-events-none absolute bottom-20 inset-x-0 text-center z-20"
            style={{ opacity: i === 0 ? 1 : 0 }}
          >
            <p
              className="text-sm uppercase tracking-[0.4em] font-bold mb-2"
              style={{ color: s.accent }}
            >
              Interactive 3D
            </p>
            <h2 className="text-4xl md:text-6xl font-black text-white drop-shadow-2xl">
              {s.label}
            </h2>
          </div>
        ))}

        {/* === ACTIVE PROGRESS DOTS === right side */}
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

        {/* === SCROLL HINT === */}
        <div
          ref={hudRef}
          className="pointer-events-none absolute inset-x-0 bottom-6 text-center z-20"
          style={{ opacity: 0 }}
        >
          <p className="text-xs uppercase tracking-widest text-white/60 font-semibold animate-bounce">
            ↓ Scroll to explore
          </p>
        </div>
      </div>
    </section>
  );
}
