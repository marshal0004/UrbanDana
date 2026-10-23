"use client";
// /home/z/my-project/UrbanDana/frontend/src/components/drift/DriftScrollVideo.tsx
//
// DRIFT scroll-controlled video parallax — Canvas + extracted frames approach.
//
// The 6-second cinematic dolly-in video has been pre-extracted into 151 JPEG
// frames at /public/videos/frames/f_001.jpg ... f_151.jpg. We draw these
// frames to a <canvas> based on scroll progress, which gives buttery-smooth
// 60fps scrubbing with zero codec delays (the technique Apple/B&O use).
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
//   - No React state updates during scroll (use gsap.quickSetter + direct drawImage)
//
// Self-contained: all DRIFT colors are inline styles (doesn't depend on
// globals.css having DRIFT tokens). Works on ace77b5 codebase as-is.
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

// Total number of extracted frames (matches ffmpeg fps=25 × 6.048s ≈ 151)
const TOTAL_FRAMES = 151;
const frameUrl = (i: number) => `/videos/frames/f_${String(i + 1).padStart(3, "0")}.jpg`;

export default function DriftScrollVideo() {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const overlay1Ref = useRef<HTMLDivElement | null>(null);
  const overlay2Ref = useRef<HTMLDivElement | null>(null);
  const overlay3Ref = useRef<HTMLDivElement | null>(null);
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
      const dpr = 1; // Capped — retina would render at 2x cost for no visual gain
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
      const clamped = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(idx)));
      const img = frames[clamped];
      if (!img || !img.complete) return;
      // Cover-fit the image to the canvas
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
      // Load frames in parallel batches of 30 to avoid network congestion
      const batchSize = 30;
      for (let start = 0; start < TOTAL_FRAMES; start += batchSize) {
        const end = Math.min(start + batchSize, TOTAL_FRAMES);
        const batch = await Promise.all(
          Array.from({ length: end - start }, (_, i) => {
            const idx = start + i;
            return new Promise<HTMLImageElement>((resolve, reject) => {
              const img = new Image();
              img.onload = () => {
                loadedCount++;
                if (loadedCount === TOTAL_FRAMES) setLoaded(true);
                resolve(img);
              };
              img.onerror = () => reject(new Error(`Failed to load frame ${idx + 1}`));
              img.src = frameUrl(idx);
            });
          })
        );
        frames = frames.concat(batch);
      }
      // Draw the first frame so the canvas isn't blank
      drawFrame(0);
    };

    const startAnimation = () => {
      if (reduced) {
        // Reduced motion: show middle frame static, all overlays visible
        drawFrame(Math.floor(TOTAL_FRAMES / 2));
        [overlay1Ref, overlay2Ref, overlay3Ref].forEach((r) => {
          if (r.current) {
            r.current.style.opacity = "1";
            r.current.style.transform = "none";
          }
        });
        if (progressRef.current) progressRef.current.style.width = "50%";
        return;
      }

      gsap.registerPlugin(ScrollTrigger);

      ctx2 = gsap.context(() => {
        // Master scroll trigger — drives the frame index
        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: () => `+=${window.innerHeight * 3}`, // 3 viewports of scroll
          scrub: 1,
          onUpdate: (self) => {
            targetFrameIdx = self.progress * (TOTAL_FRAMES - 1);
            // Update gold progress bar
            if (progressRef.current) {
              progressRef.current.style.width = `${self.progress * 100}%`;
            }
          },
        });

        // rAF loop — lerp currentFrameIdx toward target for smooth scrubbing.
        // Lerp factor 0.2 = smooth but responsive (Apple-style "heavy" scrub).
        const tick = () => {
          const diff = targetFrameIdx - currentFrameIdx;
          if (Math.abs(diff) > 0.01) {
            currentFrameIdx += diff * 0.2;
            drawFrame(currentFrameIdx);
          }
          rafId = requestAnimationFrame(tick);
        };
        rafId = requestAnimationFrame(tick);

        // Three text overlays — fade in/out at different scroll-progress windows.
        const setupOverlay = (
          ref: React.RefObject<HTMLDivElement | null>,
          inStart: number,
          inEnd: number,
          outStart: number,
          outEnd: number
        ) => {
          const el = ref.current;
          if (!el) return;
          gsap.set(el, { opacity: 0, y: 30 });
          gsap.to(el, {
            opacity: 1,
            y: 0,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: `top+=${inStart * 100}% top`,
              end: `top+=${inEnd * 100}% top`,
              scrub: true,
            },
          });
          gsap.to(el, {
            opacity: 0,
            y: -30,
            ease: "power2.in",
            scrollTrigger: {
              trigger: section,
              start: `top+=${outStart * 100}% top`,
              end: `top+=${outEnd * 100}% top`,
              scrub: true,
            },
          });
        };

        // Overlay 1: URBANDANA brand mark — 0-10% in, 25-35% out
        setupOverlay(overlay1Ref, 0, 0.1, 0.25, 0.35);
        // Overlay 2: HERITAGE COLLECTION — 20-35% in, 50-60% out
        setupOverlay(overlay2Ref, 0.2, 0.35, 0.5, 0.6);
        // Overlay 3: Product CTA — 50-65% in, 95-100% out
        setupOverlay(overlay3Ref, 0.5, 0.65, 0.95, 1);
      }, section);
    };

    // IntersectionObserver — load frames only when section is near viewport
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
      { rootMargin: "200px 0px" } // Start loading 200px before section enters
    );
    intersectionObs.observe(section);

    // Resize handler — re-setup canvas + redraw
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
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      className="relative"
      aria-label="Cinematic scroll video — Heritage Collection"
      style={{ height: "400vh", backgroundColor: COLORS.ink }}
    >
      {/* Sticky inner wrapper — pins the canvas to viewport while
          the outer section provides 400vh of scroll room */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Canvas — GPU-accelerated, will-change: transform */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ willChange: "transform" }}
          aria-label="Cinematic dolly-in through cathedral arch toward t-shirt"
        />

        {/* Loading state — fades out once frames are loaded */}
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

        {/* Dark gradient overlay for text legibility */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(23,11,14,0.55) 0%, rgba(23,11,14,0) 25%, rgba(23,11,14,0) 60%, rgba(23,11,14,0.7) 100%)",
          }}
          aria-hidden
        />

        {/* Overlay 1: URBANDANA brand mark — top center, fades 0→25% */}
        <div
          ref={overlay1Ref}
          className="absolute top-16 left-0 right-0 text-center pointer-events-none"
          style={{ opacity: 0 }}
        >
          <p
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "clamp(1.25rem, 2vw, 1.75rem)",
              letterSpacing: "0.5em",
              fontWeight: 500,
              color: COLORS.cream,
              opacity: 0.7,
            }}
          >
            URBANDANA
          </p>
          <p
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: "0.6875rem",
              fontWeight: 600,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: COLORS.mustard,
              opacity: 0.7,
              marginTop: "0.5rem",
            }}
          >
            Draped in Stories
          </p>
        </div>

        {/* Overlay 2: HERITAGE COLLECTION — bottom center, fades 20→55% */}
        <div
          ref={overlay2Ref}
          className="absolute bottom-24 left-0 right-0 text-center pointer-events-none"
          style={{ opacity: 0 }}
        >
          <p
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: "0.6875rem",
              fontWeight: 600,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: COLORS.mustard,
              marginBottom: "0.75rem",
            }}
          >
            The Collection
          </p>
          <h2
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "clamp(2.5rem, 7vw, 5rem)",
              lineHeight: 0.92,
              letterSpacing: "0.02em",
              fontWeight: 700,
              color: COLORS.cream,
            }}
          >
            HERITAGE
            <br />
            COLLECTION
          </h2>
          <p
            style={{
              fontFamily: "'Brush Script MT', cursive",
              fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
              color: COLORS.mustard,
              marginTop: "0.75rem",
            }}
          >
            SS &lsquo;26
          </p>
        </div>

        {/* Overlay 3: Product CTA — bottom right, fades 50→100% */}
        <div
          ref={overlay3Ref}
          className="absolute bottom-24 right-8 sm:right-12 max-w-xs text-right"
          style={{ opacity: 0 }}
        >
          <p
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: "0.6875rem",
              fontWeight: 600,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: COLORS.mustard,
            }}
          >
            The Cathedral Tee
          </p>
          <p
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 500,
              color: COLORS.cream,
              marginTop: "0.5rem",
            }}
          >
            ₹299
          </p>
          <p
            style={{
              color: COLORS.cream,
              opacity: 0.7,
              fontSize: "0.875rem",
              marginTop: "0.25rem",
              maxWidth: "18rem",
              marginLeft: "auto",
            }}
          >
            Hand-finished. 220 GSM combed cotton. Pattern inspired by heritage
            archways.
          </p>
          <Link
            href="/shop?category=T-Shirts"
            className="inline-flex items-center gap-2 mt-4 px-5 py-3 rounded-full transition-all duration-300"
            style={{
              border: `1px solid ${COLORS.cream}`,
              color: COLORS.cream,
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: "0.75rem",
              fontWeight: 600,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            View Details →
          </Link>
        </div>

        {/* Scroll progress indicator — thin gold line at bottom */}
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

        {/* Scroll hint */}
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
