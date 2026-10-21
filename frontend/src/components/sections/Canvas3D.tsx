// /home/z/my-project/UrbanDana/frontend/src/components/sections/Canvas3D.tsx
"use client";
import { Suspense, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { MeshoptDecoder } from "meshopt-decoder";

function GLBModel({ path }: { path: string }) {
  const ref = useRef<any>(null);
  const { scene } = useGLTF(path, true, (loader) => {
    loader.setMeshoptDecoder(MeshoptDecoder);
  });

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.4;
    }
  });

  return <primitive ref={ref} object={scene} scale={3} position={[0, 0, 0]} />;
}

export default function Canvas3D({ modelPath }: { modelPath: string }) {
  return (
    <Canvas
      shadows={false}
      camera={{ position: [0, 0, 5], fov: 45 }}
      dpr={[1, 1]}
      gl={{
        antialias: false,
        alpha: true,
        powerPreference: "high-performance",
      }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 5, 5]} intensity={2} />
      <directionalLight position={[-5, 3, -5]} intensity={0.5} />
      <directionalLight position={[0, -5, 0]} intensity={0.3} />

      <Suspense fallback={null}>
        <GLBModel path={modelPath} />
      </Suspense>

      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={2}
        maxDistance={8}
        enableDamping
        dampingFactor={0.1}
      />
    </Canvas>
  );
}
