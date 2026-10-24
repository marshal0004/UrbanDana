"use client";
// /home/z/my-project/UrbanDana/frontend/src/components/drift/HeroMarquee.tsx
//
// Thin marquee strip between Hero and CathedralScrollVideo.
// Infinite horizontal scroll with URBANDANA name + motto.
// Touches borders of both sections (no gap above or below).
// Maroon background, cream text, ~40px tall.

import { useEffect, useRef } from "react";

const ITEMS = [
  "URBANDANA",
  "Style That Never Stops",
  "Handcrafted in India",
  "One Cap · Three Looks",
  "Caps ₹249 · T-Shirts ₹349",
  "Free Shipping Over ₹999",
  "7-Day Easy Returns",
  "Limited Drops · No Restocks",
];

const SPEED = 50; // px/sec

export default function HeroMarquee() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const itemWidth = 200 + 30; // approximate: text + gap per item
    const halfWidth = ITEMS.length * itemWidth;

    let offset = 0;
    let rafId: number | null = null;
    let lastTime = performance.now();

    const tick = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      offset += SPEED * dt;
      if (offset >= halfWidth) offset -= halfWidth;
      track.style.transform = `translateX(${-offset}px)`;
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const items = [...ITEMS, ...ITEMS];

  return (
    <div
      className="w-full overflow-hidden"
      style={{
        background: "#6e0f2e",
        color: "#f4f1ee",
        height: "40px",
        display: "flex",
        alignItems: "center",
      }}
      aria-label="Urbandana motto marquee"
    >
      <div
        ref={trackRef}
        className="flex will-change-transform"
        style={{ width: "max-content" }}
      >
        {items.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center whitespace-nowrap"
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontStyle: "italic",
              fontSize: "15px",
              color: "#f4f1ee",
              padding: "0 20px",
            }}
          >
            {item}
            <span
              style={{
                color: "#e3b867",
                marginLeft: "20px",
                fontStyle: "normal",
                fontSize: "12px",
              }}
            >
              ✦
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
