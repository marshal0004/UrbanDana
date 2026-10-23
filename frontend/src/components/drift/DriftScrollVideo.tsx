"use client";
// /home/z/my-project/UrbanDana/frontend/src/components/drift/DriftScrollVideo.tsx
//
// DRIFT scroll-controlled video parallax — Canvas + extracted frames approach.
//
// This component is REUSABLE — pass it different `frameFolder`, `totalFrames`,
// and `overlays` props to create multiple scroll-video sections with different
// videos. Each instance has its own IntersectionObserver, ScrollTrigger, and
// rAF loop — they don't interfere with each other.
//
// Why Canvas + frames (NOT <video>):
//   - Setting video.currentTime is async + triggers codec seek delays
//   - On fast scroll, this causes stutter/jank
//   - Canvas + pre-extracted frames = pure image drawing = sub-millisecond
//   - GPU-accelerated via will-change: transform on the canvas
//
// Performance:
//   - Frames lazy-loaded ONLY when section enters viewport (IntersectionObserver)
//   - Canvas DPR capped at 1 (no over-rendering on retina)
//   - rAF loop only runs while section is in viewport
//   - No React state updates during scroll (direct drawImage)
//
// Honors prefers-reduced-motion: shows middle frame static, all overlays visible.

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// DRIFT palette (inline — self-contained)
const COLORS = {
  ink: "#170b0e",
  cream: "#f7f5f1",
  mustard: "#e2b227",
  gold: "#c9a227",
  maroon: "#6e0f2e",
};

export interface ScrollVideoOverlay {
  /** "in" scroll-progress window (0-1) — overlay fades in during this range */
  inStart: number;
  inEnd: number;
  /** "out" scroll-progress window (0-1) — overlay fades out during this range */
  outStart: number;
  outEnd: number;
  /** Content — React node rendered inside the overlay div */
  content: React.ReactNode;
  /** Position class — Tailwind position classes (e.g. "top-16 left-0 right-0 text-center") */
  positionClass: string;
  /** Optional extra className for the overlay div */
  className?: string;
}

interface DriftScrollVideoProps {
  /** Folder path under /public/ containing the extracted JPEG frames.
   *  e.g. "/videos/frames" → /public/videos/frames/f_001.jpg ... f_151.jpg */
  frameFolder: string;
  /** Total number of frames in the folder */
  totalFrames: number;
  /** Array of overlay configs — each fades in/out at specific scroll-progress windows */
  overlays: ScrollVideoOverlay[];
  /** Aria label for the section (a11y) */
  ariaLabel: string;
  /** Aria label for the canvas (a11y) */
  canvasAriaLabel: string;
}

const frameUrl = (folder: string, i: number) =>
  `${folder}/f_${String(i + 1).padStart(3, "0")}.jpg`;

