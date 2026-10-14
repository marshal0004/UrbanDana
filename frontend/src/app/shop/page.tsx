"use client";
import { useEffect, useState, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api, type Product } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import { cn } from "@/lib/utils";
import { SlidersHorizontal } from "lucide-react";

const CATEGORIES = ["All", "Bandana Caps", "T-Shirts", "Visors", "Limited Edition", "Combo"];
const SORTS = [
  { v: "newest", l: "Newest" },
  { v: "price-asc", l: "Price: Low to High" },
  { v: "price-desc", l: "Price: High to Low" },
  { v: "rating", l: "Top Rated" },
];

function ShopClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get("category") || "All";
  const urlQuery = searchParams.get("q") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(urlCategory);
  const [sort, setSort] = useState("newest");

  // Sync category state when URL changes (e.g., user clicks a nav link)
  useEffect(() => {
    setCategory(urlCategory);
  }, [urlCategory]);

  // Fetch products when category or query changes
  useEffect(() => {
    setLoading(true);
    const params: Record<string, string> = {};
    if (category !== "All") params.category = category;
    if (urlQuery) params.q = urlQuery;
    api.listProducts(params)
      .then((res) => setProducts(res.items))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, [category, urlQuery]);

  // Update URL when category chip changes (local state → URL)
  useEffect(() => {
    const params = new URLSearchParams();
    if (category !== "All") params.set("category", category);
    if (urlQuery) params.set("q", urlQuery);
    const qs = params.toString();
    const target = `/shop${qs ? `?${qs}` : ""}`;
    // Only replace if different to avoid loops
    if (window.location.pathname + window.location.search !== target) {
      router.replace(target, { scroll: false });
    }
  }, [category, urlQuery, router]);

  const sorted = useMemo(() => {
    const arr = [...products];
    if (sort === "price-asc") arr.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") arr.sort((a, b) => b.price - a.price);
    else if (sort === "rating") arr.sort((a, b) => b.rating - a.rating);
    return arr;
  }, [products, sort]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <p className="text-xs uppercase tracking-[0.4em] text-brand-red mb-3 font-semibold">
          The Shop
        </p>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-brand-black">
          {category === "All" ? (urlQuery ? `Search: "${urlQuery}"` : "All Products") : category}
        </h1>
        <p className="mt-3 text-brand-black/60">
          {loading ? "Loading…" : `${sorted.length} ${sorted.length === 1 ? "item" : "items"} available`}
        </p>
      </div>

      <div className="flex items-center justify-between gap-4 mb-8 pb-4 border-b border-brand-black/10">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={cn(
                "px-4 py-2 text-xs uppercase tracking-widest rounded-full transition whitespace-nowrap",
                category === c
                  ? "bg-brand-red text-brand-black"
                  : "bg-gray-50 text-brand-black/60 hover:text-brand-black hover:bg-gray-100"
              )}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            className="lg:hidden p-2 text-brand-black/60 hover:text-brand-black"
            aria-label="Filters"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-gray-50 border border-brand-black/10 text-brand-black text-xs uppercase tracking-widest rounded-full px-4 py-2 focus:outline-none focus:border-brand-red cursor-pointer"
          >
            {SORTS.map((s) => (
              <option key={s.v} value={s.v} className="bg-brand-dark text-brand-black">
                {s.l}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-10">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i}>
              <div className="aspect-[4/5] rounded-2xl bg-gray-50 animate-pulse" />
              <div className="mt-4 h-3 bg-gray-50 rounded animate-pulse" />
              <div className="mt-2 h-3 w-2/3 bg-gray-50 rounded animate-pulse" />
            </div>
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-brand-black/60">No products found.</p>
          <button
            onClick={() => setCategory("All")}
            className="mt-4 text-sm text-brand-red hover:underline"
          >
            View all products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-10">
          {sorted.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-brand-black/60">Loading shop…</div>}>
      <ShopClient />
    </Suspense>
  );
}
