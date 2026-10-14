"use client";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { api, absUrl, type Product } from "@/lib/api";
import { rupee, cn } from "@/lib/utils";
import { useShop } from "@/context/ShopContext";
import { Heart, ShoppingBag, Star } from "lucide-react";

const WISHLIST_KEY = "ud_wishlist";

const BADGE_STYLES: Record<string, string> = {
  Bestseller: "bg-brand-red text-paper",
  "Best Value": "bg-brand-gold text-brand-black",
  Limited: "bg-brand-black text-brand-cream border border-brand-cream/40",
  New: "bg-emerald-500 text-paper",
  Collector: "bg-brand-cream text-brand-black",
};

const CATEGORIES = ["All", "Bandana Caps", "T-Shirts", "Visors", "Limited Edition", "Combo"];

export default function FullStore() {
  const { addToCart } = useShop();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    api.listProducts({ limit: 100 })
      .then((res) => setProducts(res.items))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

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

  const filtered = useMemo(() => {
    if (category === "All") return products;
    return products.filter((p) => p.category === category);
  }, [products, category]);

  return (
    <section className="py-12 bg-brand-cream">
      <div className="mx-auto" style={{ maxWidth: "100%", padding: "0 12px" }}>
        <div className="mb-8 px-2">
          <p className="text-xs uppercase tracking-[0.4em] text-brand-red mb-2 font-semibold">
            The Full Store
          </p>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-brand-black">
            All Products
          </h2>
          <p className="mt-2 text-brand-black/60">
            {loading ? "Loading…" : `${filtered.length} products available`}
          </p>
        </div>

        {/* Category chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-6 px-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={cn(
                "px-4 py-2 text-xs uppercase tracking-widest rounded-full transition whitespace-nowrap font-semibold border-2",
                category === c
                  ? "bg-brand-red text-paper border-brand-red"
                  : "bg-white text-brand-black/70 border-brand-black/10 hover:border-brand-red"
              )}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Product grid — light theme, red/black borders, tight gap */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 px-2">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="aspect-[4/5] rounded-2xl bg-white animate-pulse border-2 border-brand-black/5" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 px-2">
            {filtered.map((product) => {
              const liked = wishlist.includes(product.id);
              const soldOut = product.stock === 0;
              const primaryImg = product.images?.[0]?.url;
              return (
                <article
                  key={product.id}
                  className="group relative bg-white rounded-2xl border-2 border-brand-red/20 hover:border-brand-red hover:shadow-lg hover:shadow-brand-red/20 transition-all duration-300 overflow-hidden"
                >
                  <Link
                    href={`/product/${product.slug}`}
                    className={cn(
                      "relative block aspect-[4/5] overflow-hidden bg-brand-cream",
                      soldOut && "opacity-60"
                    )}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={absUrl(primaryImg || "")}
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {product.badge && (
                        <span className={cn(
                          "text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full",
                          BADGE_STYLES[product.badge] || "bg-white/80 text-brand-black"
                        )}>
                          {product.badge}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={(e) => { e.preventDefault(); toggleWishlist(product.id); }}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-brand-black hover:bg-white transition"
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

                    {!soldOut && (
                      <button
                        onClick={(e) => { e.preventDefault(); addToCart(product); }}
                        className="absolute bottom-2 left-2 right-2 bg-brand-black/90 backdrop-blur-md text-paper text-[11px] font-bold uppercase tracking-widest py-2.5 rounded-full opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center gap-1.5 hover:bg-brand-red"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        Add to Bag
                      </button>
                    )}
                  </Link>

                  <div className="p-3">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[9px] uppercase tracking-widest text-brand-black/50 font-semibold">
                        {product.category}
                      </span>
                      <span className="text-[9px] text-brand-black/50 flex items-center gap-0.5">
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
                      <p className="text-[11px] text-brand-black/60 line-clamp-1 mt-0.5">{product.subtitle}</p>
                    )}
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="text-base font-black text-brand-red">{rupee(product.price)}</span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="py-12 text-center text-brand-black/60 px-2">
            No products in this category.
          </div>
        )}
      </div>
    </section>
  );
}
