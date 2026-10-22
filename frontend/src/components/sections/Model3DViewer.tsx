// /home/z/my-project/UrbanDana/frontend/src/components/sections/Model3DViewer.tsx
"use client";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { startScroll, onFrame } from "@/lib/scroll";
import { clamp, easeOutCubic, lerp, pinProgress, range } from "@/lib/math";

/**
 * Pure CSS 3D parallax — Editorial Hero design with the 4 uploaded product images.
 *
 * IMAGES (from upload "3d scroll.zip"):
 *  1 = Signature Cap — styled lifestyle photo (cream cap + brown florals + props)
 *  2 = Paisley T-Shirt — clean product cutout on dark gray
 *  3 = Olive Leaf Cap — styled lifestyle photo (cream cap + olive pattern + props)
 *  4 = Tribal T-Shirt — clean product on textured concrete
 *
 * Since each image is already a complete, polished product shot (not a fabric
 * texture), the SAME image is used for both background and foreground. The
 * background is HEAVILY blurred + dimmed so it acts as a soft atmospheric glow,
 * while the foreground shows the same image crisp on a white card.
 *
 * 3D ENHANCEMENTS:
 *  - Deeper perspective (1500px, was 1200px) → more dramatic depth
 *  - Larger product (min(84vw, 672px) — +20% from previous 560px)
 *  - Stronger drop-shadow + multi-layer glow behind product
 *  - Subtle 3D tilt during scroll (rotateX + rotateY combined) — image
 *    tilts in 2 axes for genuine 3D feel
 *  - Card border highlight + inner reflection
 */

const SECTIONS = [
  {
    img: "/images/scroll-1.jpeg",
    label: "Signature Cap",
    accent: "#c8102e",
    aspect: 1.77, // 2752×1552 — landscape 16:9 (styled cap with props)
    square: false, // use 16:9 landscape card (caps look good this way)
  },
  {
    img: "/images/scroll-2.jpeg",
    label: "Paisley T-Shirt",
    accent: "#d4a017",
    aspect: 1.0,  // 1254×1254 — square (clean t-shirt cutout)
    square: true, // REVERTED to original 1:1 square card (no change to t-shirts)
  },
  {
    img: "/images/scroll-3.jpeg",
    label: "Olive Leaf Cap",
    accent: "#10b981",
    aspect: 1.77, // 2752×1552 — landscape 16:9 (styled cap with props)
    square: false, // use 16:9 landscape card (caps look good this way)
  },
  {
    img: "/images/scroll-4.jpeg",
    label: "Tribal T-Shirt",
    accent: "#a855f7",
    aspect: 1.17, // 718×615 — ~4:3 landscape (t-shirt on concrete)
    square: true, // REVERTED to original 1:1 square card (no change to t-shirts)
  },
];

