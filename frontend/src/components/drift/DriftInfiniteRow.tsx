"use client";
// /home/z/my-project/UrbanDana/frontend/src/components/drift/DriftInfiniteRow.tsx
//
// Horizontal infinite auto-scrolling product row (Rows 2+).
//
// SEAMLESS LOOP: Each card has marginRight: GAP (instead of CSS gap on
// the container). This means the track width = N * (CARD_WIDTH + GAP)
// exactly, and halfWidth = (N/2) * (CARD_WIDTH + GAP) exactly. When
// offset reaches halfWidth, the reset is pixel-perfect — no gap.
//
// PAUSE ON HOVER: The hover target is ONLY the scroll container (the
// overflow-hidden div), NOT the entire section. So the header text
// and padding don't trigger pause — only hovering over actual cards.
//
// Each card is an IMAGE with small caption overlay.

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { absUrl, type Product } from "@/lib/api";
import Image from "next/image";

const CARD_WIDTH = 240; // px
const CARD_HEIGHT = 320; // px
const GAP = 20; // px — applied as marginRight per card (NOT CSS gap)
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reduced || products.length === 0) return;
    const track = trackRef.current;
    if (!track) return;

    // Each card is (CARD_WIDTH + GAP) wide including its marginRight.
    // Duplicated set → total track = 2N * (CARD_WIDTH + GAP).
    // halfWidth = N * (CARD_WIDTH + GAP) — exact, no gap at loop point.
    const itemWidth = CARD_WIDTH + GAP;
    const halfWidth = products.length * itemWidth;

    let offset = 0;
    let rafId: number | null = null;
    let lastTime = performance.now();

    // Direction: ltr = cards move left→right = track translateX increases (positive)
    //            rtl = cards move right→left = track translateX decreases (negative)
    const dir = direction === "ltr" ? -1 : 1;

    const tick = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      if (!paused) {
        offset += dir * SPEED_PX_PER_SEC * dt;
        // Seamless loop — reset by exactly halfWidth (one set width)
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

  // Duplicate for seamless infinite loop
  const allItems = [...products, ...products];

  return (
    <section
      className="py-10"
      style={{ background: "#f4f1ee", color: "#0b0a0a" }}
      aria-label={title || "Product row"}
    >
      {/* Optional header — NOT part of the hover/pause area */}
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
                color: "#c9a227",
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

      {/* Scroll container — ONLY this area triggers pause on hover */}
      <div
        ref={scrollRef}
        className="overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          ref={trackRef}
          className="flex will-change-transform"
          style={{ width: "max-content" }}
        >
          {allItems.map((product, i) => (
            <Link
              key={`${product.id}-${i}`}
              href={`/product/${product.slug}`}
              className="shrink-0 block no-underline relative"
              style={{
                width: `${CARD_WIDTH}px`,
                height: `${CARD_HEIGHT}px`,
                marginRight: `${GAP}px`,
                position: "relative", // gap as marginRight, NOT CSS gap
                borderRadius: "8px",
                overflow: "hidden",
                background: "#ffffff",
                boxShadow: "0 12px 30px -15px rgba(0,0,0,0.3)",
              }}
            >
              {/* Product image — next/image for Vercel CDN optimization */}
              <Image
                src={absUrl(product.images[0]?.url || "")}
                alt={product.title}
                fill
                sizes="240px"
                style={{ objectFit: "cover", objectPosition: "center top" }}
                loading="lazy"
                placeholder="empty"
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
