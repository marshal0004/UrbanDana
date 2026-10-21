// /home/z/my-project/UrbanDana/frontend/src/components/sections/Canvas3D.tsx
"use client";
import { Suspense, useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

let dracoConfigured = false;
function setupDraco(loader: any) {
  if (!dracoConfigured) {
    const draco = new DRACOLoader();
    draco.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
    loader.setDRACOLoader(draco);
    dracoConfigured = true;
  }
}

function GLBModel({ path, scale, onReady }: { path: string; scale: number; onReady?: () => void }) {
  const ref = useRef<any>(null);
  const { scene } = useGLTF(path, true, (loader) => setupDraco(loader));
  const cloned = useMemo(() => scene.clone(), [scene]);

  // Dispose model when unmounted — frees GPU memory
  useEffect(() => {
    return () => {
      // Clear the cached GLTF to free memory
      useGLTF.clear(path);
    };
  }, [path]);

  useEffect(() => {
    if (onReady) onReady();
  }, [onReady]);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.3;
    }
  });

  return <primitive ref={ref} object={cloned} scale={scale} position={[0, 0, 0]} />;
}

export default function Canvas3D({
  modelPath,
  scale = 4,
  onReady,
}: {
  modelPath: string;
  scale?: number;
  onReady?: () => void;
}) {
  return (
    <Canvas
      shadows={false}
      camera={{ position: [0, 0, 6], fov: 40 }}
      dpr={[1, 1]}
      gl={{
        antialias: false,
        alpha: true,
        powerPreference: "high-performance",
        stencil: false,
        depth: true,
        preserveDrawingBuffer: false,
      }}
      style={{ background: "transparent", width: "100%", height: "100%" }}
    >
      <ambientLight intensity={1.8} />
      <directionalLight position={[5, 5, 5]} intensity={2.5} />
      <directionalLight position={[-5, 3, -5]} intensity={0.6} />

      <Suspense fallback={null}>
        <GLBModel path={modelPath} scale={scale} onReady={onReady} />
      </Suspense>

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        enableDamping
        dampingFactor={0.15}
      />
    </Canvas>
  );
}
