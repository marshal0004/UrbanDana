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
  title,
  eyebrow,
  autoScroll = true,
}: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [cardWidth, setCardWidth] = useState(600);

  // Calculate card width — ~45% of viewport, so 2-3 cards visible
  useEffect(() => {
    const calcWidth = () => {
      const vw = window.innerWidth;
      let w;
      // 3 cards visible: ~30% of viewport each (was 45%)
      if (vw >= 1024) w = Math.min(420, vw * 0.30);
      else if (vw >= 640) w = vw * 0.45;
      else w = vw * 0.75;
      setCardWidth(Math.max(220, Math.floor(w)));
    };
    calcWidth();
    window.addEventListener("resize", calcWidth);
    return () => window.removeEventListener("resize", calcWidth);
  }, []);

  // Auto-scroll — 3 seconds
  useEffect(() => {
    if (!autoScroll || paused || !scrollRef.current) return;
    const interval = setInterval(() => {
      const el = scrollRef.current;
      if (!el) return;
      const gap = 12;
      const scrollAmount = cardWidth + gap;
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
    const gap = 12;
    const scrollAmount = (cardWidth + gap) * 1;
    el.scrollBy({ left: dir === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
  };

  if (!products.length) return null;

  return (
    <section
      className="py-10 bg-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mx-auto" style={{ maxWidth: "100%", padding: "0 12px" }}>
        {/* Headings removed per user request — just arrows on right */}
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
          className="flex gap-3 overflow-x-auto no-scrollbar scroll-smooth pb-2"
          style={{ scrollSnapType: "x mandatory", scrollbarWidth: "none" }}
        >
          {products.map((product) => {
            const primaryImg = product.images?.[0]?.url;
            return (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                className="group relative shrink-0 block overflow-hidden rounded-xl transition-all duration-300 hover:shadow-xl"
                style={{ width: `${cardWidth}px`, scrollSnapAlign: "start" }}
              >
                {/* Image — 4:5 portrait (taller), large and prominent. Pure content, no overlays. */}
                <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={absUrl(primaryImg || "")}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Subtle gradient at bottom for title readability */}
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  {/* Title overlay on image — pure content, nothing else */}
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <h3 className="text-lg md:text-xl font-black text-paper drop-shadow-lg line-clamp-2">
                      {product.title}
                    </h3>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
