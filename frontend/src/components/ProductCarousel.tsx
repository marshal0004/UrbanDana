"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { absUrl, type Product } from "@/lib/api";
import { rupee, cn } from "@/lib/utils";
import { useShop } from "@/context/ShopContext";
import { Heart, ShoppingBag, Star, ChevronLeft, ChevronRight } from "lucide-react";

const WISHLIST_KEY = "ud_wishlist";

const BADGE_STYLES: Record<string, string> = {
  Bestseller: "bg-brand-red text-paper",
  "Best Value": "bg-brand-gold text-brand-black",
  Limited: "bg-brand-black text-brand-cream border border-brand-cream/40",
  New: "bg-emerald-500 text-paper",
  Collector: "bg-brand-cream text-brand-black",
};

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
  const { addToCart } = useShop();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [cardWidth, setCardWidth] = useState(600);

  useEffect(() => {
    try {
      setWishlist(JSON.parse(localStorage.getItem(WISHLIST_KEY) || "[]"));
    } catch {
      setWishlist([]);
    }
    const onUpdate = () => {
      try {
        setWishlist(JSON.parse(localStorage.getItem(WISHLIST_KEY) || "[]"));
      } catch {
        setWishlist([]);
      }
    };
    window.addEventListener("wishlist-updated", onUpdate);
    return () => window.removeEventListener("wishlist-updated", onUpdate);
  }, []);

  // Calculate card width — ~45% of viewport, so 2-3 cards visible
  useEffect(() => {
    const calcWidth = () => {
      const vw = window.innerWidth;
      // On desktop: ~45% of viewport (2 cards visible + partial 3rd)
      // On tablet: ~60% (1.5 cards visible)
      // On mobile: ~80% (1 card + peek)
      let w;
      if (vw >= 1024) w = Math.min(620, vw * 0.45);
      else if (vw >= 640) w = vw * 0.6;
      else w = vw * 0.8;
      setCardWidth(Math.max(280, Math.floor(w)));
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
        {(title || eyebrow) && (
          <div className="flex items-end justify-between gap-4 mb-5 px-2">
            <div>
              {eyebrow && (
                <p className="text-xs uppercase tracking-[0.4em] text-brand-red mb-1.5 font-semibold">
                  {eyebrow}
                </p>
              )}
              {title && (
                <h2 className="text-3xl md:text-4xl font-black tracking-tight text-brand-black">
                  {title}
                </h2>
              )}
            </div>
            <div className="flex gap-2">
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
          </div>
        )}

        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto no-scrollbar scroll-smooth pb-2"
          style={{ scrollSnapType: "x mandatory", scrollbarWidth: "none" }}
        >
          {products.map((product) => {
            const liked = wishlist.includes(product.id);
            const soldOut = product.stock === 0;
            const primaryImg = product.images?.[0]?.url;
            return (
              <article
                key={product.id}
                className="group relative shrink-0 bg-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl"
                style={{ width: `${cardWidth}px`, scrollSnapAlign: "start" }}
              >
                {/* Image — 4:5 portrait (taller), large and prominent */}
                <Link href={`/product/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden bg-gray-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={absUrl(primaryImg || "")}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Badges — top-left */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    {product.badge && (
                      <span className={cn(
                        "text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded",
                        BADGE_STYLES[product.badge] || "bg-white/90 text-brand-black"
                      )}>
                        {product.badge}
                      </span>
                    )}
                  </div>

                  {/* Wishlist — top-right */}
                  <button
                    onClick={(e) => { e.preventDefault(); toggleWishlist(product.id); }}
                    className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-brand-black hover:bg-white transition"
                    aria-label="Toggle wishlist"
                  >
                    <Heart className={cn("w-4 h-4", liked && "fill-brand-red text-brand-red")} />
                  </button>

                  {soldOut && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/60">
                      <span className="bg-brand-black text-paper text-[11px] uppercase tracking-widest px-4 py-2 rounded-full">
                        Sold Out
                      </span>
                    </div>
                  )}

                  {/* Quick add — slides up on hover */}
                  {!soldOut && (
                    <button
                      onClick={(e) => { e.preventDefault(); addToCart(product); }}
                      className="absolute bottom-3 left-3 right-3 bg-brand-red text-paper text-xs font-bold uppercase tracking-widest py-3 rounded-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2 hover:bg-brand-black"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      Add to Bag
                    </button>
                  )}
                </Link>

                {/* Info — below image, fits properly */}
                <div className="p-4">
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span className="text-[10px] uppercase tracking-widest text-brand-black/40 font-semibold">
                      {product.category}
                    </span>
                    <span className="text-[10px] text-brand-black/40 flex items-center gap-0.5">
                      <Star className="w-3 h-3 fill-brand-gold text-brand-gold" />
                      {product.rating.toFixed(1)}
                    </span>
                  </div>
                  <Link href={`/product/${product.slug}`}>
                    <h3 className="text-base font-bold text-brand-black hover:text-brand-red transition line-clamp-1">
                      {product.title}
                    </h3>
                  </Link>
                  {product.subtitle && (
                    <p className="text-xs text-brand-black/50 line-clamp-1 mt-0.5">{product.subtitle}</p>
                  )}
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="text-xl font-black text-brand-red">{rupee(product.price)}</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
