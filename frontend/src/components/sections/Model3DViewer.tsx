// /home/z/my-project/UrbanDana/frontend/src/components/sections/Model3DViewer.tsx
"use client";
import { useEffect, useRef, useState, lazy, Suspense } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { startScroll, onFrame } from "@/lib/scroll";
import { clamp, easeOutCubic, lerp, pinProgress, range } from "@/lib/math";
import { Box, RotateCw } from "lucide-react";

const Canvas3D = lazy(() => import("./Canvas3D"));

// Preload BOTH models immediately on page load (not on scroll)
// This eliminates the 2-3 second delay when switching sections
import { useGLTF } from "@react-three/drei";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
const draco = new DRACOLoader();
draco.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
useGLTF.preload("/models/cap-3d.glb", true, (loader: any) => loader.setDRACOLoader(draco));
useGLTF.preload("/models/tshirt-3d.glb", true, (loader: any) => loader.setDRACOLoader(draco));

// 4 scroll sections — Selene-style pinned scroll with 3D models
const SECTIONS = [
  {
    modelPath: "/models/cap-3d.glb",
    bgImage: "/images/3d-bg-1.jpg",
    title: "Signature Cap",
    subtitle: "Earth-Tone Floral",
    price: "₹249",
    accent: "#c8102e",
    scale: 2.4,  // 3.0 × 0.8 = 20% reduction
  },
  {
    modelPath: "/models/tshirt-3d.glb",
    bgImage: "/images/3d-bg-2.jpg",
    title: "Paisley T-Shirt",
    subtitle: "Black & White Print",
    price: "₹299",
    accent: "#d4a017",
    scale: 1.8,  // 2.0 × 0.9 = 10% reduction
  },
  {
    modelPath: "/models/cap-3d.glb",
    bgImage: "/images/3d-bg-3.jpg",
    title: "Olive Leaf Cap",
    subtitle: "Tropical Edition",
    price: "₹249",
    accent: "#10b981",
    scale: 2.4,  // 3.0 × 0.8 = 20% reduction
  },
  {
    modelPath: "/models/tshirt-3d.glb",
    bgImage: "/images/3d-bg-4.jpg",
    title: "Tribal T-Shirt",
    subtitle: "African Folk Art",
    price: "₹299",
    accent: "#a855f7",
    scale: 1.8,  // 2.0 × 0.9 = 10% reduction
  },
];

const STAGE_VH = 160; // 40vh per section — instant transitions

export default function Model3DViewer() {
  const rootRef = useRef<HTMLElement>(null);
  const [activeSection, setActiveSection] = useState(0);
  const [visible, setVisible] = useState(false);
  const reduced = useReducedMotion();

  // Selene smooth scroll
  useEffect(() => {
    const cleanup = startScroll(reduced);
    return cleanup;
  }, [reduced]);

  // Only load 3D when section enters viewport (IntersectionObserver)
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Track active section via Selene's pinProgress technique
  useEffect(() => {
    let lastSection = -1;
    return onFrame(() => {
      if (!visible) return;
      const root = rootRef.current;
      if (!root) return;
      const { p, rect } = pinProgress(root);
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const sectionIndex = Math.min(3, Math.floor(p * 4));
      if (sectionIndex !== lastSection) {
        lastSection = sectionIndex;
        setActiveSection(sectionIndex);
      }
    });
  }, [visible]);

  // Preload background images
  useEffect(() => {
    SECTIONS.forEach((s) => {
      const img = new Image();
      img.src = s.bgImage;
    });
  }, []);

  const currentSection = SECTIONS[activeSection];

  return (
    <section ref={rootRef} aria-label="3D Product Showcase" className="relative" style={{ height: `${STAGE_VH}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden bg-black">
        {/* Background — crossfade between 4 images (contain = no cropping) */}
        {SECTIONS.map((s, i) => (
          <div
            key={`bg-${i}`}
            className="absolute inset-0 transition-opacity duration-500"
            style={{
              backgroundImage: `url(${s.bgImage})`,
              backgroundSize: "contain",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundColor: "#0a0a0a",
              opacity: activeSection === i ? 1 : 0,
            }}
          />
        ))}

        {/* Dark gradient overlay — radial for 3D model contrast */}
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at center, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.45) 60%, rgba(0,0,0,0.75) 100%)",
          }}
        />

        {/* 3D Model — FULL SCREEN canvas, transparent background, centered */}
        {visible && (
          <div className="absolute inset-0 z-10">
            <Suspense fallback={
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="relative w-12 h-12 mb-4">
                  <div className="absolute inset-0 rounded-full border-4 border-white/20" />
                  <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-brand-red animate-spin" />
                </div>
                <p className="text-xs uppercase tracking-widest text-white/60 font-semibold flex items-center gap-2">
                  <RotateCw className="w-3 h-3 animate-spin" /> Loading 3D model…
                </p>
              </div>
            }>
              <Canvas3D
                key={activeSection}
                modelPath={currentSection.modelPath}
                scale={currentSection.scale}
              />
            </Suspense>
          </div>
        )}

        {/* Product info — bottom center */}
        <div className="absolute bottom-12 inset-x-0 text-center z-20 pointer-events-none">
          <div className="inline-flex flex-col items-center gap-2" key={activeSection}>
            <p
              className="text-xs uppercase tracking-[0.4em] font-bold transition-colors duration-500"
              style={{ color: currentSection.accent }}
            >
              Interactive 3D
            </p>
            <h2 className="text-4xl md:text-6xl font-black text-white drop-shadow-2xl">
              {currentSection.title}
            </h2>
            <p className="text-sm text-white/70 uppercase tracking-widest">
              {currentSection.subtitle} · {currentSection.price}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="bg-brand-red rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white flex items-center gap-1">
                <Box className="w-3 h-3" /> 3D
              </span>
              <span className="text-[10px] text-white/50 uppercase tracking-widest">
                Drag to rotate · Scroll to zoom
              </span>
            </div>
          </div>
        </div>

        {/* Section indicators — right side (Selene-style) */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-3">
          {SECTIONS.map((s, i) => (
            <div
              key={i}
              className="w-1 rounded-full transition-all duration-500"
              style={{
                height: activeSection === i ? "48px" : "24px",
                backgroundColor: activeSection === i ? s.accent : "rgba(255,255,255,0.2)",
              }}
            />
          ))}
        </div>

        {/* Scroll hint — first section only */}
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
