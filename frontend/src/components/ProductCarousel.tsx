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

  const toggleWishlist = (id: string) => {
    setWishlist((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event("wishlist-updated"));
      return next;
    });
  };

  // Auto-scroll — 3 seconds (was 3.5)
  useEffect(() => {
    if (!autoScroll || paused || !scrollRef.current) return;
    const interval = setInterval(() => {
      const el = scrollRef.current;
      if (!el) return;
      // Scroll by one card width (~320px + gap)
      const cardWidth = 320 + 12;
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 10) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: cardWidth, behavior: "smooth" });
      }
    }, 3000); // 3 seconds
    return () => clearInterval(interval);
  }, [autoScroll, paused]);

  const scrollByDir = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = 320 + 12;
    el.scrollBy({ left: dir === "left" ? -cardWidth * 2 : cardWidth * 2, behavior: "smooth" });
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
                style={{ width: "320px", scrollSnapAlign: "start" }}
              >
                {/* Image — large, full-bleed, square-ish aspect */}
                <Link href={`/product/${product.slug}`} className="relative block aspect-square overflow-hidden bg-gray-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={absUrl(primaryImg || "")}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Badges — top-left, minimal */}
                  <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                    {product.badge && (
                      <span className={cn(
                        "text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded",
                        BADGE_STYLES[product.badge] || "bg-white/90 text-brand-black"
                      )}>
                        {product.badge}
                      </span>
                    )}
                  </div>

                  {/* Wishlist — top-right, subtle */}
                  <button
                    onClick={(e) => { e.preventDefault(); toggleWishlist(product.id); }}
                    className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-brand-black hover:bg-white transition"
                    aria-label="Toggle wishlist"
                  >
                    <Heart className={cn("w-4 h-4", liked && "fill-brand-red text-brand-red")} />
                  </button>

                  {soldOut && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/60">
                      <span className="bg-brand-black text-paper text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full">
                        Sold Out
                      </span>
                    </div>
                  )}

                  {/* Quick add — slides up on hover, Bewakoof-style */}
                  {!soldOut && (
                    <button
                      onClick={(e) => { e.preventDefault(); addToCart(product); }}
                      className="absolute bottom-2.5 left-2.5 right-2.5 bg-brand-red text-paper text-[11px] font-bold uppercase tracking-widest py-2.5 rounded-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center gap-1.5 hover:bg-brand-black"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      Add to Bag
                    </button>
                  )}
                </Link>

                {/* Info — minimal, clean, below image */}
                <div className="p-3">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[9px] uppercase tracking-widest text-brand-black/40 font-semibold">
                      {product.category}
                    </span>
                    <span className="text-[9px] text-brand-black/40 flex items-center gap-0.5">
                      <Star className="w-2.5 h-2.5 fill-brand-gold text-brand-gold" />
                      {product.rating.toFixed(1)}
                    </span>
                  </div>
                  <Link href={`/product/${product.slug}`}>
                    <h3 className="text-sm font-bold text-brand-black hover:text-brand-red transition line-clamp-1">
                      {product.title}
                    </h3>
                  </Link>
                  {product.subtitle && (
                    <p className="text-[11px] text-brand-black/50 line-clamp-1 mt-0.5">{product.subtitle}</p>
                  )}
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="text-lg font-black text-brand-red">{rupee(product.price)}</span>
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
