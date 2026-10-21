// /home/z/my-project/UrbanDana/frontend/src/components/sections/Model3DViewer.tsx
"use client";
import { useEffect, useRef, useState, lazy, Suspense } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { startScroll } from "@/lib/scroll";
import { clamp, easeOutCubic, lerp, range } from "@/lib/math";

const Canvas3D = lazy(() => import("./Canvas3D"));

// Preload BOTH models at module level (cached by useGLTF)
import { useGLTF } from "@react-three/drei";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
const draco = new DRACOLoader();
draco.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
useGLTF.preload("/models/cap-3d.glb", true, (loader: any) => loader.setDRACOLoader(draco));
useGLTF.preload("/models/tshirt-3d.glb", true, (loader: any) => loader.setDRACOLoader(draco));

// 4 separate full-screen sections — each has its own 3D model + background
const SECTIONS = [
  { modelPath: "/models/cap-3d.glb", bgImage: "/images/3d-bg-1.jpg", scale: 2.4 },
  { modelPath: "/models/tshirt-3d.glb", bgImage: "/images/3d-bg-2.jpg", scale: 1.8 },
  { modelPath: "/models/cap-3d.glb", bgImage: "/images/3d-bg-3.jpg", scale: 2.4 },
  { modelPath: "/models/tshirt-3d.glb", bgImage: "/images/3d-bg-4.jpg", scale: 1.8 },
];

export default function Model3DViewer() {
  const reduced = useReducedMotion();

  useEffect(() => {
    const cleanup = startScroll(reduced);
    return cleanup;
  }, [reduced]);

  return (
    <>
      {SECTIONS.map((s, i) => (
        <Section3D key={i} index={i} {...s} />
      ))}
    </>
  );
}

function Section3D({
  index,
  modelPath,
  bgImage,
  scale,
}: {
  index: number;
  modelPath: string;
  bgImage: string;
  scale: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const modelRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  // Load 3D only when this section enters viewport
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.05, rootMargin: "100px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Parallax scroll effect for background + model
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight;
        // Progress: 0 when section enters from bottom, 1 when section exits from top
        const progress = clamp((vh - rect.top) / (vh + rect.height));
        // Background parallax — slow drift
        if (bgRef.current) {
          const y = lerp(0, -8, progress);
          bgRef.current.style.transform = `translate3d(0, ${y}vh, 0) scale(1.1)`;
        }
        // Model — fade in from bottom, fade out at top
        if (modelRef.current) {
          const fadeIn = easeOutCubic(range(progress, 0.05, 0.25));
          const fadeOut = range(progress, 0.75, 0.95);
          const yMove = lerp(8, 0, fadeIn) - fadeOut * 6;
          const opacity = fadeIn * (1 - fadeOut);
          modelRef.current.style.transform = `translate3d(0, ${yMove}vh, 0)`;
          modelRef.current.style.opacity = String(opacity);
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      ref={ref}
      className="relative h-screen overflow-hidden bg-black"
      style={{ scrollSnapAlign: "start" }}
    >
      {/* Background — cover (fills screen, no black bars) */}
      <div
        ref={bgRef}
        className="absolute inset-0 will-change-transform"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Dark gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.45) 60%, rgba(0,0,0,0.75) 100%)",
        }}
      />

      {/* 3D Model — centered, transparent, no product info */}
      {visible && (
        <div
          ref={modelRef}
          className="absolute inset-0 flex items-center justify-center will-change-transform"
          style={{ opacity: 0 }}
        >
          <div className="w-full h-full">
            <Suspense fallback={null}>
              <Canvas3D modelPath={modelPath} scale={scale} />
            </Suspense>
          </div>
        </div>
      )}
    </section>
  );
}
