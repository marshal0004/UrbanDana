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

const MODELS = [
  { modelPath: "/models/cap-3d.glb", bgImage: "/images/3d-bg-1.jpg", scale: 2.4 },
  { modelPath: "/models/tshirt-3d.glb", bgImage: "/images/3d-bg-2.jpg", scale: 1.8 },
  { modelPath: "/models/cap-3d.glb", bgImage: "/images/3d-bg-3.jpg", scale: 2.4 },
  { modelPath: "/models/tshirt-3d.glb", bgImage: "/images/3d-bg-4.jpg", scale: 1.8 },
];

const CYCLE_INTERVAL = 4500;

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

  useEffect(() => {
    if (!visible) return;
    const interval = setInterval(() => {
      setModelReady(false);
      setActiveIndex((prev) => (prev + 1) % MODELS.length);
    }, CYCLE_INTERVAL);
    return () => clearInterval(interval);
  }, [visible]);

  useEffect(() => {
    MODELS.forEach((m) => {
      const img = new Image();
      img.src = m.bgImage;
    });
  }, []);

  return (
    <section ref={sectionRef} className="relative h-screen overflow-hidden bg-black">
      {/* Background */}
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

      {/* 3D Models — only 2 canvases max: ACTIVE (left) + NEXT (right) */}
      {visible && (
        <>
          {/* ACTIVE model — positioned left-center, large */}
          <div
            className="absolute top-0 bottom-0 transition-all duration-700 ease-out"
            style={{
              left: "0%",
              width: "65%",
              opacity: modelReady ? 1 : 0,
              transform: "translateX(0)",
            }}
          >
            <Suspense fallback={null}>
              <Canvas3D
                key={`active-${activeIndex}`}
                modelPath={MODELS[activeIndex].modelPath}
                scale={MODELS[activeIndex].scale}
                onReady={() => setModelReady(true)}
              />
            </Suspense>
          </div>

          {/* NEXT model — positioned right, medium size, preview */}
          <div
            className="absolute top-0 bottom-0 transition-all duration-700 ease-out"
            style={{
              right: "0%",
              width: "45%",
              opacity: 0.6,
              transform: "translateX(0)",
            }}
          >
            <Suspense fallback={null}>
              <Canvas3D
                key={`next-${(activeIndex + 1) % MODELS.length}`}
                modelPath={MODELS[(activeIndex + 1) % MODELS.length].modelPath}
                scale={MODELS[(activeIndex + 1) % MODELS.length].scale * 0.7}
              />
            </Suspense>
          </div>
        </>
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
