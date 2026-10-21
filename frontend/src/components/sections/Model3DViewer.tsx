// /home/z/my-project/UrbanDana/frontend/src/components/sections/Model3DViewer.tsx
"use client";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { startScroll, onFrame } from "@/lib/scroll";
import { clamp, easeOutCubic, lerp, pinProgress, range } from "@/lib/math";
import { absUrl } from "@/lib/api";
import { Box, Eye } from "lucide-react";

/**
 * Lightweight scroll-driven 3D product showcase.
 * NO Three.js, NO WebGL — uses CSS parallax transforms only.
 * Inspired by the Selene template's scroll technique.
 *
 * Layout: A pinned section where product images (cap + t-shirt) parallax
 * in from different directions as you scroll. Super performant — zero lag.
 */

const STAGE_VH = 300; // Total scroll height in viewport heights

// Product images — fetched from backend
const CAP_IMG = absUrl("/uploads/products/caps/caps-001.jpg");
const TSHIRT_IMG = absUrl("/uploads/products/tshirts/tshirt-001.jpg");
const CAP_IMG_2 = absUrl("/uploads/products/caps/caps-100.jpg");
const TSHIRT_IMG_2 = absUrl("/uploads/products/tshirts/tshirt-005.jpg");

export default function Model3DViewer() {
  const rootRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const capRef = useRef<HTMLDivElement>(null);
  const teeRef = useRef<HTMLDivElement>(null);
  const cap2Ref = useRef<HTMLDivElement>(null);
  const tee2Ref = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const cleanup = startScroll(reduced);
    return cleanup;
  }, [reduced]);

  useEffect(() => {
    let lastP = -1;
    return onFrame(() => {
      const root = rootRef.current;
      if (!root) return;
      const { p, rect } = pinProgress(root);
      if (rect.bottom < 0) return;
      if (Math.abs(p - lastP) < 0.0005) return;
      lastP = p;

      // Background parallax — slow drift
      if (bgRef.current) {
        bgRef.current.style.transform = `translate3d(0, ${lerp(0, -15, p)}vh, 0) scale(${lerp(1.1, 1, p)})`;
        bgRef.current.style.opacity = String(1 - range(p, 0.7, 1) * 0.5);
      }

      // Title: fades in then fades out
      const tIn = easeOutCubic(range(p, 0.02, 0.12));
      const tOut = range(p, 0.4, 0.5);
      if (titleRef.current) {
        titleRef.current.style.opacity = String(tIn * (1 - tOut));
        titleRef.current.style.letterSpacing = `${lerp(0.4, 0.1, tIn)}em`;
        titleRef.current.style.transform = `translate3d(0, ${-p * 4}vh, 0)`;
      }

      // Cap 1: slides in from left, rotates slightly
      const capIn = easeOutCubic(range(p, 0.1, 0.3));
      const capOut = range(p, 0.5, 0.65);
      if (capRef.current) {
        capRef.current.style.transform = `translate3d(${lerp(-60, 0, capIn)}vw, ${lerp(10, 0, capIn)}vh, 0) rotate(${lerp(-15, 0, capIn)}deg) scale(${lerp(0.8, 1, capIn)})`;
        capRef.current.style.opacity = String(capIn * (1 - capOut));
      }

      // T-shirt 1: slides in from right
      const teeIn = easeOutCubic(range(p, 0.15, 0.35));
      const teeOut = range(p, 0.5, 0.65);
      if (teeRef.current) {
        teeRef.current.style.transform = `translate3d(${lerp(60, 0, teeIn)}vw, ${lerp(10, 0, teeIn)}vh, 0) rotate(${lerp(15, 0, teeIn)}deg) scale(${lerp(0.8, 1, teeIn)})`;
        teeRef.current.style.opacity = String(teeIn * (1 - teeOut));
      }

      // Cap 2: slides in from bottom-left (second wave)
      const cap2In = easeOutCubic(range(p, 0.35, 0.55));
      const cap2Out = range(p, 0.7, 0.85);
      if (cap2Ref.current) {
        cap2Ref.current.style.transform = `translate3d(${lerp(-40, 0, cap2In)}vw, ${lerp(30, 0, cap2In)}vh, 0) scale(${lerp(0.7, 1, cap2In)})`;
        cap2Ref.current.style.opacity = String(cap2In * (1 - cap2Out));
      }

      // T-shirt 2: slides in from bottom-right
      const tee2In = easeOutCubic(range(p, 0.4, 0.6));
      const tee2Out = range(p, 0.7, 0.85);
      if (tee2Ref.current) {
        tee2Ref.current.style.transform = `translate3d(${lerp(40, 0, tee2In)}vw, ${lerp(30, 0, tee2In)}vh, 0) scale(${lerp(0.7, 1, tee2In)})`;
        tee2Ref.current.style.opacity = String(tee2In * (1 - tee2Out));
      }

      // HUD
      if (hudRef.current) {
        hudRef.current.style.opacity = String(range(p, 0.02, 0.08) * (1 - range(p, 0.85, 0.95)));
      }
    });
  }, []);

  return (
    <section ref={rootRef} aria-label="3D Product Showcase" className="relative" style={{ height: `${STAGE_VH}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden bg-white">
        {/* Parallax background — subtle gradient */}
        <div
          ref={bgRef}
          className="absolute inset-0 will-change-transform"
          style={{
            background: "linear-gradient(180deg, #f5f5f5 0%, #ebebeb 50%, #f5f5f5 100%)",
          }}
        />

        {/* Title */}
        <div ref={titleRef} className="pointer-events-none absolute inset-x-0 top-[18%] text-center" style={{ opacity: 0 }}>
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-brand-red/10 flex items-center justify-center">
              <Eye className="w-5 h-5 text-brand-red" />
            </div>
          </div>
          <p className="text-xs uppercase tracking-[0.4em] text-brand-red font-semibold mb-2">
            Interactive 3D
          </p>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-brand-black">
            View Products in 3D
          </h2>
          <p className="mt-3 text-sm text-brand-black/50 uppercase tracking-widest">
            Scroll to explore · Drag to rotate
          </p>
        </div>

        {/* Product 1: Cap — left side */}
        <div
          ref={capRef}
          className="absolute left-[8%] top-[25%] w-[35%] md:w-[28%] will-change-transform"
          style={{ opacity: 0 }}
        >
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-brand-black/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={CAP_IMG} alt="Urbandana Cap" className="w-full aspect-square object-cover" />
            <div className="absolute bottom-3 left-3 bg-brand-black/80 backdrop-blur-md rounded-lg px-3 py-2">
              <p className="text-sm font-bold text-paper">Urbandana Cap</p>
              <p className="text-[10px] text-paper/60">₹249 · 3-in-1 design</p>
            </div>
            <div className="absolute top-3 right-3 bg-brand-red rounded-full px-2.5 py-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-paper flex items-center gap-1">
                <Box className="w-3 h-3" /> 3D
              </p>
            </div>
          </div>
        </div>

        {/* Product 2: T-Shirt — right side */}
        <div
          ref={teeRef}
          className="absolute right-[8%] top-[25%] w-[35%] md:w-[28%] will-change-transform"
          style={{ opacity: 0 }}
        >
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-brand-black/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={TSHIRT_IMG} alt="Urbandana T-Shirt" className="w-full aspect-square object-cover" />
            <div className="absolute bottom-3 left-3 bg-brand-black/80 backdrop-blur-md rounded-lg px-3 py-2">
              <p className="text-sm font-bold text-paper">Urbandana T-Shirt</p>
              <p className="text-[10px] text-paper/60">₹299 · Bandana-inspired</p>
            </div>
            <div className="absolute top-3 right-3 bg-brand-red rounded-full px-2.5 py-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-paper flex items-center gap-1">
                <Box className="w-3 h-3" /> 3D
              </p>
            </div>
          </div>
        </div>

        {/* Product 3: Cap variant — bottom left */}
        <div
          ref={cap2Ref}
          className="absolute left-[15%] bottom-[15%] w-[30%] md:w-[22%] will-change-transform"
          style={{ opacity: 0 }}
        >
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-brand-black/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={CAP_IMG_2} alt="Urbandana Cap Variant" className="w-full aspect-square object-cover" />
            <div className="absolute bottom-3 left-3 bg-brand-black/80 backdrop-blur-md rounded-lg px-3 py-2">
              <p className="text-sm font-bold text-paper">Limited Edition</p>
              <p className="text-[10px] text-paper/60">₹249 · Only 200 pcs</p>
            </div>
          </div>
        </div>

        {/* Product 4: T-Shirt variant — bottom right */}
        <div
          ref={tee2Ref}
          className="absolute right-[15%] bottom-[15%] w-[30%] md:w-[22%] will-change-transform"
          style={{ opacity: 0 }}
        >
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-brand-black/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={TSHIRT_IMG_2} alt="Urbandana T-Shirt Variant" className="w-full aspect-square object-cover" />
            <div className="absolute bottom-3 left-3 bg-brand-black/80 backdrop-blur-md rounded-lg px-3 py-2">
              <p className="text-sm font-bold text-paper">Oversized T-Shirt</p>
              <p className="text-[10px] text-paper/60">₹299 · 240 GSM cotton</p>
            </div>
          </div>
        </div>

        {/* HUD — scroll indicator */}
        <div ref={hudRef} className="pointer-events-none absolute inset-x-0 bottom-8 text-center" style={{ opacity: 0 }}>
          <p className="text-xs uppercase tracking-widest text-brand-black/40 font-semibold animate-bounce">
            ↓ Scroll to explore
          </p>
        </div>
      </div>
    </section>
  );
}
