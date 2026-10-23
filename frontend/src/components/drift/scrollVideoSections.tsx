// /home/z/my-project/UrbanDana/frontend/src/components/drift/scrollVideoSections.tsx
//
// Pre-configured DriftScrollVideo sections for the UrbanDana homepage.
// Each export is a complete <DriftScrollVideo> instance with its own
// frame folder + overlays + aria labels.

import React from "react";
import DriftScrollVideo, { type ScrollVideoOverlay } from "./DriftScrollVideo";

// Shared inline style fragments for DRIFT typography (self-contained,
// doesn't depend on globals.css having DRIFT tokens).
const FONT_SERIF = "Georgia, 'Times New Roman', serif";
const FONT_SANS = "Inter, system-ui, sans-serif";
const FONT_SCRIPT = "'Brush Script MT', cursive";

const COLORS = {
  cream: "#f7f5f1",
  mustard: "#e2b227",
  ink: "#170b0e",
};

// === Section 1: CATHEDRAL video → t-shirt (existing) ===
const cathedralOverlays: ScrollVideoOverlay[] = [
  // 1. URBANDANA brand mark — 0-10% in, 25-35% out
  {
    inStart: 0,
    inEnd: 0.1,
    outStart: 0.25,
    outEnd: 0.35,
    positionClass: "top-16 left-0 right-0 text-center",
    content: (
      <>
        <p
          style={{
            fontFamily: FONT_SERIF,
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
            fontFamily: FONT_SANS,
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
      </>
    ),
  },
  // 2. HERITAGE COLLECTION — 20-35% in, 50-60% out
  {
    inStart: 0.2,
    inEnd: 0.35,
    outStart: 0.5,
    outEnd: 0.6,
    positionClass: "bottom-24 left-0 right-0 text-center",
    content: (
      <>
        <p
          style={{
            fontFamily: FONT_SANS,
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
            fontFamily: FONT_SERIF,
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
            fontFamily: FONT_SCRIPT,
            fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
            color: COLORS.mustard,
            marginTop: "0.75rem",
          }}
        >
          SS &lsquo;26
        </p>
      </>
    ),
  },
  // 3. Product CTA — 50-65% in, 95-100% out
  {
    inStart: 0.5,
    inEnd: 0.65,
    outStart: 0.95,
    outEnd: 1,
    positionClass: "bottom-24 right-8 sm:right-12 max-w-xs text-right",
    className: "pointer-events-auto",
    content: (
      <>
        <p
          style={{
            fontFamily: FONT_SANS,
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
            fontFamily: FONT_SERIF,
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
        <a
          href="/shop?category=T-Shirts"
          className="inline-flex items-center gap-2 mt-4 px-5 py-3 rounded-full transition-all duration-300"
          style={{
            border: `1px solid ${COLORS.cream}`,
            color: COLORS.cream,
            fontFamily: FONT_SANS,
            fontSize: "0.75rem",
            fontWeight: 600,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
        >
          View Details →
        </a>
      </>
    ),
  },
];

// === Section 2: RETAIL STORE video → botanical cap (NEW) ===
const botanicaOverlays: ScrollVideoOverlay[] = [
  // 1. URBANDANA brand mark — 0-10% in, 25-35% out
  {
    inStart: 0,
    inEnd: 0.1,
    outStart: 0.25,
    outEnd: 0.35,
    positionClass: "top-16 left-0 right-0 text-center",
    content: (
      <>
        <p
          style={{
            fontFamily: FONT_SERIF,
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
            fontFamily: FONT_SANS,
            fontSize: "0.6875rem",
            fontWeight: 600,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: COLORS.mustard,
            opacity: 0.7,
            marginTop: "0.5rem",
          }}
        >
          Hand-finished in India
        </p>
      </>
    ),
  },
  // 2. BOTANICA SERIES — 20-35% in, 50-60% out
  {
    inStart: 0.2,
    inEnd: 0.35,
    outStart: 0.5,
    outEnd: 0.6,
    positionClass: "bottom-24 left-0 right-0 text-center",
    content: (
      <>
        <p
          style={{
            fontFamily: FONT_SANS,
            fontSize: "0.6875rem",
            fontWeight: 600,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: COLORS.mustard,
            marginBottom: "0.75rem",
          }}
        >
          The Edit
        </p>
        <h2
          style={{
            fontFamily: FONT_SERIF,
            fontSize: "clamp(2.5rem, 7vw, 5rem)",
            lineHeight: 0.92,
            letterSpacing: "0.02em",
            fontWeight: 700,
            color: COLORS.cream,
          }}
        >
          BOTANICA
          <br />
          SERIES
        </h2>
        <p
          style={{
            fontFamily: FONT_SCRIPT,
            fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
            color: COLORS.mustard,
            marginTop: "0.75rem",
          }}
        >
          Earth &amp; Olive
        </p>
      </>
    ),
  },
  // 3. Product CTA — 50-65% in, 95-100% out
  {
    inStart: 0.5,
    inEnd: 0.65,
    outStart: 0.95,
    outEnd: 1,
    positionClass: "bottom-24 right-8 sm:right-12 max-w-xs text-right",
    className: "pointer-events-auto",
    content: (
      <>
        <p
          style={{
            fontFamily: FONT_SANS,
            fontSize: "0.6875rem",
            fontWeight: 600,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: COLORS.mustard,
          }}
        >
          The Olive Leaf Cap
        </p>
        <p
          style={{
            fontFamily: FONT_SERIF,
            fontSize: "clamp(2rem, 4vw, 3rem)",
            fontWeight: 500,
            color: COLORS.cream,
            marginTop: "0.5rem",
          }}
        >
          ₹249
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
          Hand-painted olive leaf motif on cream cotton. Adjustable knot-tie.
          Structured visor.
        </p>
        <a
          href="/shop?category=Bandana Caps"
          className="inline-flex items-center gap-2 mt-4 px-5 py-3 rounded-full transition-all duration-300"
          style={{
            border: `1px solid ${COLORS.cream}`,
            color: COLORS.cream,
            fontFamily: FONT_SANS,
            fontSize: "0.75rem",
            fontWeight: 600,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
        >
          View Details →
        </a>
      </>
    ),
  },
];

// === Pre-built section components ===

export function CathedralScrollVideo() {
  return (
    <DriftScrollVideo
      frameFolder="/videos/frames"
      totalFrames={151}
      overlays={cathedralOverlays}
      ariaLabel="Cinematic scroll video — Heritage Collection"
      canvasAriaLabel="Cinematic dolly-in through cathedral arch toward t-shirt"
    />
  );
}

export function BotanicaScrollVideo() {
  return (
    <DriftScrollVideo
      frameFolder="/videos/frames2"
      totalFrames={151}
      overlays={botanicaOverlays}
      ariaLabel="Cinematic scroll video — Botanica Series"
      canvasAriaLabel="Cinematic dolly-in through luxury retail store toward botanical cap"
    />
  );
}
