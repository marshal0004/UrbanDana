"use client";
// /home/z/my-project/UrbanDana/frontend/src/components/drift/DriftArcCarousel.tsx
//
// 3D ARC CAROUSEL — Row 1 of the product showcase.
//
// Cards arranged in an ARC (not straight line) with 3D perspective:
//   - Center card: flat (rotateY: 0, scale: 1.0)
//   - Edge cards: tilt away (rotateY: ±28deg, scale: 0.94, translateZ: -160px)
//   - Slight vertical arc (y: |d| * 30px) for the curved-wall feel
//
// Auto-scrolls RIGHT → LEFT infinitely (rAF-driven, 50px/sec).
// Each card is an IMAGE (not a full product card) with a small caption
// overlay (name + price) — clean, image-forward, 3D attractive.
//
// Honors prefers-reduced-motion: shows static centered card.
//
// The arc + 3D tilt is the technique used by Apple, B&O, and the DRIFT
// saree site's "Woven to Be Remembered" section.

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { api, absUrl, type Product } from "@/lib/api";
import Image from "next/image";

const CARD_WIDTH = 280; // px
const CARD_HEIGHT = 380; // px
const GAP = 24; // px
const SPEED_PX_PER_SEC = 80; // faster speed (was 50)

export default function DriftArcCarousel() {
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [paused, setPaused] = useState(false);

  // Fetch real products from backend
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.listProducts({ limit: 100 });
        if (cancelled) return;
        // Use featured + highest-rated products for the arc
        const sorted = [...res.items]
          .filter((p) => p.images && p.images.length > 0)
          .sort((a, b) => {
            if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
            return b.rating - a.rating;
          })
          .slice(0, 12);
        setProducts(sorted);
      } catch (err) {
        console.error("DriftArcCarousel: failed to load products", err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Auto-scroll + per-card 3D transforms
  useEffect(() => {
    if (reduced || products.length === 0) return;
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    // Duplicate products for seamless infinite loop
    const allItems = [...products, ...products];
    const totalWidth = allItems.length * (CARD_WIDTH + GAP);

    let offset = 0;
    let rafId: number | null = null;
    let lastTime = performance.now();

    // Per-card transform: applies 3D rotateY/scale/translateZ/y based on
    // distance from viewport center. Cards are positioned absolutely.
    const updateCardTransforms = () => {
      const viewportCenter = container.clientWidth / 2;
      const cards = track.querySelectorAll<HTMLElement>("[data-arc-card]");
      cards.forEach((card) => {
        // Card center = card's left position in track + track offset + half card width
        const cardLeft = parseFloat(card.dataset.left || "0");
        const cardCenter = cardLeft + offset + CARD_WIDTH / 2;
        // Account for track translateX
        const adjustedCenter = ((cardCenter % totalWidth) + totalWidth) % totalWidth;
        // Distance from viewport center, accounting for wrap
        let d = (adjustedCenter - viewportCenter) / (container.clientWidth / 2);
        // Clamp to [-1.4, 1.4] so edge cards don't go too extreme
        d = Math.max(-1.4, Math.min(1.4, d));

        const absD = Math.abs(d);
        // More dramatic "C" shape — like the saree site screenshot
        // Cards curve around a center point, forming a backward-C / smile arc
        const rotateY = -d * 38; // deg — more tilt at edges (was 28)
        const scale = 1 - absD * 0.08; // more shrink at edges (was 0.06)
        const translateZ = -absD * 200; // more depth (was 160)
        const y = absD * 60; // more vertical drop — creates the C arc (was 30)

        card.style.transform = `translate3d(0, ${y}px, ${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`;
        card.style.opacity = "1"; // cards stay fully clear — no fading
        card.style.zIndex = `${Math.round(100 - absD * 10)}`;
      });
    };

    const tick = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      if (!paused) {
        offset -= SPEED_PX_PER_SEC * dt; // negative = R→L scroll
        // Seamless loop: when offset exceeds totalWidth, reset by one set
        if (offset <= -totalWidth / 2) {
          offset += totalWidth / 2;
        }
        track.style.transform = `translateX(${offset}px)`;
        updateCardTransforms();
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [reduced, products, paused]);

  if (products.length === 0) {
    return (
      <section className="py-20 bg-ink" aria-label="3D arc carousel — loading">
        <div className="text-center text-paper/40 text-sm uppercase tracking-[0.3em]">
          Loading products…
        </div>
      </section>
    );
  }

  // Duplicate for infinite loop
  const allItems = [...products, ...products];

  return (
    <section
      className="py-16"
      style={{ background: "#f4f1ee", color: "#0b0a0a" }}
      aria-label="3D arc carousel — featured products"
    >
      {/* Header — NOT part of the hover/pause area */}
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 mb-8 text-center">
        <p
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "#e3b867",
            margin: "0 0 8px 0",
          }}
        >
          The Drift Signatures
        </p>
        <h2
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: 500,
            lineHeight: 1.04,
            letterSpacing: "-0.02em",
            margin: 0,
          }}
        >
          Woven to Be{" "}
          <span style={{ fontStyle: "italic", color: "#e3b867" }}>Remembered</span>
        </h2>
      </div>

      {/* 3D perspective container — ONLY this triggers pause on hover */}
      <div
        ref={containerRef}
        className="relative overflow-hidden"
        style={{
          height: `${CARD_HEIGHT + 80}px`,
          perspective: "1400px",
          perspectiveOrigin: "50% 50%",
        }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Track — preserve-3d so children can rotate in 3D space */}
        <div
          ref={trackRef}
          className="absolute left-0 top-1/2"
          style={{
            transformStyle: "preserve-3d",
            willChange: "transform",
            marginTop: `-${CARD_HEIGHT / 2}px`,
            height: `${CARD_HEIGHT}px`,
          }}
        >
          {allItems.map((product, i) => {
            const cardLeft = i * (CARD_WIDTH + GAP);
            return (
              <div
                key={`${product.id}-${i}`}
                data-arc-card={i}
                data-left={cardLeft}
                className="absolute"
                style={{
                  left: `${cardLeft}px`,
                  top: 0,
                  width: `${CARD_WIDTH}px`,
                  height: `${CARD_HEIGHT}px`,
                  transformStyle: "preserve-3d",
                  transformOrigin: "center bottom",
                  willChange: "transform, opacity",
                }}
              >
                <Link
                  href={`/product/${product.slug}`}
                  className="block w-full h-full no-underline"
                >
                  <div
                    className="relative w-full h-full overflow-hidden"
                    style={{
                      borderRadius: "8px",
                      background: "#ffffff",
                      boxShadow: "0 20px 50px -20px rgba(0,0,0,0.3)",
                    }}
                  >
                    {/* Product image — next/image for Vercel CDN optimization (WebP, resize, edge cache) */}
                    <Image
                      src={absUrl(product.images[0]?.url || "")}
                      alt={product.title}
                      fill
                      sizes="280px"
                      style={{ objectFit: "cover", objectPosition: "center top" }}
                      loading="lazy"
                      placeholder="empty"
                    />
                    {/* Dark gradient at bottom for caption legibility */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.85) 100%)",
                      }}
                    />
                    {/* Caption — name + price */}
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <p
                        style={{
                          fontFamily: "Georgia, 'Times New Roman', serif",
                          fontSize: "1.125rem",
                          fontWeight: 500,
                          lineHeight: 1.2,
                          margin: "0 0 4px 0",
                        }}
                      >
                        {product.title}
                      </p>
                      <p
                        style={{
                          fontFamily: "Inter, system-ui, sans-serif",
                          fontSize: "0.875rem",
                          fontWeight: 600,
                          color: "#e3b867",
                          margin: 0,
                        }}
                      >
                        ₹{Math.round(product.price / 100)}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
