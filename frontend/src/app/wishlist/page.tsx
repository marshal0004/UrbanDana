"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { api, type Product } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import { Heart } from "lucide-react";

const STORAGE_KEY = "ud_wishlist";

function loadWishlist(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveWishlist(ids: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

export default function WishlistPage() {
  const [ids, setIds] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const w = loadWishlist();
    setIds(w);
    if (w.length === 0) {
      setLoading(false);
      return;
    }
    // Fetch all products, filter to wishlist
    api.listProducts({ limit: 100 })
      .then((res) => setProducts(res.items.filter((p) => w.includes(p.id))))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  function remove(id: string) {
    const next = ids.filter((x) => x !== id);
    setIds(next);
    saveWishlist(next);
    setProducts((p) => p.filter((x) => x.id !== id));
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl md:text-5xl font-black tracking-tight text-brand-black">Your Wishlist</h1>
      <p className="mt-2 text-brand-black/60">
        {loading ? "Loading…" : `${products.length} item${products.length === 1 ? "" : "s"} saved`}
      </p>

      {!loading && products.length === 0 ? (
        <div className="mt-16 text-center py-20 border border-brand-black/10 rounded-3xl bg-gray-50">
          <Heart className="w-16 h-16 mx-auto text-brand-black/20" />
          <h2 className="mt-6 text-xl font-bold text-brand-black">No saved items yet</h2>
          <p className="mt-2 text-brand-black/60 text-sm">Tap the heart icon on any product to save it here.</p>
          <Link
            href="/shop"
            className="mt-6 inline-flex items-center gap-2 bg-brand-red hover:bg-brand-red-soft transition text-brand-black text-sm font-bold uppercase tracking-widest px-8 py-3 rounded-full"
          >
            Browse Caps & Tees
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-10">
          {products.map((p) => (
            <div key={p.id} className="relative">
              <ProductCard product={p} />
              <button
                onClick={() => remove(p.id)}
                className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-brand-red text-brand-black flex items-center justify-center hover:scale-110 transition z-10"
                aria-label="Remove from wishlist"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
