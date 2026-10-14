"use client";
import Link from "next/link";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

// Real product photos from frontend/public/images/
const CATEGORIES = [
  {
    title: "Bandana Caps",
    desc: "The original 3-in-1",
    href: "/shop?category=Bandana Caps",
    image: "/images/cat-caps.jpg",
    span: "lg:col-span-2 lg:row-span-2",
  },
  {
    title: "T-Shirts",
    desc: "Bandana-inspired tees",
    href: "/shop?category=T-Shirts",
    image: "/images/cat-tshirts.jpg",
    span: "",
  },
  {
    title: "Visors",
    desc: "Minimal everyday shade",
    href: "/shop?category=Visors",
    image: "/images/cat-visors.jpg",
    span: "",
  },
  {
    title: "Limited Edition",
    desc: "200-piece drops · No restocks",
    href: "/shop?category=Limited Edition",
    image: "/images/cat-limited.jpg",
    span: "",
  },
  {
    title: "Combo",
    desc: "Cap + Tee packs",
    href: "/shop?category=Combo",
    image: "/images/cat-bundles.jpg",
    span: "",
  },
];

export default function CategoriesGrid() {
  const { ref, inView } = useInView();
  return (
    <section ref={ref} className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={cn("flex items-end justify-between gap-4 mb-12 transition-all duration-700", inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6")}>
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-brand-red mb-3 font-semibold">Shop by Category</p>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight text-paper">Find your fit.</h2>
          </div>
          <Link
            href="/shop"
            className="hidden md:inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-paper/70 hover:text-paper transition"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 gap-4 lg:gap-5 lg:h-[640px]">
          {CATEGORIES.map((cat, i) => (
            <Link
              key={cat.title}
              href={cat.href}
              className={cn(
                "group relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 transition-all duration-700",
                cat.span,
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="absolute inset-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/30 to-transparent" />
              </div>
              <div className="relative h-full min-h-[200px] lg:min-h-0 p-6 flex flex-col justify-end">
                <p className="text-[10px] uppercase tracking-[0.3em] text-brand-red font-bold mb-2 opacity-90">
                  Shop now
                </p>
                <h3 className="text-2xl md:text-3xl font-black text-paper">{cat.title}</h3>
                <p className="text-sm text-paper/70 mt-1">{cat.desc}</p>
                <div className="mt-3 inline-flex items-center gap-1 text-xs uppercase tracking-widest text-paper/70 group-hover:text-brand-red transition">
                  Explore <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
