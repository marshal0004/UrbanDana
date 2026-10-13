"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { api, type Product } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { ref, inView } = useInView();

  useEffect(() => {
    api.listProducts({ featured: true, limit: 8 })
      .then((res) => setProducts(res.items))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section ref={ref} className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-6 mb-12">
          <div className={cn("transition-all duration-700", inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6")}>
            <p className="text-xs uppercase tracking-[0.4em] text-brand-red mb-4 font-semibold">
              The Drop
            </p>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight text-paper">
              Featured Caps
            </h2>
            <p className="mt-3 text-paper/60 max-w-md">
              Handpicked from this week&apos;s drop. Once they&apos;re gone, they&apos;re gone.
            </p>
          </div>
          <Link
            href="/shop"
            className="group hidden md:inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-paper hover:text-brand-red transition"
          >
            View All
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-10">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[4/5] rounded-2xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-10">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

        <div className="mt-12 text-center md:hidden">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-brand-red hover:bg-brand-red-soft text-paper text-sm font-bold uppercase tracking-widest px-8 py-4 rounded-full transition"
          >
            View All Caps
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