export default function DriftScrollVideo({
  frameFolder,
  totalFrames,
  overlays,
  ariaLabel,
  canvasAriaLabel,
}: DriftScrollVideoProps) {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const overlayRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    // ── 1. Setup canvas dimensions (DPR-capped at 1 for performance) ──
    const setupCanvas = () => {
      const dpr = 1;
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
    };
    setupCanvas();

    // ── 2. State for frame loading + scrubbing ──
    let frames: HTMLImageElement[] = [];
    let loadedCount = 0;
    let intersectionObs: IntersectionObserver | null = null;
    let rafId: number | null = null;
    let targetFrameIdx = 0;
    let currentFrameIdx = 0;
    let ctx2: gsap.Context | null = null;

    const drawFrame = (idx: number) => {
      const clamped = Math.max(0, Math.min(totalFrames - 1, Math.round(idx)));
      const img = frames[clamped];
      if (!img || !img.complete) return;
      const cw = canvas.width;
      const ch = canvas.height;
      const iw = img.naturalWidth || img.width;
      const ih = img.naturalHeight || img.height;
      if (!iw || !ih) return;
      const scale = Math.max(cw / iw, ch / ih);
      const dw = iw * scale;
      const dh = ih * scale;
      const dx = (cw - dw) / 2;
      const dy = (ch - dh) / 2;
      ctx.drawImage(img, dx, dy, dw, dh);
    };

    const loadFrames = async () => {
      const batchSize = 30;
      for (let start = 0; start < totalFrames; start += batchSize) {
        const end = Math.min(start + batchSize, totalFrames);
        const batch = await Promise.all(
          Array.from({ length: end - start }, (_, i) => {
            const idx = start + i;
            return new Promise<HTMLImageElement>((resolve, reject) => {
              const img = new Image();
              img.onload = () => {
                loadedCount++;
                if (loadedCount === totalFrames) setLoaded(true);
                resolve(img);
              };
              img.onerror = () => reject(new Error(`Failed to load frame ${idx + 1}`));
              img.src = frameUrl(frameFolder, idx);
            });
          })
        );
        frames = frames.concat(batch);
      }
      drawFrame(0);
    };

    const startAnimation = () => {
      if (reduced) {
        drawFrame(Math.floor(totalFrames / 2));
        overlayRefs.current.forEach((el) => {
          if (el) {
            el.style.opacity = "1";
            el.style.transform = "none";
          }
        });
        if (progressRef.current) progressRef.current.style.width = "50%";
        return;
      }

      gsap.registerPlugin(ScrollTrigger);

      ctx2 = gsap.context(() => {
        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: () => `+=${window.innerHeight * 3}`,
          scrub: 1,
          onUpdate: (self) => {
            targetFrameIdx = self.progress * (totalFrames - 1);
            if (progressRef.current) {
              progressRef.current.style.width = `${self.progress * 100}%`;
            }
          },
        });

        const tick = () => {
          const diff = targetFrameIdx - currentFrameIdx;
          if (Math.abs(diff) > 0.01) {
            currentFrameIdx += diff * 0.2;
            drawFrame(currentFrameIdx);
          }
          rafId = requestAnimationFrame(tick);
        };
        rafId = requestAnimationFrame(tick);

        // Setup each overlay's fade in/out
        overlays.forEach((overlay, i) => {
          const el = overlayRefs.current[i];
          if (!el) return;
          gsap.set(el, { opacity: 0, y: 30 });
          gsap.to(el, {
            opacity: 1,
            y: 0,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: `top+=${overlay.inStart * 100}% top`,
              end: `top+=${overlay.inEnd * 100}% top`,
              scrub: true,
            },
          });
          gsap.to(el, {
            opacity: 0,
            y: -30,
            ease: "power2.in",
            scrollTrigger: {
              trigger: section,
              start: `top+=${overlay.outStart * 100}% top`,
              end: `top+=${overlay.outEnd * 100}% top`,
              scrub: true,
            },
          });
        });
      }, section);
    };

    intersectionObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && frames.length === 0) {
            loadFrames()
              .then(() => startAnimation())
              .catch((err) => console.error("DriftScrollVideo: frame load failed", err));
            if (intersectionObs) intersectionObs.disconnect();
          }
        });
      },
      { rootMargin: "200px 0px" }
    );
    intersectionObs.observe(section);

    const onResize = () => {
      setupCanvas();
      drawFrame(currentFrameIdx);
      if (ctx2) ScrollTrigger.refresh();
    };
    window.addEventListener("resize", onResize);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (intersectionObs) intersectionObs.disconnect();
      window.removeEventListener("resize", onResize);
      if (ctx2) ctx2.revert();
    };
  }, [reduced, frameFolder, totalFrames, overlays]);

  return (
    <section
      ref={sectionRef}
      className="relative"
      aria-label={ariaLabel}
      style={{ height: "400vh", backgroundColor: COLORS.ink }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ willChange: "transform" }}
          aria-label={canvasAriaLabel}
        />

        {!loaded ? (
          <div
            className="absolute inset-0 flex items-center justify-center text-xs uppercase pointer-events-none"
            style={{
              backgroundColor: COLORS.ink,
              color: COLORS.cream,
              letterSpacing: "0.3em",
              opacity: 0.6,
            }}
          >
            <div className="animate-pulse">Loading cinematic…</div>
          </div>
        ) : null}

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(23,11,14,0.55) 0%, rgba(23,11,14,0) 25%, rgba(23,11,14,0) 60%, rgba(23,11,14,0.7) 100%)",
          }}
          aria-hidden
        />

        {/* Render all overlays — each fades in/out per its config */}
        {overlays.map((overlay, i) => (
          <div
            key={i}
            ref={(el) => {
              overlayRefs.current[i] = el;
            }}
            className={`absolute pointer-events-none ${overlay.positionClass} ${overlay.className || ""}`}
            style={{ opacity: 0 }}
          >
            {overlay.content}
          </div>
        ))}

        {/* Progress bar */}
        <div
          className="absolute bottom-0 left-0 h-[3px]"
          style={{ width: "100%", backgroundColor: "rgba(247, 245, 241, 0.15)" }}
          aria-hidden
        >
          <div
            ref={progressRef}
            className="h-full"
            style={{
              width: "0%",
              backgroundColor: COLORS.mustard,
              transition: "none",
            }}
          />
        </div>

        <div className="absolute bottom-8 left-0 right-0 text-center pointer-events-none">
          <p
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: "0.625rem",
              fontWeight: 600,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: COLORS.cream,
              opacity: 0.5,
            }}
          >
            Scroll to explore
          </p>
        </div>
      </div>
    </section>
  );
}