const STAGE_VH = 320;
const SECTION_COUNT = SECTIONS.length;
const SECTION_SIZE = 1 / SECTION_COUNT;

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

        // === Background layer — same image, heavily blurred + dimmed (atmosphere) ===
        const bgIn = i === 0 ? 1 : easeOutCubic(range(p, segStart - 0.03, segStart + 0.03));
        const bgOut = range(p, segEnd - 0.03, segEnd + 0.03);
        if (bgRefs.current[i]) {
          bgRefs.current[i]!.style.opacity = String(bgIn * (1 - bgOut));
          // Parallax: 6vh drift (was 4) + scale 1.1 → 1.0 (more movement)
          bgRefs.current[i]!.style.transform = `translate3d(0, ${lerp(0, -6, segP)}vh, 0) scale(${lerp(1.1, 1.0, segP)})`;
        }

        // === Product (foreground) — 3D float with dual-axis tilt ===
        const imgIn = i === 0 ? 1 : easeOutCubic(range(p, segStart, segStart + ENTER_END));
        const imgOut = i === SECTION_COUNT - 1
          ? range(p, segEnd - 0.02, segEnd)
          : easeOutCubic(range(p, segEnd - (1 - EXIT_START), segEnd));

        if (productRefs.current[i]) {
          // HOLD: scale 1.0, no rotation, centered, opacity 1
          // ENTER: scale 0.85 → 1.0, rotateY 15° → 0, rotateX 5° → 0, translateY 4vh → 0, translateZ -60 → 0
          // EXIT:  scale 1.0 → 0.85, rotateY 0 → -15°, rotateX 0 → -5°, translateY 0 → -4vh, translateZ 0 → -60
          const scale = lerp(0.85, 1.0, imgIn) * lerp(1.0, 0.85, imgOut);
          const yMove = lerp(4, 0, imgIn) - imgOut * 4;
          const rotateY = lerp(15, 0, imgIn) - imgOut * 15;
          const rotateX = lerp(5, 0, imgIn) - imgOut * 5;       // NEW: dual-axis tilt
          const translateZ = lerp(-60, 0, imgIn) - imgOut * 60;
          const opacity = imgIn * (1 - imgOut);
          productRefs.current[i]!.style.transform =
            `translate3d(0, ${yMove}vh, ${translateZ}px) scale(${scale}) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
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

      // Active progress dots
      for (let i = 0; i < SECTION_COUNT; i++) {
        if (dotRefs.current[i]) {
          const isActive = i === activeIdx;
          dotRefs.current[i]!.style.width = isActive ? "32px" : "8px";
          dotRefs.current[i]!.style.backgroundColor = isActive
            ? SECTIONS[i].accent
            : "rgba(255,255,255,0.25)";
        }
      }

      // HUD
      if (hudRef.current) {
        hudRef.current.style.opacity = String(range(p, 0.01, 0.03) * (1 - range(p, 0.95, 0.99)));
      }
    });
  }, []);

  return (
    <section ref={rootRef} aria-label="3D Product Showcase" className="relative" style={{ height: `${STAGE_VH}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden bg-black">
        {/* === BACKGROUND LAYER === same image, heavily blurred + dimmed for atmosphere */}
        {SECTIONS.map((s, i) => (
          <div
            key={`bg-${i}`}
            ref={(el) => { bgRefs.current[i] = el; }}
            className="absolute inset-0 will-change-transform"
            style={{
              backgroundImage: `url(${s.img})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: i === 0 ? 1 : 0,
              // Heavy blur (8px) + dim (0.7) → background becomes soft atmosphere
              filter: "blur(8px) brightness(0.7)",
            }}
          />
        ))}

        {/* === COLOR TINT OVERLAY === subtle accent tint per section for mood */}
        <div
          className="absolute inset-0 pointer-events-none mix-blend-overlay"
          style={{
            background: "radial-gradient(ellipse at center, rgba(255,255,255,0.15) 0%, transparent 70%)",
          }}
        />

        {/* === BOTTOM GRADIENT === for label legibility */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, transparent 25%, transparent 55%, rgba(0,0,0,0.7) 85%, rgba(0,0,0,0.95) 100%)",
          }}
        />

        {/* === PRODUCT LAYER === crisp product card floating on multi-layer glow === */}
        <div
          className="absolute inset-0"
          style={{ perspective: "1500px", transformStyle: "preserve-3d" }}  // deeper perspective (was 1200)
        >
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
              {/* Layer 1: LARGE soft outer glow (atmospheric halo) */}
              <div
                className="absolute"
                style={{
                  // T-shirts (square=true): keep original 1100px circle (unchanged)
                  // Caps (square=false): glow matches the card's 16:9 aspect
                  ...(s.square
                    ? {
                        width: "min(110vw, 1000px)",
                        height: "min(110vh, 1000px)",
                      }
                    : {
                        width: "min(110vw, 1100px)",
                        height: `min(${110 / s.aspect}vh, ${1100 / s.aspect}px)`,
                      }),
                  background: "radial-gradient(circle, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.15) 30%, rgba(255,255,255,0) 65%)",
                  borderRadius: "50%",
                  filter: "blur(40px)",
                  zIndex: 0,
                }}
              />
              {/* Layer 2: INNER glow (tighter, brighter) */}
              <div
                className="absolute"
                style={{
                  ...(s.square
                    ? {
                        width: "min(90vw, 760px)",
                        height: "min(90vh, 760px)",
                      }
                    : {
                        width: "min(95vw, 850px)",
                        height: `min(${95 / s.aspect}vh, ${850 / s.aspect}px)`,
                      }),
                  background: "radial-gradient(circle, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.55) 35%, rgba(255,255,255,0) 70%)",
                  borderRadius: "50%",
                  filter: "blur(20px)",
                  zIndex: 0,
                }}
              />
              {/*
                Layer 3: PRODUCT CARD
                - CAPS (square=false): card aspect == image aspect (16:9)
                  → no cropping, no margins on the wide cap photos
                - T-SHIRTS (square=true): REVERTED to original 1:1 square card
                  (672px × 672px, exactly as before the aspect-ratio change)
              */}
              <div
                className="relative overflow-hidden"
                style={
                  s.square
                    ? {
                        // ORIGINAL square card (t-shirts) — unchanged from before
                        width: "min(84vw, 672px)",
                        height: "min(84vh, 672px)",
                        zIndex: 1,
                        background: "rgba(255,255,255,0.98)",
                        borderRadius: "28px",
                        padding: "0",
                        boxShadow:
                          "0 40px 80px rgba(0,0,0,0.6), 0 0 100px rgba(255,255,255,0.2), inset 0 0 0 1px rgba(255,255,255,0.8)",
                      }
                    : {
                        // 16:9 landscape card (caps) — matches image aspect ratio
                        width: "min(90vw, 820px)",
                        height: `min(${90 / s.aspect}vw, ${820 / s.aspect}px)`,
                        maxWidth: "92vw",
                        maxHeight: "85vh",
                        zIndex: 1,
                        background: "rgba(255,255,255,0.98)",
                        borderRadius: "28px",
                        padding: "0",
                        boxShadow:
                          "0 40px 80px rgba(0,0,0,0.6), 0 0 100px rgba(255,255,255,0.2), inset 0 0 0 1px rgba(255,255,255,0.8)",
                      }
                }
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.img}
                  alt={s.label}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>

        {/* === LABELS === */}
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

        {/* === PROGRESS DOTS === */}
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
