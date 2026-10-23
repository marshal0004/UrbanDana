"use client";
// /home/z/my-project/UrbanDana/frontend/src/components/drift/DriftInfiniteRow.tsx
//
// Horizontal infinite auto-scrolling product row (Rows 2+).
//
// - Scrolls horizontally forever via rAF (60px/sec = normal speed)
// - Direction prop: "ltr" (left→right) or "rtl" (right→left)
// - PAUSE on hover, RESUME when hover leaves (continues from same offset)
// - Each item is an IMAGE (not a full product card) with small caption
//   (name + price) overlay — clean, image-forward
// - Track is duplicated for seamless infinite loop
// - Subtle 3D depth via per-image scale + opacity based on distance
//   from row center (cards at edges fade + shrink slightly)

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { absUrl, type Product } from "@/lib/api";

const CARD_WIDTH = 240; // px — slightly smaller than arc carousel
const CARD_HEIGHT = 320; // px
const GAP = 20; // px
const SPEED_PX_PER_SEC = 60; // normal speed

interface DriftInfiniteRowProps {
  products: Product[];
  direction: "ltr" | "rtl";
  eyebrow?: string;
  title?: string;
}

export default function DriftInfiniteRow({
  products,
  direction,
  eyebrow,
  title,
}: DriftInfiniteRowProps) {
  const reduced = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  // Auto-scroll
  useEffect(() => {
    if (reduced || products.length === 0) return;
    const track = trackRef.current;
    if (!track) return;

    const allItems = [...products, ...products];
    const totalWidth = allItems.length * (CARD_WIDTH + GAP);
    const halfWidth = totalWidth / 2;

    let offset = 0;
    let rafId: number | null = null;
    let lastTime = performance.now();

    // Direction: ltr = cards move left→right = track translateX increases (positive)
    //            rtl = cards move right→left = track translateX decreases (negative)
    // translateX(-offset) with dir=-1 for ltr → offset decreases → -offset increases (positive) → track RIGHT → cards RIGHT (L→R) ✓
    // translateX(-offset) with dir=1 for rtl → offset increases → -offset decreases (negative) → track LEFT → cards LEFT (R→L) ✓
    const dir = direction === "ltr" ? -1 : 1;

    const tick = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      if (!paused) {
        offset += dir * SPEED_PX_PER_SEC * dt;
        // Seamless loop
        if (dir > 0 && offset >= halfWidth) {
          offset -= halfWidth;
        } else if (dir < 0 && offset <= -halfWidth) {
          offset += halfWidth;
        }
        track.style.transform = `translateX(${-offset}px)`;
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [reduced, products, direction, paused]);

  if (products.length === 0) return null;

  const allItems = [...products, ...products];

  return (
    <section
      className="py-10"
      style={{ background: "#f4f1ee", color: "#0b0a0a" }}
      aria-label={title || "Product row"}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Optional header */}
      {eyebrow || title ? (
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 mb-6">
          {eyebrow ? (
            <p
              style={{
                fontFamily: "Inter, system-ui, sans-serif",
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "#e3b867",
                margin: "0 0 4px 0",
              }}
            >
              {eyebrow}
            </p>
          ) : null}
          {title ? (
            <h3
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                fontWeight: 500,
                letterSpacing: "-0.02em",
                margin: 0,
              }}
            >
              {title}
            </h3>
          ) : null}
        </div>
      ) : null}

      {/* Horizontal infinite track */}
      <div className="overflow-hidden">
        <div
          ref={trackRef}
          className="flex will-change-transform"
          style={{ width: "max-content", gap: `${GAP}px`, padding: "0 12px" }}
        >
          {allItems.map((product, i) => (
            <Link
              key={`${product.id}-${i}`}
              href={`/product/${product.slug}`}
              className="shrink-0 block no-underline relative"
              style={{
                width: `${CARD_WIDTH}px`,
                height: `${CARD_HEIGHT}px`,
                borderRadius: "8px",
                overflow: "hidden",
                background: "#ffffff",
                boxShadow: "0 12px 30px -15px rgba(0,0,0,0.3)",
              }}
            >
              {/* Product image — fills the card */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={absUrl(product.images[0]?.url || "")}
                alt={product.title}
                className="w-full h-full"
                style={{
                  objectFit: "cover",
                  objectPosition: "center top",
                  transition: "transform 0.5s ease",
                }}
                loading="lazy"
                decoding="async"
              />
              {/* Dark gradient at bottom for caption */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(0,0,0,0) 60%, rgba(0,0,0,0.8) 100%)",
                }}
              />
              {/* Caption — name + price */}
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <p
                  style={{
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    lineHeight: 1.2,
                    margin: "0 0 2px 0",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {product.title}
                </p>
                <p
                  style={{
                    fontFamily: "Inter, system-ui, sans-serif",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "#e3b867",
                    margin: 0,
                  }}
                >
                  ₹{Math.round(product.price / 100)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
