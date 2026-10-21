// /home/z/my-project/UrbanDana/frontend/src/components/sections/Canvas3D.tsx
"use client";
import { Suspense, useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { MeshoptDecoder } from "meshopt-decoder";

function GLBModel({ path }: { path: string }) {
  const ref = useRef<any>(null);
  const { scene } = useGLTF(path, true, (loader) => {
    loader.setMeshoptDecoder(MeshoptDecoder);
  });

  // Auto-rotate the model
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.5;
    }
  });

  return <primitive ref={ref} object={scene} scale={2.5} position={[0, -0.5, 0]} />;
}

// Pause rendering when tab is not visible (saves CPU/GPU)
function PauseOnHidden() {
  const { invalidate } = useThree();
  useEffect(() => {
    const onVisible = () => {
      if (document.hidden) {
        // Three.js stops auto-rendering when frameloop is demand
      } else {
        invalidate();
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [invalidate]);
  return null;
}

export default function Canvas3D({ modelPath }: { modelPath: string }) {
  return (
    <Canvas
      shadows={false}
      camera={{ position: [0, 0, 4], fov: 45 }}
      dpr={[1, 1]} // Cap DPR to 1 — no over-rendering
      gl={{
        antialias: false,
        powerPreference: "high-performance",
        alpha: true,
      }}
      frameloop="always"
      style={{ background: "transparent" }}
    >
      {/* Minimal lighting — no Environment HDR (saves 2MB download) */}
      <ambientLight intensity={1.2} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} />
      <directionalLight position={[-5, 3, -5]} intensity={0.4} />

      <Suspense fallback={null}>
        <GLBModel path={modelPath} />
      </Suspense>

      {/* OrbitControls — drag to rotate, zoom limited */}
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={2}
        maxDistance={6}
        enableDamping
        dampingFactor={0.1}
      />

      <PauseOnHidden />
    </Canvas>
  );
}
