// /home/z/my-project/UrbanDana/frontend/src/components/sections/Model3DViewer.tsx
"use client";
import { Suspense, lazy, useState } from "react";
import { cn } from "@/lib/utils";
import { Box, Eye, RotateCw } from "lucide-react";

const Canvas3D = lazy(() => import("./Canvas3D"));

// 2 models shown side by side: 1 cap + 1 t-shirt
const MODELS = [
  {
    id: "cap",
    title: "Urbandana Cap",
    desc: "Rotate · Zoom · Explore",
    modelPath: "/models/cap.glb",
    scale: 2.5,
    position: [0, -0.5, 0] as [number, number, number],
  },
  {
    id: "tshirt",
    title: "Urbandana T-Shirt",
    desc: "Rotate · Zoom · Explore",
    modelPath: "/models/tshirt.glb",
    scale: 2.0,
    position: [0, -0.8, 0] as [number, number, number],
  },
];

export default function Model3DViewer() {
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
        </div>

        {/* 2 models side by side */}
        <div className="grid md:grid-cols-2 gap-4">
          {MODELS.map((model) => (
            <div key={model.id}>
              {/* 3D Viewer */}
              <div
                className="relative rounded-2xl overflow-hidden border-2 border-brand-black/10 shadow-lg"
                style={{ height: "450px", background: "linear-gradient(135deg, #f8f8f8 0%, #e8e8e8 100%)" }}
              >
                <Suspense
                  fallback={
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                      <div className="relative w-12 h-12 mb-4">
                        <div className="absolute inset-0 rounded-full border-4 border-gray-200" />
                        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-brand-red animate-spin" />
                      </div>
                      <p className="text-xs uppercase tracking-widest text-brand-black/50 font-semibold flex items-center gap-2">
                        <RotateCw className="w-3 h-3 animate-spin" />
                        Loading 3D…
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

                {/* Model info badge — bottom left */}
                <div className="absolute bottom-3 left-3 bg-brand-black/80 backdrop-blur-md rounded-xl px-3 py-2 z-20 pointer-events-none">
                  <p className="text-sm font-bold text-paper">{model.title}</p>
                  <p className="text-[10px] text-paper/60">{model.desc}</p>
                </div>

                {/* 3D badge — top right */}
                <div className="absolute top-3 right-3 bg-brand-red rounded-full px-2.5 py-1 z-20 pointer-events-none">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-paper flex items-center gap-1">
                    <Box className="w-3 h-3" />
                    3D
                  </p>
                </div>
              </div>
            </div>
          ))}
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
            <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px]">🔍</span>
            <span className="uppercase tracking-widest font-semibold">Scroll to zoom</span>
          </div>
        </div>
      </div>
    </section>
  );
}
