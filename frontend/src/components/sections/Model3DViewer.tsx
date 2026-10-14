"use client";
import { Suspense, useState, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF, Html, useProgress, ContactShadows } from "@react-three/drei";
import { cn } from "@/lib/utils";
import { Box, Shirt, Eye, RotateCw, Loader2 } from "lucide-react";

// 3D model configs — update modelPath when you have real .glb files
// For now, uses Sketchfab embed as fallback
const MODELS = [
  {
    id: "cap-1",
    type: "cap",
    title: "Signature Red Cap",
    desc: "Rotate, zoom, and explore in 3D",
    icon: Box,
    accent: "#c8102e",
    // When you have a .glb file, set this to "/models/cap-red.glb"
    modelPath: null, // null = use Sketchfab fallback
    sketchfabId: "4be69025b34e428983922136b4fb2e84",
  },
  {
    id: "cap-2",
    type: "cap",
    title: "Classic Baseball Cap",
    desc: "Full 360° view — every angle, every detail",
    icon: Box,
    accent: "#10b981",
    modelPath: null,
    sketchfabId: "1c1d34d73fd94e6b9e8f82b1eb7194a0",
  },
  {
    id: "tshirt-1",
    type: "tshirt",
    title: "Oversized T-Shirt",
    desc: "See the fit, the fabric, the drape — in 3D",
    icon: Shirt,
    accent: "#d4a017",
    modelPath: null,
    sketchfabId: "c1a3e5eb9b5445f4b7d4be82f1127eba",
  },
  {
    id: "tshirt-2",
    type: "tshirt",
    title: "Classic Fit T-Shirt",
    desc: "Interactive 3D — drag to rotate, scroll to zoom",
    icon: Shirt,
    accent: "#a855f7",
    modelPath: null,
    sketchfabId: "3e4b13a502884acfbd79cee0f9cd8876",
  },
];

// Loading progress bar for 3D model
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-brand-red animate-spin"></div>
        </div>
        <p className="text-xs uppercase tracking-widest text-brand-black/50 font-semibold">
          Loading 3D… {progress.toFixed(0)}%
        </p>
      </div>
    </Html>
  );
}

// GLB Model component — loads .glb file
function GLBModel({ path }: { path: string }) {
  const { scene } = useGLTF(path);
  return <primitive object={scene} scale={1.5} position={[0, -0.5, 0]} />;
}

// Scene wrapper with lighting + controls
function Scene({ modelPath }: { modelPath: string }) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
      <directionalLight position={[-5, 3, -5]} intensity={0.3} />

      {/* Model */}
      <Suspense fallback={<Loader />}>
        <GLBModel path={modelPath} />
        <Environment preset="studio" />
      </Suspense>

      {/* Shadow */}
      <ContactShadows
        position={[0, -1.2, 0]}
        opacity={0.4}
        scale={10}
        blur={2}
        far={4}
      />

      {/* Camera controls — rotate, zoom */}
      <OrbitControls
        enablePan={false}
        minDistance={2}
        maxDistance={8}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 1.8}
        autoRotate
        autoRotateSpeed={1}
      />
    </>
  );
}

export default function Model3DViewer() {
  const [activeModel, setActiveModel] = useState(0);
  const [sketchfabLoaded, setSketchfabLoaded] = useState(false);
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
                setSketchfabLoaded(false);
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

        {/* 3D Viewer */}
        <div className="relative rounded-2xl overflow-hidden border-2 border-brand-black/10 shadow-lg" style={{ height: "500px" }}>
          {model.modelPath ? (
            // REAL 3D MODEL — React Three Fiber (when .glb file is available)
            <Canvas
              shadows
              camera={{ position: [0, 0, 5], fov: 45 }}
              style={{ background: "linear-gradient(135deg, #f8f8f8 0%, #e8e8e8 100%)" }}
            >
              <Scene modelPath={model.modelPath} />
            </Canvas>
          ) : (
            // FALLBACK — Sketchfab embed (placeholder until .glb files are ready)
            <>
              {!sketchfabLoaded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 z-10">
                  <div className="relative w-12 h-12 mb-4">
                    <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-brand-red animate-spin"></div>
                  </div>
                  <p className="text-xs uppercase tracking-widest text-brand-black/50 font-semibold flex items-center gap-2">
                    <RotateCw className="w-3 h-3 animate-spin" />
                    Loading 3D model…
                  </p>
                </div>
              )}
              <iframe
                key={model.sketchfabId}
                src={`https://sketchfab.com/models/${model.sketchfabId}/embed?autospin=1&autostart=1&ui_infos=1&ui_settings=1&ui_watermark=0&ui_annotations=0&ui_hint=0&ui_help=0&ui_inspector=0&ui_stop=0&ui_vr=0&preload=1`}
                className="w-full h-full"
                style={{ border: "none" }}
                allow="autoplay; fullscreen; xr-spatial-tracking"
                allowFullScreen
                title={model.title}
                onLoad={() => setSketchfabLoaded(true)}
              />
            </>
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

        {/* Note */}
        <div className="mt-6 text-center px-2">
          <p className="text-[11px] text-brand-black/40 italic">
            3D models shown are placeholders. Custom models of our actual products coming soon.
          </p>
        </div>
      </div>
    </section>
  );
}
