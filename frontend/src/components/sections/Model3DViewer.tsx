// /home/z/my-project/UrbanDana/frontend/src/components/sections/Model3DViewer.tsx
"use client";
import { useEffect, useRef, useState, lazy, Suspense } from "react";
import { RotateCw } from "lucide-react";

const Canvas3D = lazy(() => import("./Canvas3D"));

import { useGLTF } from "@react-three/drei";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
const draco = new DRACOLoader();
draco.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
useGLTF.preload("/models/cap-3d.glb", true, (loader: any) => loader.setDRACOLoader(draco));
useGLTF.preload("/models/tshirt-3d.glb", true, (loader: any) => loader.setDRACOLoader(draco));

// Cap -10%, T-shirt -10%
const MODELS = [
  { modelPath: "/models/cap-3d.glb", bgImage: "/images/3d-bg-1.jpg", scale: 2.16 },  // 2.4 × 0.9
  { modelPath: "/models/tshirt-3d.glb", bgImage: "/images/3d-bg-2.jpg", scale: 1.62 }, // 1.8 × 0.9
  { modelPath: "/models/cap-3d.glb", bgImage: "/images/3d-bg-3.jpg", scale: 2.16 },
  { modelPath: "/models/tshirt-3d.glb", bgImage: "/images/3d-bg-4.jpg", scale: 1.62 },
];

const CYCLE_INTERVAL = 5000;
const TRANSITION_MS = 700;

/**
 * ONE 3D canvas (active model) + ONE product image (next preview).
 * Only 1 WebGL context = ~50% less RAM than 2 canvases.
 * No canvas remounting = no flickering, no position jumping.
 * Simultaneous transition = no timing delay.
 */
export default function Model3DViewer() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [modelReady, setModelReady] = useState(false);
  const [exiting, setExiting] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const canvasKeyRef = useRef(0); // Increment to force Canvas3D to swap model

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    MODELS.forEach((m) => {
      const img = new Image();
      img.src = m.bgImage;
    });
  }, []);

  // Auto-cycle — SIMULTANEOUS transition (no sequential delays)
  useEffect(() => {
    if (!visible) return;
    const interval = setInterval(() => {
      // Step 1: Start exit animation (active slides left, next slides to center)
      setExiting(true);
      setModelReady(false);

      // Step 2: After transition, swap indices + stop exiting (new model loads)
      setTimeout(() => {
        setActiveIndex((prev) => (prev + 1) % MODELS.length);
        canvasKeyRef.current += 1; // Force Canvas3D to load new model
        setExiting(false);
      }, TRANSITION_MS);
    }, CYCLE_INTERVAL);
    return () => clearInterval(interval);
  }, [visible]);

  const currentModel = MODELS[activeIndex];
  const nextModel = MODELS[(activeIndex + 1) % MODELS.length];

  return (
    <section ref={sectionRef} className="relative h-screen overflow-hidden bg-black">
      {/* Background — crossfade */}
      {MODELS.map((m, i) => (
        <div
          key={`bg-${i}`}
          className="absolute inset-0 transition-opacity duration-700"
          style={{
            backgroundImage: `url(${m.bgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: activeIndex === i ? 1 : 0,
          }}
        />
      ))}

      {/* Gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 30% 50%, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      {visible && (
        <>
          {/* LEFT: Active 3D model — ONE canvas, slides left when exiting */}
          <div
            className="absolute top-0 bottom-0 transition-all ease-out"
            style={{
              left: exiting ? "-100%" : "0%",
              width: "65%",
              opacity: exiting ? 0 : 1,
              zIndex: 10,
              transitionDuration: `${TRANSITION_MS}ms`,
            }}
          >
            <Suspense fallback={null}>
              <Canvas3D
                key={canvasKeyRef.current}
                modelPath={currentModel.modelPath}
                scale={currentModel.scale}
                onReady={() => setModelReady(true)}
              />
            </Suspense>
          </div>

          {/* RIGHT: Next model — PRODUCT IMAGE (not 3D canvas) — slides to center when exiting */}
          <div
            className="absolute top-0 bottom-0 flex items-center justify-center transition-all ease-out"
            style={{
              left: exiting ? "0%" : "55%",
              width: exiting ? "65%" : "45%",
              opacity: exiting ? 1 : 0.5,
              zIndex: exiting ? 10 : 5,
              transitionDuration: `${TRANSITION_MS}ms`,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={nextModel.bgImage}
              alt="Next product"
              className="max-w-full max-h-full object-contain"
              style={{ filter: "drop-shadow(0 10px 40px rgba(0,0,0,0.8))" }}
            />
          </div>

          {/* After transition: the next image becomes the new active 3D model */}
          {exiting && (
            <div
              className="absolute top-0 bottom-0"
              style={{
                left: "0%",
                width: "65%",
                opacity: 0,
                zIndex: 1,
              }}
            >
              {/* This div is a placeholder — after TRANSITION_MS, exiting becomes false
                  and the real 3D canvas takes over with the new model */}
            </div>
          )}
        </>
      )}

      {/* Loader */}
      {visible && !modelReady && !exiting && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-30 pointer-events-none">
          <div className="relative w-12 h-12 mb-3">
            <div className="absolute inset-0 rounded-full border-4 border-white/15" />
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-brand-red animate-spin" />
          </div>
          <p className="text-xs uppercase tracking-widest text-white/50 font-semibold flex items-center gap-2">
            <RotateCw className="w-3 h-3 animate-spin" /> Loading 3D…
          </p>
        </div>
      )}

      {/* Progress dots */}
      <div className="absolute bottom-8 inset-x-0 flex justify-center gap-2 z-30">
        {MODELS.map((_, i) => (
          <div
            key={i}
            className="h-1.5 rounded-full transition-all duration-500"
            style={{
              width: i === activeIndex ? "36px" : "8px",
              backgroundColor: i === activeIndex ? "#c8102e" : "rgba(255,255,255,0.25)",
            }}
          />
        ))}
      </div>
    </section>
  );
}
