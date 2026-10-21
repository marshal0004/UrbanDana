// /home/z/my-project/UrbanDana/frontend/src/components/sections/Model3DViewer.tsx
"use client";
import { useEffect, useRef, useState, lazy, Suspense } from "react";
import { RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";

const Canvas3D = lazy(() => import("./Canvas3D"));

// Preload models
import { useGLTF } from "@react-three/drei";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
const draco = new DRACOLoader();
draco.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
// Only preload the FIRST model — others load on demand when selected
// Preloading all 4 = 49MB in GPU memory = 2.8GB RAM. Preloading 1 = ~700MB.
useGLTF.preload("/models/cap-3d.glb", true, (loader: any) => loader.setDRACOLoader(draco));

// 4 models — each matches its background image
// Section 1: earth-tone cap → cap-3d.glb (original cap)
// Section 2: paisley t-shirt → tshirt-3d-v2.glb (new t-shirt1.glb)
// Section 3: olive leaf cap → cap-3d-v2.glb (new cap (1).glb)
// Section 4: tribal t-shirt → tshirt-3d.glb (original t-shirt)
const MODELS = [
  { modelPath: "/models/cap-3d.glb", bgImage: "/images/3d-bg-1.jpg", scale: 2.16, label: "Cap 1" },
  { modelPath: "/models/tshirt-3d-v2.glb", bgImage: "/images/3d-bg-2.jpg", scale: 1.62, label: "T-Shirt 1" },
  { modelPath: "/models/cap-3d-v2.glb", bgImage: "/images/3d-bg-3.jpg", scale: 2.16, label: "Cap 2" },
  { modelPath: "/models/tshirt-3d.glb", bgImage: "/images/3d-bg-4.jpg", scale: 1.62, label: "T-Shirt 2" },
];

const AUTO_CHANGE_MS = 3000; // Auto-change every 3 seconds

export default function Model3DViewer() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [modelReady, setModelReady] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Only mount when section enters viewport
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Auto-change every 3 seconds
  useEffect(() => {
    if (!visible) return;
    const interval = setInterval(() => {
      setModelReady(false);
      setActiveIndex((prev) => (prev + 1) % MODELS.length);
    }, AUTO_CHANGE_MS);
    return () => clearInterval(interval);
  }, [visible]);

  // Preload background images
  useEffect(() => {
    MODELS.forEach((m) => {
      const img = new Image();
      img.src = m.bgImage;
    });
  }, []);

  // Manual click handler
  function changeModel(index: number) {
    setModelReady(false);
    setActiveIndex(index);
  }

  const currentModel = MODELS[activeIndex];

  return (
    <section ref={sectionRef} className="relative h-screen overflow-hidden bg-black">
      {/* Background — crossfade */}
      {MODELS.map((m, i) => (
        <div
          key={`bg-${i}`}
          className="absolute inset-0 transition-opacity duration-500"
          style={{
            backgroundImage: `url(${m.bgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: activeIndex === i ? 1 : 0,
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

      {/* SINGLE 3D Canvas — full screen, centered, transparent */}
      {visible && (
        <div className="absolute inset-0 z-10">
          <Suspense fallback={null}>
            <Canvas3D
              key={activeIndex}
              modelPath={currentModel.modelPath}
              scale={currentModel.scale}
              onReady={() => setModelReady(true)}
            />
          </Suspense>
        </div>
      )}

      {/* Rotating loader */}
      {visible && !modelReady && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
          <div className="relative w-12 h-12 mb-3">
            <div className="absolute inset-0 rounded-full border-4 border-white/15" />
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-brand-red animate-spin" />
          </div>
          <p className="text-xs uppercase tracking-widest text-white/50 font-semibold flex items-center gap-2">
            <RotateCw className="w-3 h-3 animate-spin" /> Loading 3D…
          </p>
        </div>
      )}

      {/* Horizontal scrollbar — 4 clickable segments at bottom */}
      <div className="absolute bottom-8 inset-x-0 flex justify-center gap-3 z-30 px-4">
        {MODELS.map((m, i) => (
          <button
            key={i}
            onClick={() => changeModel(i)}
            className="group relative"
            aria-label={`View ${m.label}`}
          >
            {/* Progress bar fill */}
            <div
              className="h-1.5 rounded-full transition-all duration-300 overflow-hidden"
              style={{
                width: activeIndex === i ? "60px" : "32px",
                backgroundColor: "rgba(255,255,255,0.2)",
              }}
            >
              {/* Active fill — animated */}
              {activeIndex === i && (
                <div
                  className="h-full rounded-full"
                  style={{
                    backgroundColor: "#c8102e",
                    animation: `progressFill ${AUTO_CHANGE_MS}ms linear forwards`,
                  }}
                />
              )}
              {/* Inactive but already passed — show as filled */}
              {activeIndex !== i && false && (
                <div className="h-full w-full rounded-full bg-brand-red/40" />
              )}
            </div>
            {/* Label on hover */}
            <span
              className={cn(
                "absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-widest font-bold whitespace-nowrap transition-opacity",
                activeIndex === i ? "opacity-100 text-white" : "opacity-0 group-hover:opacity-60 text-white/60"
              )}
            >
              {m.label}
            </span>
          </button>
        ))}
      </div>

      {/* Animation keyframe for progress fill */}
      <style>{`
        @keyframes progressFill {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </section>
  );
}
