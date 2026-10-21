// /home/z/my-project/UrbanDana/frontend/src/components/sections/Model3DViewer.tsx
"use client";
import { useEffect, useRef, useState, lazy, Suspense } from "react";
import { RotateCw } from "lucide-react";

const Canvas3D = lazy(() => import("./Canvas3D"));

import { useGLTF } from "@react-three/drei";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
const draco = new DRACOLoader();
draco.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
useGLTF.preload("/models/cap-3d.glb", true, (loader: any) => loader.setDRACOLoader(draco));
useGLTF.preload("/models/tshirt-3d.glb", true, (loader: any) => loader.setDRACOLoader(draco));

const MODELS = [
  { modelPath: "/models/cap-3d.glb", bgImage: "/images/3d-bg-1.jpg", scale: 2.4 },
  { modelPath: "/models/tshirt-3d.glb", bgImage: "/images/3d-bg-2.jpg", scale: 1.8 },
  { modelPath: "/models/cap-3d.glb", bgImage: "/images/3d-bg-3.jpg", scale: 2.4 },
  { modelPath: "/models/tshirt-3d.glb", bgImage: "/images/3d-bg-4.jpg", scale: 1.8 },
];

const CYCLE_INTERVAL = 5000;
const TRANSITION_MS = 800;

/**
 * 2 persistent canvases — NEVER destroyed.
 * They alternate between "active" (left, big) and "next" (right, small).
 * On each cycle:
 *   1. Active slides LEFT (exits), Next slides to CENTER (becomes active)
 *   2. After transition: the exited canvas loads the NEW model, then slides IN from RIGHT
 *   3. Background crossfades to match the new active model
 * Zero canvas destruction = zero flickering = zero blank screen.
 */
export default function Model3DViewer() {
  const [visible, setVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [slotA, setSlotA] = useState({ modelIdx: 0, role: "active" as "active" | "next" | "exiting" | "entering" });
  const [slotB, setSlotB] = useState({ modelIdx: 1, role: "next" as "active" | "next" | "exiting" | "entering" });
  const sectionRef = useRef<HTMLElement>(null);
  const cycleRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    MODELS.forEach((m) => {
      const img = new Image();
      img.src = m.bgImage;
    });
  }, []);

  // Auto-cycle
  useEffect(() => {
    if (!visible) return;

    const runCycle = () => {
      // Determine which slot is currently active
      const activeSlot = slotA.role === "active" ? "A" : "B";
      const nextSlot = activeSlot === "A" ? "B" : "A";

      // Step 1: active → exiting (slides left), next → active (slides to center)
      if (activeSlot === "A") {
        setSlotA((prev) => ({ ...prev, role: "exiting" }));
        setSlotB((prev) => ({ ...prev, role: "active" }));
      } else {
        setSlotB((prev) => ({ ...prev, role: "exiting" }));
        setSlotA((prev) => ({ ...prev, role: "active" }));
      }

      // Update activeIndex for background
      const newActiveIdx = activeSlot === "A" ? slotB.modelIdx : slotA.modelIdx;
      setActiveIndex(newActiveIdx);

      // Step 2: After transition, the exited slot loads new model + enters from right
      setTimeout(() => {
        const newModelIdx = (newActiveIdx + 1) % MODELS.length;
        if (activeSlot === "A") {
          setSlotA({ modelIdx: newModelIdx, role: "entering" });
        } else {
          setSlotB({ modelIdx: newModelIdx, role: "entering" });
        }

        // Step 3: After entering animation, set to "next"
        setTimeout(() => {
          if (activeSlot === "A") {
            setSlotA((prev) => ({ ...prev, role: "next" }));
          } else {
            setSlotB((prev) => ({ ...prev, role: "next" }));
          }
        }, TRANSITION_MS);
      }, TRANSITION_MS);
    };

    cycleRef.current = setInterval(runCycle, CYCLE_INTERVAL);
    return () => { if (cycleRef.current) clearInterval(cycleRef.current); };
  }, [visible, slotA, slotB]);

  // Get CSS for each role
  function getRoleStyle(role: string) {
    switch (role) {
      case "active":
        return { left: "0%", width: "65%", opacity: 1, transform: "translateX(0)", zIndex: 10 };
      case "next":
        return { left: "55%", width: "45%", opacity: 0.6, transform: "translateX(0)", zIndex: 5 };
      case "exiting":
        return { left: "0%", width: "65%", opacity: 0, transform: "translateX(-100%)", zIndex: 1 };
      case "entering":
        return { left: "55%", width: "45%", opacity: 0.6, transform: "translateX(0)", zIndex: 5 };
      default:
        return { left: "100%", width: "45%", opacity: 0, transform: "translateX(100%)", zIndex: 0 };
    }
  }

  return (
    <section ref={sectionRef} className="relative h-screen overflow-hidden bg-black">
      {/* Background — crossfade */}
      {MODELS.map((m, i) => (
        <div
          key={`bg-${i}`}
          className="absolute inset-0 transition-opacity duration-700"
          style={{
            backgroundImage: `url(${m.bgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: activeIndex === i ? 1 : 0,
          }}
        />
      ))}

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 30% 50%, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      {/* 2 PERSISTENT CANVASES — never destroyed, just change role + position */}
      {visible && (
        <>
          {/* Slot A */}
          <div
            className="absolute top-0 bottom-0 transition-all ease-out"
            style={{
              ...getRoleStyle(slotA.role),
              transitionDuration: `${TRANSITION_MS}ms`,
            }}
          >
            <Suspense fallback={null}>
              <Canvas3D
                modelPath={MODELS[slotA.modelIdx].modelPath}
                scale={slotA.role === "active" ? MODELS[slotA.modelIdx].scale : MODELS[slotA.modelIdx].scale * 0.7}
              />
            </Suspense>
          </div>

          {/* Slot B */}
          <div
            className="absolute top-0 bottom-0 transition-all ease-out"
            style={{
              ...getRoleStyle(slotB.role),
              transitionDuration: `${TRANSITION_MS}ms`,
            }}
          >
            <Suspense fallback={null}>
              <Canvas3D
                modelPath={MODELS[slotB.modelIdx].modelPath}
                scale={slotB.role === "active" ? MODELS[slotB.modelIdx].scale : MODELS[slotB.modelIdx].scale * 0.7}
              />
            </Suspense>
          </div>
        </>
      )}

      {/* Progress dots */}
      <div className="absolute bottom-8 inset-x-0 flex justify-center gap-2 z-30">
        {MODELS.map((_, i) => (
          <div
            key={i}
            className="h-1.5 rounded-full transition-all duration-500"
            style={{
              width: i === activeIndex ? "36px" : "8px",
              backgroundColor: i === activeIndex ? "#c8102e" : "rgba(255,255,255,0.25)",
            }}
          />
        ))}
      </div>
    </section>
  );
}
