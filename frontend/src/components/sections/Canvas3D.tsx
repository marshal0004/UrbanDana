// /home/z/my-project/UrbanDana/frontend/src/components/sections/Canvas3D.tsx
"use client";
import { Suspense, useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

// Configure Draco decoder once
let dracoConfigured = false;
function setupDraco(loader: any) {
  if (!dracoConfigured) {
    const draco = new DRACOLoader();
    draco.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
    loader.setDRACOLoader(draco);
    dracoConfigured = true;
  }
}

function GLBModel({ path, scale }: { path: string; scale: number }) {
  const ref = useRef<any>(null);

  // Load with Draco support
  const { scene } = useGLTF(path, true, (loader) => {
    setupDraco(loader);
  });

  // Clone scene so we don't modify the cached original
  const cloned = useMemo(() => scene.clone(), [scene]);

  // Auto-rotate
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.3;
    }
  });

  return <primitive ref={ref} object={cloned} scale={scale} position={[0, 0, 0]} />;
}

// Only render when user interacts (saves CPU/GPU)
function PerformanceMonitor() {
  const { invalidate, gl } = useThree();
  useEffect(() => {
    // Pause rendering when tab is hidden
    const onHidden = () => {
      if (document.hidden) {
        gl.setAnimationLoop(null);
      } else {
        invalidate();
      }
    };
    document.addEventListener("visibilitychange", onHidden);
    return () => document.removeEventListener("visibilitychange", onHidden);
  }, [invalidate, gl]);
  return null;
}

export default function Canvas3D({ modelPath, scale = 4 }: { modelPath: string; scale?: number }) {
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
      frameloop="always"
      style={{ background: "transparent", width: "100%", height: "100%" }}
    >
      <ambientLight intensity={1.8} />
      <directionalLight position={[5, 5, 5]} intensity={2.5} />
      <directionalLight position={[-5, 3, -5]} intensity={0.6} />
      <directionalLight position={[0, -5, 0]} intensity={0.3} />

      <Suspense fallback={null}>
        <GLBModel path={modelPath} scale={scale} />
      </Suspense>

      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={3}
        maxDistance={10}
        enableDamping
        dampingFactor={0.15}
      />

      <PerformanceMonitor />
    </Canvas>
  );
}
