// /home/z/my-project/UrbanDana/frontend/src/components/sections/Canvas3D.tsx
"use client";
import { Suspense, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF, ContactShadows } from "@react-three/drei";
import { MeshoptDecoder } from "meshopt-decoder";

// Simple loading spinner — NO drei Html component (causes React race condition)
function LoadingSpinner() {
  return (
    <mesh>
      <boxGeometry args={[0.1, 0.1, 0.1]} />
      <meshStandardMaterial color="#cccccc" />
    </mesh>
  );
}

// GLB Model — loads compressed .glb with meshopt decoder
function GLBModel({ path, scale, position }: { path: string; scale: number; position: [number, number, number] }) {
  const { scene } = useGLTF(path, true, (loader) => {
    loader.setMeshoptDecoder(MeshoptDecoder);
  });
  return <primitive object={scene} scale={scale} position={position} />;
}

// Scene with lighting, controls, shadows
function Scene({ modelPath, scale, position }: { modelPath: string; scale: number; position: [number, number, number] }) {
  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} castShadow />
      <directionalLight position={[-5, 3, -5]} intensity={0.5} />
      <Suspense fallback={<LoadingSpinner />}>
        <GLBModel path={modelPath} scale={scale} position={position} />
        <Environment preset="studio" />
      </Suspense>
      <ContactShadows position={[0, -1.5, 0]} opacity={0.3} scale={10} blur={2.5} far={4} />
      <OrbitControls
        enablePan={false}
        minDistance={1.5}
        maxDistance={8}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 1.8}
        autoRotate
        autoRotateSpeed={2}
        enableDamping
        dampingFactor={0.05}
      />
    </>
  );
}

export default function Canvas3D({
  modelPath,
  scale = 2.5,
  position = [0, -0.5, 0] as [number, number, number],
}: {
  modelPath: string;
  scale?: number;
  position?: [number, number, number];
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  
  if (!mounted) return null;
  
  return (
    <Canvas
      shadows
      camera={{ position: [0, 0, 4], fov: 45 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      style={{ background: "linear-gradient(135deg, #f8f8f8 0%, #e8e8e8 100%)" }}
    >
      <Scene modelPath={modelPath} scale={scale} position={position} />
    </Canvas>
  );
}
