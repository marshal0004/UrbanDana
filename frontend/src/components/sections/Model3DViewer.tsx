// /home/z/my-project/UrbanDana/frontend/src/components/sections/Model3DViewer.tsx
"use client";
import { useEffect, useRef, useState, lazy, Suspense } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { startScroll, onFrame } from "@/lib/scroll";
import { clamp, easeOutCubic, lerp, pinProgress, range } from "@/lib/math";
import { Box, RotateCw } from "lucide-react";

const Canvas3D = lazy(() => import("./Canvas3D"));

// 4 scroll sections — each has a 3D model + full background image
const SECTIONS = [
  {
    modelPath: "/models/cap-3d.glb",
    bgImage: "/images/3d-bg-1.jpg",
    title: "Signature Cap",
    subtitle: "Earth-Tone Floral",
    price: "₹249",
    accent: "#c8102e",
  },
  {
    modelPath: "/models/tshirt-3d.glb",
    bgImage: "/images/3d-bg-2.jpg",
    title: "Paisley T-Shirt",
    subtitle: "Black & White Print",
    price: "₹299",
    accent: "#d4a017",
  },
  {
    modelPath: "/models/cap-3d.glb",
    bgImage: "/images/3d-bg-3.jpg",
    title: "Olive Leaf Cap",
    subtitle: "Tropical Edition",
    price: "₹249",
    accent: "#10b981",
  },
  {
    modelPath: "/models/tshirt-3d.glb",
    bgImage: "/images/3d-bg-4.jpg",
    title: "Tribal T-Shirt",
    subtitle: "African Folk Art",
    price: "₹299",
    accent: "#a855f7",
  },
];

const STAGE_VH = 400; // 100vh per section × 4

export default function Model3DViewer() {
  const rootRef = useRef<HTMLElement>(null);
  const [activeSection, setActiveSection] = useState(0);
  const [loaded3D, setLoaded3D] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const cleanup = startScroll(reduced);
    return cleanup;
  }, [reduced]);

  // Track which section is active based on scroll progress
  useEffect(() => {
    let lastSection = -1;
    return onFrame(() => {
      const root = rootRef.current;
      if (!root) return;
      const { p, rect } = pinProgress(root);
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;

      const sectionIndex = Math.min(3, Math.floor(p * 4));
      if (sectionIndex !== lastSection) {
        lastSection = sectionIndex;
        setActiveSection(sectionIndex);
        if (!loaded3D) setLoaded3D(true);
      }
    });
  }, [loaded3D]);

  // Preload background images
  useEffect(() => {
    SECTIONS.forEach((s) => {
      const img = new Image();
      img.src = s.bgImage;
    });
  }, []);

  return (
    <section ref={rootRef} aria-label="3D Product Showcase" className="relative" style={{ height: `${STAGE_VH}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Background images — one per section, crossfade on scroll */}
        {SECTIONS.map((s, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-700"
            style={{
              backgroundImage: `url(${s.bgImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: activeSection === i ? 1 : 0,
            }}
          />
        ))}

        {/* Dark gradient overlay for text readability + 3D model contrast */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 70%, rgba(0,0,0,0.8) 100%)",
          }}
        />

        {/* 3D Model — centered, large, no background (transparent canvas) */}
        {loaded3D && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-full h-full max-w-[600px] max-h-[600px]">
              <Suspense fallback={
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="relative w-12 h-12 mb-4">
                    <div className="absolute inset-0 rounded-full border-4 border-white/20" />
                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-brand-red animate-spin" />
                  </div>
                  <p className="text-xs uppercase tracking-widest text-white/60 font-semibold flex items-center gap-2">
                    <RotateCw className="w-3 h-3 animate-spin" /> Loading 3D…
                  </p>
                </div>
              }>
                <Canvas3D
                  key={activeSection}
                  modelPath={SECTIONS[activeSection].modelPath}
                />
              </Suspense>
            </div>
          </div>
        )}

        {/* Product info — bottom center, changes per section */}
        <div className="absolute bottom-12 inset-x-0 text-center z-20 pointer-events-none">
          <div
            className="inline-flex flex-col items-center gap-2 transition-all duration-500"
            key={activeSection}
          >
            <p
              className="text-xs uppercase tracking-[0.4em] font-bold"
              style={{ color: SECTIONS[activeSection].accent }}
            >
              Interactive 3D
            </p>
            <h2 className="text-4xl md:text-6xl font-black text-white drop-shadow-2xl">
              {SECTIONS[activeSection].title}
            </h2>
            <p className="text-sm text-white/70 uppercase tracking-widest">
              {SECTIONS[activeSection].subtitle} · {SECTIONS[activeSection].price}
            </p>
            <div className="flex items-center gap-2 mt-3">
              <span className="bg-brand-red rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white flex items-center gap-1">
                <Box className="w-3 h-3" /> 3D
              </span>
              <span className="text-[10px] text-white/50 uppercase tracking-widest">
                Drag to rotate · Scroll to zoom
              </span>
            </div>
          </div>
        </div>

        {/* Section indicators — right side */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-3">
          {SECTIONS.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                const root = rootRef.current;
                if (root) {
                  const target = root.offsetTop + (root.offsetHeight / 4) * i;
                  window.scrollTo({ top: target, behavior: "smooth" });
                }
              }}
              className="w-1 h-12 rounded-full transition-all"
              style={{
                backgroundColor: activeSection === i
                  ? SECTIONS[i].accent
                  : "rgba(255,255,255,0.2)",
              }}
              aria-label={`Section ${i + 1}`}
            />
          ))}
        </div>

        {/* Scroll hint — only on first section */}
        {activeSection === 0 && (
          <div className="absolute inset-x-0 bottom-4 text-center z-20 pointer-events-none animate-bounce">
            <p className="text-xs uppercase tracking-widest text-white/40 font-semibold">
              ↓ Scroll to explore
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
