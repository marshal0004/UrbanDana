"use client";
// Promo banner with real prices (no fake strikethroughs)
import Link from "next/link";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

const PROMOS = [
  {
    title: "CAPS",
    subtitle: "₹249",
    desc: "All bandana caps",
    href: "/shop?category=Bandana Caps",
    accent: "#c8102e",
  },
  {
    title: "TEES",
    subtitle: "₹299",
    desc: "All t-shirts",
    href: "/shop?category=T-Shirts",
    accent: "#d4a017",
  },
  {
    title: "COMBO",
    subtitle: "₹548",
    desc: "Cap + Tee pack",
    href: "/shop?category=Combo",
    accent: "#10b981",
  },
  {
    title: "LIMITED",
    subtitle: "200 PCS",
    desc: "Once gone, forever gone",
    href: "/shop?category=Limited Edition",
    accent: "#a855f7",
  },
];

export default function PromoBanner() {
  const { ref, inView } = useInView();
  return (
    <section ref={ref} className="py-12 border-y border-white/10 bg-brand-dark/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {PROMOS.map((p, i) => (
            <Link
              key={p.title}
              href={p.href}
              className={cn(
                "group relative p-5 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all overflow-hidden",
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              )}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div
                className="absolute -right-8 -top-8 w-24 h-24 rounded-full opacity-20 blur-2xl group-hover:opacity-40 transition"
                style={{ backgroundColor: p.accent }}
              />
              <p className="text-[10px] uppercase tracking-[0.3em] font-bold" style={{ color: p.accent }}>
                {p.title}
              </p>
              <p className="mt-2 text-2xl font-black text-paper">{p.subtitle}</p>
              <p className="mt-1 text-xs text-paper/60">{p.desc}</p>
              <div className="mt-3 inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-paper/60 group-hover:text-paper transition">
                Shop <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
