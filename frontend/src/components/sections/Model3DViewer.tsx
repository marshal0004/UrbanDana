// /home/z/my-project/UrbanDana/frontend/src/components/sections/Model3DViewer.tsx
"use client";
import { useEffect, useRef, useState, lazy, Suspense } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { startScroll, onFrame } from "@/lib/scroll";
import { clamp, easeOutCubic, lerp, pinProgress, range } from "@/lib/math";
import { RotateCw } from "lucide-react";

const Canvas3D = lazy(() => import("./Canvas3D"));

import { useGLTF } from "@react-three/drei";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
const draco = new DRACOLoader();
draco.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
useGLTF.preload("/models/cap-3d.glb", true, (loader: any) => loader.setDRACOLoader(draco));
useGLTF.preload("/models/tshirt-3d.glb", true, (loader: any) => loader.setDRACOLoader(draco));

const SECTIONS = [
  { modelPath: "/models/cap-3d.glb", bgImage: "/images/3d-bg-1.jpg", scale: 2.4 },
  { modelPath: "/models/tshirt-3d.glb", bgImage: "/images/3d-bg-2.jpg", scale: 1.8 },
  { modelPath: "/models/cap-3d.glb", bgImage: "/images/3d-bg-3.jpg", scale: 2.4 },
  { modelPath: "/models/tshirt-3d.glb", bgImage: "/images/3d-bg-4.jpg", scale: 1.8 },
];

const STAGE_VH = 400; // 4 × 100vh

export default function Model3DViewer() {
  const rootRef = useRef<HTMLElement>(null);
  const [activeSection, setActiveSection] = useState(0);
  const [visible, setVisible] = useState(false);
  const [modelReady, setModelReady] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const cleanup = startScroll(reduced);
    return cleanup;
  }, [reduced]);

  // Only mount canvas when section enters viewport
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        if (entry.isIntersecting) setModelReady(false);
      },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Track active section
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
        setModelReady(false);
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

  return (
    <section ref={rootRef} className="relative" style={{ height: `${STAGE_VH}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden bg-black">
        {/* Background — cover, crossfade */}
        {SECTIONS.map((s, i) => (
          <div
            key={`bg-${i}`}
            className="absolute inset-0 transition-opacity duration-500"
            style={{
              backgroundImage: `url(${s.bgImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: activeSection === i ? 1 : 0,
            }}
          />
        ))}

        {/* Dark gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.45) 60%, rgba(0,0,0,0.75) 100%)",
          }}
        />

        {/* SINGLE 3D Canvas — swaps model, no flickering, no multiple WebGL contexts */}
        {visible && (
          <div className="absolute inset-0 z-10">
            <Suspense fallback={null}>
              <Canvas3D
                key={activeSection}
                modelPath={SECTIONS[activeSection].modelPath}
                scale={SECTIONS[activeSection].scale}
                onReady={() => setModelReady(true)}
              />
            </Suspense>
          </div>
        )}

        {/* Rotating loader — shows while model loads */}
        {visible && !modelReady && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
            <div className="relative w-14 h-14 mb-4">
              <div className="absolute inset-0 rounded-full border-4 border-white/15" />
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-brand-red animate-spin" />
            </div>
            <p className="text-xs uppercase tracking-widest text-white/50 font-semibold flex items-center gap-2">
              <RotateCw className="w-3 h-3 animate-spin" />
              Loading 3D…
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
