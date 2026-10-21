// /home/z/project/UrbanDana/frontend/src/components/sections/Model3DViewer.tsx
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

// 4 models — spotlight carousel with 3D perspective transforms
const MODELS = [
  { modelPath: "/models/cap-3d.glb", bgImage: "/images/3d-bg-1.jpg", scale: 2.4 },
  { modelPath: "/models/tshirt-3d.glb", bgImage: "/images/3d-bg-2.jpg", scale: 1.8 },
  { modelPath: "/models/cap-3d.glb", bgImage: "/images/3d-bg-3.jpg", scale: 2.4 },
  { modelPath: "/models/tshirt-3d.glb", bgImage: "/images/3d-bg-4.jpg", scale: 1.8 },
];

const CYCLE_INTERVAL = 4500;

// Position config for each card relative to active index
// offset 0 = active (center, big), 1 = next (right, small), -1 = prev (left, small)
function getCardStyle(offset: number) {
  if (offset === 0) {
    // ACTIVE — center, full size, no rotation
    return {
      transform: "translateX(0) scale(1) rotateY(0deg)",
      opacity: 1,
      zIndex: 10,
      width: "60%",
      left: "20%",
    };
  }
  if (offset === 1) {
    // NEXT — right side, smaller, angled
    return {
      transform: "translateX(120%) scale(0.5) rotateY(-25deg)",
      opacity: 0.5,
      zIndex: 5,
      width: "40%",
      left: "30%",
    };
  }
  if (offset === -1) {
    // PREV — left side, smaller, angled (exiting)
    return {
      transform: "translateX(-120%) scale(0.5) rotateY(25deg)",
      opacity: 0,
      zIndex: 1,
      width: "40%",
      left: "30%",
    };
  }
  // Hidden
  return {
    transform: "translateX(200%) scale(0.3) rotateY(0deg)",
    opacity: 0,
    zIndex: 0,
    width: "40%",
    left: "30%",
  };
}

export default function Model3DViewer() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [modelReady, setModelReady] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

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

  // Auto-cycle
  useEffect(() => {
    if (!visible) return;
    const interval = setInterval(() => {
      setModelReady(false);
      setActiveIndex((prev) => (prev + 1) % MODELS.length);
    }, CYCLE_INTERVAL);
    return () => clearInterval(interval);
  }, [visible]);

  // Preload backgrounds
  useEffect(() => {
    MODELS.forEach((m) => {
      const img = new Image();
      img.src = m.bgImage;
    });
  }, []);

  return (
    <section ref={sectionRef} className="relative h-screen overflow-hidden bg-black">
      {/* Background — crossfade with current model */}
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

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.65) 100%)",
        }}
      />

      {/* 3D Perspective container */}
      {visible && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ perspective: "1200px", transformStyle: "preserve-3d" }}
        >
          {MODELS.map((model, i) => {
            // Calculate offset from active index
            let offset = i - activeIndex;
            // Handle wrap-around (e.g., active=3, i=0 → offset=1)
            if (offset > 2) offset -= MODELS.length;
            if (offset < -2) offset += MODELS.length;

            const style = getCardStyle(offset);
            const isActive = offset === 0;

            return (
              <div
                key={i}
                className="absolute h-[80vh] transition-all duration-700 ease-out"
                style={{
                  ...style,
                  transformStyle: "preserve-3d",
                }}
              >
                <Suspense fallback={null}>
                  <Canvas3D
                    key={`model-${i}-${isActive ? "active" : "inactive"}`}
                    modelPath={model.modelPath}
                    scale={isActive ? model.scale : model.scale * 0.6}
                    onReady={isActive ? () => setModelReady(true) : undefined}
                  />
                </Suspense>
              </div>
            );
          })}
        </div>
      )}

      {/* Loader */}
      {visible && !modelReady && (
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
