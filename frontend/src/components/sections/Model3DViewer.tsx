// /home/z/my-project/UrbanDana/frontend/src/components/sections/Model3DViewer.tsx
"use client";
import { useEffect, useRef, useState, lazy, Suspense } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { startScroll, onFrame } from "@/lib/scroll";
import { clamp, easeOutCubic, lerp, pinProgress, range } from "@/lib/math";
import { absUrl } from "@/lib/api";
import { Box, Eye, RotateCw } from "lucide-react";

// Lazy-load 3D Canvas ONLY when section is visible
const Canvas3D = lazy(() => import("./Canvas3D"));

const STAGE_VH = 300;

// Use product images for parallax + actual 3D model for the cap
const CAP_IMG = absUrl("/uploads/products/caps/caps-001.jpg");
const TSHIRT_IMG = absUrl("/uploads/products/tshirts/tshirt-001.jpg");

export default function Model3DViewer() {
  const rootRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const model3dRef = useRef<HTMLDivElement>(null);
  const productRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);
  const [show3D, setShow3D] = useState(false);
  const [inView, setInView] = useState(false);
  const reduced = useReducedMotion();

  // Only load 3D when section scrolls into view (IntersectionObserver)
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow3D(true);
          setInView(true);
        } else {
          setInView(false);
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const cleanup = startScroll(reduced);
    return cleanup;
  }, [reduced]);

  useEffect(() => {
    let lastP = -1;
    return onFrame(() => {
      if (!inView) return; // Skip all calculations when not visible
      const root = rootRef.current;
      if (!root) return;
      const { p, rect } = pinProgress(root);
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      if (Math.abs(p - lastP) < 0.0005) return;
      lastP = p;

      // Background
      if (bgRef.current) {
        bgRef.current.style.transform = `translate3d(0, ${lerp(0, -10, p)}vh, 0) scale(${lerp(1.05, 1, p)})`;
      }

      // Title
      const tIn = easeOutCubic(range(p, 0.02, 0.12));
      const tOut = range(p, 0.35, 0.45);
      if (titleRef.current) {
        titleRef.current.style.opacity = String(tIn * (1 - tOut));
        titleRef.current.style.letterSpacing = `${lerp(0.4, 0.1, tIn)}em`;
      }

      // 3D model container — scales and moves
      const modelIn = easeOutCubic(range(p, 0.05, 0.2));
      const modelOut = range(p, 0.4, 0.55);
      if (model3dRef.current) {
        model3dRef.current.style.opacity = String(modelIn * (1 - modelOut));
        model3dRef.current.style.transform = `translate3d(0, ${lerp(20, 0, modelIn)}vh, 0) scale(${lerp(0.8, 1, modelIn)})`;
      }

      // T-shirt product card — slides in from right
      const prodIn = easeOutCubic(range(p, 0.2, 0.4));
      const prodOut = range(p, 0.55, 0.7);
      if (productRef.current) {
        productRef.current.style.transform = `translate3d(${lerp(50, 0, prodIn)}vw, 0, 0)`;
        productRef.current.style.opacity = String(prodIn * (1 - prodOut));
      }

      // HUD
      if (hudRef.current) {
        hudRef.current.style.opacity = String(range(p, 0.02, 0.08) * (1 - range(p, 0.8, 0.9)));
      }
    });
  }, [inView]);

  return (
    <section ref={rootRef} aria-label="3D Product Showcase" className="relative" style={{ height: `${STAGE_VH}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden bg-white">
        {/* Parallax background */}
        <div
          ref={bgRef}
          className="absolute inset-0 will-change-transform"
          style={{ background: "linear-gradient(180deg, #f5f5f5 0%, #ebebeb 50%, #f5f5f5 100%)" }}
        />

        {/* Title */}
        <div ref={titleRef} className="pointer-events-none absolute inset-x-0 top-[12%] text-center" style={{ opacity: 0 }}>
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-brand-red/10 flex items-center justify-center">
              <Eye className="w-5 h-5 text-brand-red" />
            </div>
          </div>
          <p className="text-xs uppercase tracking-[0.4em] text-brand-red font-semibold mb-2">
            Interactive 3D
          </p>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-brand-black">
            View in 3D
          </h2>
        </div>

        {/* LEFT: Actual 3D model (cap.glb) — lazy loaded, only renders when in view */}
        <div
          ref={model3dRef}
          className="absolute left-[5%] md:left-[10%] top-[30%] w-[40%] md:w-[35%] will-change-transform"
          style={{ opacity: 0 }}
        >
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-brand-black/10 bg-gradient-to-br from-gray-50 to-gray-200" style={{ height: "350px" }}>
            {show3D && inView ? (
              <Suspense
                fallback={
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="relative w-10 h-10 mb-3">
                      <div className="absolute inset-0 rounded-full border-4 border-gray-200" />
                      <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-brand-red animate-spin" />
                    </div>
                    <p className="text-xs uppercase tracking-widest text-brand-black/50 font-semibold flex items-center gap-1">
                      <RotateCw className="w-3 h-3 animate-spin" /> Loading 3D…
                    </p>
                  </div>
                }
              >
                <Canvas3D modelPath="/models/cap.glb" />
              </Suspense>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={CAP_IMG} alt="Cap preview" className="w-full h-full object-cover" />
              </div>
            )}
            {/* Info badge */}
            <div className="absolute bottom-3 left-3 bg-brand-black/80 backdrop-blur-md rounded-lg px-3 py-2 z-20 pointer-events-none">
              <p className="text-sm font-bold text-paper">Urbandana Cap</p>
              <p className="text-[10px] text-paper/60">₹249 · Drag to rotate</p>
            </div>
            {/* 3D badge */}
            <div className="absolute top-3 right-3 bg-brand-red rounded-full px-2.5 py-1 z-20 pointer-events-none">
              <p className="text-[10px] font-bold uppercase tracking-widest text-paper flex items-center gap-1">
                <Box className="w-3 h-3" /> 3D
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT: T-Shirt product card — slides in from right */}
        <div
          ref={productRef}
          className="absolute right-[5%] md:right-[10%] top-[30%] w-[40%] md:w-[35%] will-change-transform"
          style={{ opacity: 0 }}
        >
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-brand-black/10 bg-white" style={{ height: "350px" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={TSHIRT_IMG} alt="Urbandana T-Shirt" className="w-full h-full object-cover" />
            <div className="absolute bottom-3 left-3 bg-brand-black/80 backdrop-blur-md rounded-lg px-3 py-2 z-20">
              <p className="text-sm font-bold text-paper">Urbandana T-Shirt</p>
              <p className="text-[10px] text-paper/60">₹299 · Bandana-inspired</p>
            </div>
            <div className="absolute top-3 right-3 bg-brand-gold rounded-full px-2.5 py-1 z-20">
              <p className="text-[10px] font-bold uppercase tracking-widest text-brand-black flex items-center gap-1">
                <Box className="w-3 h-3" /> NEW
              </p>
            </div>
          </div>
        </div>

        {/* HUD */}
        <div ref={hudRef} className="pointer-events-none absolute inset-x-0 bottom-8 text-center" style={{ opacity: 0 }}>
          <p className="text-xs uppercase tracking-widest text-brand-black/40 font-semibold animate-bounce">
            ↓ Scroll to explore
          </p>
        </div>
      </div>
    </section>
  );
}
