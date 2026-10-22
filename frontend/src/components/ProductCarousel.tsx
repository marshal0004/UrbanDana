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

  useEffect(() => {
    const calcWidth = () => {
      const vw = window.innerWidth;
      let w;
      // 3 cards visible: ~28% of viewport each (10% smaller than previous 30%)
      if (vw >= 1024) w = Math.min(380, vw * 0.28);
      else if (vw >= 640) w = vw * 0.42;
      else w = vw * 0.72;
      setCardWidth(Math.max(200, Math.floor(w)));
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
                <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
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
