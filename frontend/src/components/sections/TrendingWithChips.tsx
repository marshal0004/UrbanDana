"use client";
import { useEffect, useState, useMemo } from "react";
import { api, type Product } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Snitch-style TRENDING section with chip filter rail
const CHIPS = [
  { v: "ALL", label: "All", filter: (_p: Product) => true },
  { v: "CAPS", label: "Caps", filter: (p: Product) => p.category === "Bandana Caps" || p.category === "Visors" },
  { v: "TEES", label: "T-Shirts", filter: (p: Product) => p.category === "T-Shirts" },
  { v: "LIMITED", label: "Limited", filter: (p: Product) => p.category === "Limited Edition" },
  { v: "BUNDLES", label: "Bundles", filter: (p: Product) => p.category === "Bundles" },
  { v: "BESTSELLER", label: "Bestsellers", filter: (p: Product) => p.badge === "Bestseller" || p.badge === "Best Value" },
];

export default function TrendingWithChips() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeChip, setActiveChip] = useState("ALL");
  const { ref, inView } = useInView();

  useEffect(() => {
    api.listProducts({ limit: 50 })
      .then((res) => setProducts(res.items))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const chip = CHIPS.find((c) => c.v === activeChip);
    if (!chip) return products;
    return products.filter(chip.filter).slice(0, 8);
  }, [products, activeChip]);

  return (
    <section ref={ref} className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={cn("flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 transition-all duration-700", inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6")}>
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-brand-red mb-3 font-semibold">Trending Now</p>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight text-paper">Loved by everyone.</h2>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-paper/70 hover:text-paper transition group"
          >
            View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </Link>
        </div>

        {/* Snitch-style chip rail */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 mb-8 border-b border-white/10">
          {CHIPS.map((chip) => (
            <button
              key={chip.v}
              onClick={() => setActiveChip(chip.v)}
              className={cn(
                "px-5 py-2.5 text-xs font-bold uppercase tracking-widest rounded-full transition whitespace-nowrap",
                activeChip === chip.v
                  ? "bg-brand-red text-paper"
                  : "bg-white/5 text-paper/60 hover:text-paper hover:bg-white/10"
              )}
            >
              {chip.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-10">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i}>
                <div className="aspect-[4/5] rounded-2xl bg-white/5 animate-pulse" />
                <div className="mt-4 h-3 bg-white/5 rounded animate-pulse" />
                <div className="mt-2 h-3 w-2/3 bg-white/5 rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-10">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
