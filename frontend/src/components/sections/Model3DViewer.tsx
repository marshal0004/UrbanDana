// /home/z/my-project/UrbanDana/frontend/src/components/sections/Model3DViewer.tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { startScroll, onFrame } from "@/lib/scroll";
import { clamp, easeOutCubic, lerp, pinProgress, range } from "@/lib/math";
import { cn } from "@/lib/utils";

/**
 * Pure CSS 3D parallax — NO Three.js, NO WebGL.
 * Uses Selene template scroll technique.
 * Product images styled to look 3D via perspective + rotateY + drop-shadow.
 * 4 scroll sections, each 100vh.
 */

const SECTIONS = [
  { productImg: "/images/3d-bg-1.jpg", bgImg: "/images/3d-bg-1.jpg", label: "Signature Cap", accent: "#c8102e" },
  { productImg: "/images/3d-bg-2.jpg", bgImg: "/images/3d-bg-2.jpg", label: "Paisley T-Shirt", accent: "#d4a017" },
  { productImg: "/images/3d-bg-3.jpg", bgImg: "/images/3d-bg-3.jpg", label: "Olive Leaf Cap", accent: "#10b981" },
  { productImg: "/images/3d-bg-4.jpg", bgImg: "/images/3d-bg-4.jpg", label: "Tribal T-Shirt", accent: "#a855f7" },
];

const STAGE_VH = 400;

export default function Model3DViewer() {
  const rootRef = useRef<HTMLElement>(null);
  const bgRefs = useRef<(HTMLDivElement | null)[]>([]);
  const productRefs = useRef<(HTMLDivElement | null)[]>([]);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const hudRef = useRef<HTMLDivElement>(null);
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

      for (let i = 0; i < 4; i++) {
        const segStart = i * 0.25;
        const segEnd = (i + 1) * 0.25;
        const segP = range(p, segStart, segEnd);

        const bgIn = easeOutCubic(range(p, segStart - 0.03, segStart + 0.03));
        const bgOut = range(p, segEnd - 0.03, segEnd + 0.03);
        if (bgRefs.current[i]) {
          bgRefs.current[i]!.style.opacity = String(bgIn * (1 - bgOut));
          bgRefs.current[i]!.style.transform = `translate3d(0, ${lerp(0, -8, segP)}vh, 0) scale(${lerp(1.1, 1, segP)})`;
        }

        const imgIn = easeOutCubic(range(p, segStart, segStart + 0.08));
        const imgHold = range(p, segStart + 0.08, segEnd - 0.08);
        const imgOut = range(p, segEnd - 0.08, segEnd);
        if (productRefs.current[i]) {
          const scale = lerp(0.5, 1.0, imgIn) * (1 + imgHold * 0.05);
          const yMove = lerp(10, 0, imgIn) - imgOut * 8;
          const rotateY = lerp(30, 0, imgIn) - imgOut * 20;
          const translateZ = lerp(-100, 0, imgIn);
          const opacity = imgIn * (1 - imgOut * 0.8);
          productRefs.current[i]!.style.transform = `translate3d(0, ${yMove}vh, ${translateZ}px) scale(${scale}) rotateY(${rotateY}deg)`;
          productRefs.current[i]!.style.opacity = String(opacity);
        }

        const lIn = easeOutCubic(range(p, segStart + 0.02, segStart + 0.06));
        const lOut = range(p, segEnd - 0.06, segEnd - 0.02);
        if (labelRefs.current[i]) {
          labelRefs.current[i]!.style.opacity = String(lIn * (1 - lOut));
          labelRefs.current[i]!.style.letterSpacing = `${lerp(0.3, 0.1, lIn)}em`;
        }
      }

      if (hudRef.current) {
        hudRef.current.style.opacity = String(range(p, 0.02, 0.05) * (1 - range(p, 0.93, 0.98)));
      }
    });
  }, []);

  return (
    <section ref={rootRef} aria-label="3D Product Showcase" className="relative" style={{ height: `${STAGE_VH}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden bg-black">
        {SECTIONS.map((s, i) => (
          <div key={`bg-${i}`} ref={(el) => { bgRefs.current[i] = el; }} className="absolute inset-0 will-change-transform"
            style={{ backgroundImage: `url(${s.bgImg})`, backgroundSize: "cover", backgroundPosition: "center", opacity: i === 0 ? 1 : 0 }} />
        ))}

        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.8) 100%)" }} />

        <div className="absolute inset-0" style={{ perspective: "1200px", transformStyle: "preserve-3d" }}>
          {SECTIONS.map((s, i) => (
            <div key={`product-${i}`} ref={(el) => { productRefs.current[i] = el; }}
              className="absolute inset-0 flex items-center justify-center will-change-transform"
              style={{ opacity: i === 0 ? 1 : 0, transformStyle: "preserve-3d" }}>
              <div className="relative" style={{ width: "min(60vw, 450px)", height: "min(60vh, 450px)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.productImg} alt={s.label} className="w-full h-full object-contain"
                  style={{ filter: "drop-shadow(0 25px 80px rgba(0,0,0,0.9)) drop-shadow(0 0 30px rgba(0,0,0,0.5))" }} />
              </div>
            </div>
          ))}
        </div>

        {SECTIONS.map((s, i) => (
          <div key={`label-${i}`} ref={(el) => { labelRefs.current[i] = el; }}
            className="pointer-events-none absolute bottom-16 inset-x-0 text-center z-20" style={{ opacity: i === 0 ? 1 : 0 }}>
            <p className="text-xs uppercase tracking-[0.4em] font-bold mb-2" style={{ color: s.accent }}>Interactive 3D</p>
            <h2 className="text-3xl md:text-5xl font-black text-white drop-shadow-2xl">{s.label}</h2>
          </div>
        ))}

        <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-3">
          {SECTIONS.map((_, i) => (
            <div key={i} className="w-1 rounded-full" style={{ height: "24px", backgroundColor: "rgba(255,255,255,0.2)" }} />
          ))}
        </div>

        <div ref={hudRef} className="pointer-events-none absolute inset-x-0 bottom-4 text-center z-20" style={{ opacity: 0 }}>
          <p className="text-xs uppercase tracking-widest text-white/40 font-semibold animate-bounce">↓ Scroll to explore</p>
        </div>
      </div>
    </section>
  );
}
