// /home/z/my-project/UrbanDana/frontend/src/components/ProductCarousel.tsx
"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { absUrl, type Product } from "@/lib/api";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductCarouselProps {
  products: Product[];
  title?: string;
  eyebrow?: string;
  autoScroll?: boolean;
}

export default function ProductCarousel({
  products,
  autoScroll = true,
}: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [cardWidth, setCardWidth] = useState(380);

  // ---- Layout constants (kept in ONE place so JSX & scroll math stay in sync) ----
  const GAP = 24;           // gap between cards        (was 16)  ← increased per request
  const SIDE_PADDING = 24;  // outer L/R padding         (was 12)  ← increased per request
  const CARD_PADDING = 20;  // image inset from card edge (was 10) ← +10px per side per request

  useEffect(() => {
    const calcWidth = () => {
      const vw = window.innerWidth;
      // Available width inside the outer container.
      const available = vw - 2 * SIDE_PADDING;
      // EXACTLY 3 cards must fit: 3*cardWidth + 2*GAP = available.
      // The 4th card will start at (available + GAP) → fully clipped by overflow-x.
      // Subtract 1px safety to absorb sub-pixel rounding so the 4th card NEVER peeks.
      let w = Math.floor((available - 2 * GAP) / 3) - 1;
      if (vw < 640) w = Math.floor(vw * 0.72); // Mobile: ~1 card view
      setCardWidth(Math.max(160, w));
    };
    calcWidth();
    window.addEventListener("resize", calcWidth);
    return () => window.removeEventListener("resize", calcWidth);
  }, []);

  useEffect(() => {
    if (!autoScroll || paused || !scrollRef.current) return;
    const interval = setInterval(() => {
      const el = scrollRef.current;
      if (!el) return;
      // Move exactly one card per tick: cardWidth + GAP
      const scrollAmount = cardWidth + GAP;
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 10) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [autoScroll, paused, cardWidth]);

  const scrollByDir = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = cardWidth + GAP;
    el.scrollBy({
      left: dir === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  if (!products.length) return null;

  return (
    <section
      className="py-10 bg-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="mx-auto"
        style={{ maxWidth: "100%", padding: `0 ${SIDE_PADDING}px` }}
      >
        <div className="flex justify-end gap-2 mb-3 px-2">
          <button
            onClick={() => scrollByDir("left")}
            className="w-9 h-9 rounded-full bg-brand-black/5 hover:bg-brand-red hover:text-paper text-brand-black transition flex items-center justify-center"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scrollByDir("right")}
            className="w-9 h-9 rounded-full bg-brand-black/5 hover:bg-brand-red hover:text-paper text-brand-black transition flex items-center justify-center"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div
          ref={scrollRef}
          className="flex overflow-x-auto no-scrollbar scroll-smooth pb-2"
          style={{
            gap: `${GAP}px`,
            scrollSnapType: "x mandatory",
            scrollbarWidth: "none",
          }}
        >
          {products.map((product) => {
            const primaryImg = product.images?.[0]?.url;
            return (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                className="group relative shrink-0 block overflow-hidden rounded-xl transition-all duration-300 hover:shadow-xl"
                style={{
                  width: `${cardWidth}px`,
                  scrollSnapAlign: "start",
                  padding: `${CARD_PADDING}px`,
                }}
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-gray-50 rounded-lg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={absUrl(primaryImg || "")}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
