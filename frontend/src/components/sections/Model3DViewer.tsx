"use client";
import { Suspense, useState, lazy } from "react";
import { cn } from "@/lib/utils";
import { Box, Eye, RotateCw } from "lucide-react";

// Lazy-load the 3D Canvas only when needed (performance optimization)
const Canvas3D = lazy(() => import("./Canvas3D"));

// 3D model configs
const MODELS = [
  {
    id: "cap-1",
    type: "cap",
    title: "Urbandana Cap",
    desc: "Rotate, zoom, and explore in 3D",
    icon: Box,
    accent: "#c8102e",
    modelPath: "/models/cap.glb", // YOUR REAL 3D MODEL
    scale: 1.8,
    position: [0, -0.8, 0] as [number, number, number],
  },
  {
    id: "cap-2",
    type: "cap",
    title: "Classic Cap (Side View)",
    desc: "Full 360° view — every angle, every detail",
    icon: Box,
    accent: "#10b981",
    modelPath: "/models/cap.glb", // Same model, different rotation
    scale: 1.8,
    position: [0, -0.8, 0] as [number, number, number],
  },
  {
    id: "tshirt-1",
    type: "tshirt",
    title: "T-Shirt Preview",
    desc: "See the fit, the fabric, the drape — in 3D",
    icon: Box,
    accent: "#d4a017",
    modelPath: "/models/cap.glb", // Placeholder until t-shirt .glb is ready
    scale: 1.8,
    position: [0, -0.8, 0] as [number, number, number],
  },
  {
    id: "tshirt-2",
    type: "tshirt",
    title: "T-Shirt Detail View",
    desc: "Interactive 3D — drag to rotate, scroll to zoom",
    icon: Box,
    accent: "#a855f7",
    modelPath: "/models/cap.glb", // Placeholder until t-shirt .glb is ready
    scale: 1.8,
    position: [0, -0.8, 0] as [number, number, number],
  },
];

export default function Model3DViewer() {
  const [activeModel, setActiveModel] = useState(0);
  const [show3D, setShow3D] = useState(false); // Load 3D only when user clicks
  const model = MODELS[activeModel];

  return (
    <section className="py-12 bg-white">
      <div className="mx-auto" style={{ maxWidth: "100%", padding: "0 12px" }}>
        {/* Header */}
        <div className="mb-6 px-2">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-brand-red/10 flex items-center justify-center">
              <Eye className="w-5 h-5 text-brand-red" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-brand-red font-semibold">
                Interactive 3D
              </p>
              <h2 className="text-2xl md:text-4xl font-black tracking-tight text-brand-black">
                View Products in 3D
              </h2>
            </div>
          </div>
          <p className="text-brand-black/60 text-sm max-w-2xl">
            Drag to rotate · Scroll to zoom · Click to interact — experience every angle of our caps and t-shirts before you buy.
          </p>
        </div>

        {/* Model selector tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-5 px-2">
          {MODELS.map((m, i) => (
            <button
              key={m.id}
              onClick={() => {
                setActiveModel(i);
                setShow3D(false); // Reset when switching models
              }}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-full text-xs uppercase tracking-widest font-semibold border-2 transition whitespace-nowrap",
                activeModel === i
                  ? "bg-brand-red text-paper border-brand-red"
                  : "bg-white text-brand-black/70 border-brand-black/10 hover:border-brand-red"
              )}
            >
              <m.icon className="w-3.5 h-3.5" />
              {m.title}
            </button>
          ))}
        </div>

        {/* 3D Viewer — lazy loaded for performance */}
        <div className="relative rounded-2xl overflow-hidden border-2 border-brand-black/10 shadow-lg" style={{ height: "500px", background: "linear-gradient(135deg, #f8f8f8 0%, #e8e8e8 100%)" }}>
          {show3D ? (
            // REAL 3D MODEL — React Three Fiber (lazy loaded)
            <Suspense
              fallback={
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                  <div className="relative w-12 h-12 mb-4">
                    <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-brand-red animate-spin"></div>
                  </div>
                  <p className="text-xs uppercase tracking-widest text-brand-black/50 font-semibold flex items-center gap-2">
                    <RotateCw className="w-3 h-3 animate-spin" />
                    Loading 3D model…
                  </p>
                </div>
              }
            >
              <Canvas3D
                key={model.id}
                modelPath={model.modelPath}
                scale={model.scale}
                position={model.position}
              />
            </Suspense>
          ) : (
            // Click-to-load prompt (performance: don't load 3D until user wants it)
            <button
              onClick={() => setShow3D(true)}
              className="absolute inset-0 flex flex-col items-center justify-center gap-4 group cursor-pointer"
            >
              <div className="w-20 h-20 rounded-full bg-brand-red/10 group-hover:bg-brand-red/20 flex items-center justify-center transition">
                <Box className="w-10 h-10 text-brand-red" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold uppercase tracking-widest text-brand-black">
                  Click to view in 3D
                </p>
                <p className="text-xs text-brand-black/50 mt-1">
                  {model.title} · Interactive 3D model
                </p>
              </div>
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-brand-black/40">
                <RotateCw className="w-3 h-3" />
                <span>Drag to rotate · Scroll to zoom</span>
              </div>
            </button>
          )}

          {/* Model info badge — bottom left */}
          <div className="absolute bottom-4 left-4 bg-brand-black/80 backdrop-blur-md rounded-xl px-4 py-2.5 z-20 pointer-events-none">
            <div className="flex items-center gap-2 mb-0.5">
              <model.icon className="w-3.5 h-3.5" style={{ color: model.accent }} />
              <p className="text-sm font-bold text-paper">{model.title}</p>
            </div>
            <p className="text-[10px] text-paper/60">{model.desc}</p>
          </div>

          {/* 3D badge — top right */}
          <div className="absolute top-4 right-4 bg-brand-red rounded-full px-3 py-1 z-20 pointer-events-none">
            <p className="text-[10px] font-bold uppercase tracking-widest text-paper flex items-center gap-1">
              <Box className="w-3 h-3" />
              3D
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-6 px-2">
          <div className="flex items-center gap-2 text-xs text-brand-black/50">
            <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
              <RotateCw className="w-3 h-3" />
            </span>
            <span className="uppercase tracking-widest font-semibold">Drag to rotate</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-brand-black/50">
            <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px]">
              🔍
            </span>
            <span className="uppercase tracking-widest font-semibold">Scroll to zoom</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-brand-black/50">
            <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px]">
              👆
            </span>
            <span className="uppercase tracking-widest font-semibold">Auto-rotates</span>
          </div>
        </div>
      </div>
    </section>
  );
}
