// /home/z/my-project/UrbanDana/frontend/src/components/sections/Model3DViewer.tsx
"use client";
import { useEffect, useRef, useState, lazy, Suspense } from "react";
import { RotateCw } from "lucide-react";

const Canvas3D = lazy(() => import("./Canvas3D"));

// Preload models
import { useGLTF } from "@react-three/drei";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
const draco = new DRACOLoader();
draco.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
useGLTF.preload("/models/cap-3d.glb", true, (loader: any) => loader.setDRACOLoader(draco));
useGLTF.preload("/models/tshirt-3d.glb", true, (loader: any) => loader.setDRACOLoader(draco));

// 4 models cycle: big (left) → exits, small (right) → becomes big, new → small
const MODELS = [
  { modelPath: "/models/cap-3d.glb", bgImage: "/images/3d-bg-1.jpg", scale: 2.4 },
  { modelPath: "/models/tshirt-3d.glb", bgImage: "/images/3d-bg-2.jpg", scale: 1.8 },
  { modelPath: "/models/cap-3d.glb", bgImage: "/images/3d-bg-3.jpg", scale: 2.4 },
  { modelPath: "/models/tshirt-3d.glb", bgImage: "/images/3d-bg-4.jpg", scale: 1.8 },
];

const CYCLE_INTERVAL = 5000; // 5 seconds per model

export default function Model3DViewer() {
  const [currentIndex, setCurrentIndex] = useState(0); // big (left)
  const [nextIndex, setNextIndex] = useState(1); // small (right)
  const [transitioning, setTransitioning] = useState(false);
  const [visible, setVisible] = useState(false);
  const [modelReady, setModelReady] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Only mount when section enters viewport
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

  // Auto-cycle: every 5 seconds, advance to next model
  useEffect(() => {
    if (!visible) return;
    const interval = setInterval(() => {
      setTransitioning(true);
      setModelReady(false);

      // After transition animation (800ms), swap indices
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % MODELS.length);
        setNextIndex((prev) => (prev + 1) % MODELS.length);
        setTransitioning(false);
      }, 800);
    }, CYCLE_INTERVAL);

    return () => clearInterval(interval);
  }, [visible]);

  // Preload background images
  useEffect(() => {
    MODELS.forEach((m) => {
      const img = new Image();
      img.src = m.bgImage;
    });
  }, []);

  const currentModel = MODELS[currentIndex];
  const nextModel = MODELS[nextIndex];

  return (
    <section ref={sectionRef} className="relative h-screen overflow-hidden bg-black">
      {/* Background — changes with current model */}
      <div
        className="absolute inset-0 transition-all duration-700"
        style={{
          backgroundImage: `url(${currentModel.bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: transitioning ? 0.5 : 1,
        }}
      />

      {/* Dark gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 35% 50%, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.7) 100%)",
        }}
      />

      {/* 3D Models — 2 at a time: BIG left, SMALL right */}
      {visible && (
        <div className="absolute inset-0 flex items-center">
          {/* LEFT: Big focused model */}
          <div
            className="flex-1 flex items-center justify-center transition-all duration-700 ease-out"
            style={{
              opacity: transitioning ? 0 : 1,
              transform: transitioning ? "translateX(-30%) scale(0.7)" : "translateX(0) scale(1)",
            }}
          >
            <div className="w-full h-full">
              <Suspense fallback={null}>
                <Canvas3D
                  key={`big-${currentIndex}`}
                  modelPath={currentModel.modelPath}
                  scale={currentModel.scale}
                  onReady={() => setModelReady(true)}
                />
              </Suspense>
            </div>
          </div>

          {/* RIGHT: Small preview model */}
          <div
            className="w-[25%] md:w-[20%] shrink-0 flex items-center justify-center transition-all duration-700 ease-out"
            style={{
              opacity: transitioning ? 0 : 0.5,
              transform: transitioning ? "translateX(50%) scale(0.3)" : "translateX(0) scale(1)",
            }}
          >
            <div className="w-full h-full">
              <Suspense fallback={null}>
                <Canvas3D
                  key={`small-${nextIndex}`}
                  modelPath={nextModel.modelPath}
                  scale={nextModel.scale * 0.5}
                />
              </Suspense>
            </div>
          </div>
        </div>
      )}

      {/* Rotating loader — shows while big model loads */}
      {visible && !modelReady && !transitioning && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
          <div className="relative w-12 h-12 mb-3">
            <div className="absolute inset-0 rounded-full border-4 border-white/15" />
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-brand-red animate-spin" />
          </div>
          <p className="text-xs uppercase tracking-widest text-white/50 font-semibold">
            Loading 3D…
          </p>
        </div>
      )}

      {/* Progress dots — bottom center */}
      <div className="absolute bottom-8 inset-x-0 flex justify-center gap-2 z-20">
        {MODELS.map((_, i) => (
          <div
            key={i}
            className="h-1.5 rounded-full transition-all duration-500"
            style={{
              width: i === currentIndex ? "32px" : "8px",
              backgroundColor: i === currentIndex ? "#c8102e" : "rgba(255,255,255,0.25)",
            }}
          />
        ))}
      </div>
    </section>
  );
}
