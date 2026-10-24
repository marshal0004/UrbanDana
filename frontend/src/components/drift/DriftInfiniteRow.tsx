"use client";
// /home/z/my-project/UrbanDana/frontend/src/components/drift/DriftInfiniteRow.tsx
//
// Horizontal infinite auto-scrolling product row (Rows 2+).
//
// SEAMLESS LOOP: Each card has marginRight: GAP. Track duplicated for
// pixel-perfect reset at halfWidth.
// SMOOTH SCROLLING: Uses translate3d (GPU-accelerated) + will-change +
// backface-visibility hidden to prevent flickering.
// PAUSE ON HOVER: Only the scroll container triggers pause.
// ADD TO CART: Slide-up "Add to Bag" button on hover per card.

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useShop } from "@/context/ShopContext";
import { absUrl, type Product } from "@/lib/api";

const CARD_WIDTH = 264;  // +10% (was 240)
const CARD_HEIGHT = 352; // +10% (was 320)
const GAP = 20;
const SPEED_PX_PER_SEC = 60;

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
  const { addToCart } = useShop();
  const [adding, setAdding] = useState<string | null>(null);

  useEffect(() => {
    if (reduced || products.length === 0) return;
    const track = trackRef.current;
    if (!track) return;

    const itemWidth = CARD_WIDTH + GAP;
    const halfWidth = products.length * itemWidth;

    let offset = 0;
    let rafId: number | null = null;
    let lastTime = performance.now();
    const dir = direction === "ltr" ? -1 : 1;

    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - lastTime) / 1000); // clamp dt to prevent jumps
      lastTime = now;

      if (!paused) {
        offset += dir * SPEED_PX_PER_SEC * dt;
        if (dir > 0 && offset >= halfWidth) offset -= halfWidth;
        else if (dir < 0 && offset <= -halfWidth) offset += halfWidth;
        // translate3d for GPU acceleration — prevents flickering
        track.style.transform = `translate3d(${-offset}px, 0, 0)`;
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

  const handleAddToCart = async (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    setAdding(product.id);
    try {
      await addToCart(product);
    } finally {
      setTimeout(() => setAdding(null), 600);
    }
  };

  return (
    <section
      className="py-10"
      style={{ background: "#f4f1ee", color: "#0b0a0a" }}
      aria-label={title || "Product row"}
    >
      {eyebrow || title ? (
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 mb-6">
          {eyebrow ? (
            <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "11px", fontWeight: 600, letterSpacing: "0.3em", textTransform: "uppercase", color: "#c9a227", margin: "0 0 4px 0" }}>{eyebrow}</p>
          ) : null}
          {title ? (
            <h3 style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "clamp(1.5rem, 3vw, 2.25rem)", fontWeight: 500, letterSpacing: "-0.02em", margin: 0 }}>{title}</h3>
          ) : null}
        </div>
      ) : null}

      <div
        ref={scrollRef}
        className="overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          ref={trackRef}
          className="flex"
          style={{
            width: "max-content",
            willChange: "transform",
            backfaceVisibility: "hidden",
            transform: "translate3d(0, 0, 0)", // GPU layer promotion
          }}
        >
          {allItems.map((product, i) => (
            <Link
              key={`${product.id}-${i}`}
              href={`/product/${product.slug}`}
              className="shrink-0 block no-underline group relative"
              style={{
                width: `${CARD_WIDTH}px`,
                height: `${CARD_HEIGHT}px`,
                marginRight: `${GAP}px`,
                position: "relative",
                borderRadius: "8px",
                overflow: "hidden",
                background: "#ffffff",
                boxShadow: "0 12px 30px -15px rgba(0,0,0,0.3)",
              }}
            >
              <Image
                src={absUrl(product.images[0]?.url || "")}
                alt={product.title}
                fill
                sizes="264px"
                style={{ objectFit: "cover", objectPosition: "center top" }}
                loading="lazy"
                placeholder="empty"
              />
              <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.85) 100%)" }} />
              {/* Caption — name + price */}
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <p style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "0.9rem", fontWeight: 500, lineHeight: 1.2, margin: "0 0 2px 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{product.title}</p>
                <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.8rem", fontWeight: 600, color: "#e3b867", margin: 0 }}>₹{Math.round(product.price / 100)}</p>
              </div>
              {/* Add to Bag button — slides up on hover */}
              <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-auto">
                <button
                  onClick={(e) => handleAddToCart(e, product)}
                  disabled={adding === product.id}
                  className="w-full py-3 text-center text-xs font-semibold uppercase tracking-[0.2em] text-white"
                  style={{ background: "#0b0a0a" }}
                >
                  {adding === product.id ? "Adding…" : "Add to Bag"}
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
