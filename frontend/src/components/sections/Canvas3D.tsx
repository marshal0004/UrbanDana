"use client";
import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF, Html, useProgress, ContactShadows } from "@react-three/drei";
import { MeshoptDecoder } from "meshopt-decoder";

// Loading progress bar
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

// GLB Model — loads compressed .glb with meshopt decoder
function GLBModel({ path, scale, position }: { path: string; scale: number; position: [number, number, number] }) {
  const { scene } = useGLTF(path, true, (loader) => {
    // Enable meshopt decoder for compressed models
    loader.setMeshoptDecoder(MeshoptDecoder);
  });
  return <primitive object={scene} scale={scale} position={position} />;
}

// Scene with lighting, controls, shadows
function Scene({ modelPath, scale, position }: { modelPath: string; scale: number; position: [number, number, number] }) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
      <directionalLight position={[-5, 3, -5]} intensity={0.4} />

      {/* Model */}
      <Suspense fallback={<Loader />}>
        <GLBModel path={modelPath} scale={scale} position={position} />
        <Environment preset="studio" />
      </Suspense>

      {/* Ground shadow */}
      <ContactShadows
        position={[0, -1.2, 0]}
        opacity={0.35}
        scale={10}
        blur={2.5}
        far={4}
      />

      {/* Camera controls */}
      <OrbitControls
        enablePan={false}
        minDistance={2}
        maxDistance={8}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 1.8}
        autoRotate
        autoRotateSpeed={1.5}
        enableDamping
        dampingFactor={0.05}
      />
    </>
  );
}

export default function Canvas3D({
  modelPath,
  scale = 1.5,
  position = [0, -0.5, 0] as [number, number, number],
}: {
  modelPath: string;
  scale?: number;
  position?: [number, number, number];
}) {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 0, 5], fov: 45 }}
      dpr={[1, 2]} // Performance: cap device pixel ratio
      gl={{ antialias: true, powerPreference: "high-performance" }}
      style={{ background: "linear-gradient(135deg, #f8f8f8 0%, #e8e8e8 100%)" }}
    >
      <Scene modelPath={modelPath} scale={scale} position={position} />
    </Canvas>
  );
}
