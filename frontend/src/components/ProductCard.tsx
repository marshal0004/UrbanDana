"use client";
import Link from "next/link";
import { absUrl, type Product } from "@/lib/api";
import { rupee, discountPct, cn } from "@/lib/utils";
import { useShop } from "@/context/ShopContext";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { useState, useEffect } from "react";

const WISHLIST_KEY = "ud_wishlist";

const BADGE_STYLES: Record<string, string> = {
  Bestseller: "bg-brand-red text-paper",
  "Best Value": "bg-brand-gold text-brand-black",
  Limited: "bg-brand-black text-brand-cream border border-brand-cream/40",
  New: "bg-emerald-500 text-paper",
  Collector: "bg-brand-cream text-brand-black",
};

function useWishlist() {
  const [ids, setIds] = useState<string[]>([]);
  useEffect(() => {
    try {
      setIds(JSON.parse(localStorage.getItem(WISHLIST_KEY) || "[]"));
    } catch {
      setIds([]);
    }
  }, []);
  const toggle = (id: string) => {
    setIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event("wishlist-updated"));
      return next;
    });
  };
  return { ids, toggle };
}

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useShop();
  const { ids, toggle } = useWishlist();
  const liked = ids.includes(product.id);
  const discount = discountPct(product.price, product.oldPrice);
  const soldOut = product.stock === 0;
  const primaryImg = product.images?.[0]?.url;
  const hoverImg = product.images?.[1]?.url;

  return (
    <article className="group relative flex flex-col">
      <Link
        href={`/product/${product.slug}`}
        className={cn(
          "relative block aspect-[4/5] overflow-hidden rounded-2xl bg-white/5",
          soldOut && "opacity-60"
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={absUrl(primaryImg || "")}
          alt={product.title}
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-all duration-700",
            "group-hover:scale-105",
            hoverImg && "group-hover:opacity-0"
          )}
        />
        {hoverImg && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={absUrl(hoverImg)}
            alt={`${product.title} alternate view`}
            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
          />
        )}

        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.badge && (
            <span className={cn(
              "text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full",
              BADGE_STYLES[product.badge] || "bg-white/10 text-paper"
            )}>
              {product.badge}
            </span>
          )}
          {discount && (
            <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-brand-red text-paper">
              -{discount}%
            </span>
          )}
        </div>

        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(product.id); }}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-brand-black/40 backdrop-blur-md flex items-center justify-center text-paper hover:bg-brand-black/60 transition"
          aria-label="Toggle wishlist"
        >
          <Heart className={cn("w-4 h-4 transition", liked && "fill-brand-red text-brand-red")} />
        </button>

        {soldOut && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-brand-black/80 text-paper text-xs uppercase tracking-widest px-4 py-2 rounded-full">
              Sold Out
            </span>
          </div>
        )}

        {!soldOut && (
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(product); }}
            className="absolute bottom-3 left-3 right-3 bg-brand-black/85 backdrop-blur-md text-paper text-xs font-bold uppercase tracking-widest py-3 rounded-full opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2 hover:bg-brand-red"
          >
            <ShoppingBag className="w-4 h-4" />
            Add to Bag
          </button>
        )}
      </Link>

      <div className="mt-4 flex flex-col gap-1">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] uppercase tracking-widest text-paper/40">
            {product.category}
          </span>
          <span className="text-[10px] text-paper/40 flex items-center gap-1">
            <Star className="w-3 h-3 fill-brand-gold text-brand-gold" />
            {product.rating.toFixed(1)}
            <span className="opacity-50">({product.reviews})</span>
          </span>
        </div>
        <Link href={`/product/${product.slug}`}>
          <h3 className="text-sm font-semibold text-paper hover:text-brand-red transition line-clamp-1">
            {product.title}
          </h3>
        </Link>
        {product.subtitle && (
          <p className="text-xs text-paper/50 line-clamp-1">{product.subtitle}</p>
        )}
        <div className="flex items-center gap-2 mt-1">
          <span className="text-base font-bold text-paper">{rupee(product.price)}</span>
          {product.oldPrice && (
            <span className="text-xs text-paper/40 line-through">{rupee(product.oldPrice)}</span>
          )}
        </div>
      </div>
    </article>
  );
}

export { BADGE_STYLES };
