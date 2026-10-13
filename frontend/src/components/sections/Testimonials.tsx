"use client";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";
import { Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Aarav S.",
    city: "Mumbai",
    rating: 5,
    text: "Genuinely the most versatile cap I own. I wear it forward to work, backward to gigs, and folded low on Sundays. Three caps in one — genius.",
    product: "Signature Red Paisley",
  },
  {
    name: "Riya M.",
    city: "Bengaluru",
    rating: 5,
    text: "The Sunset Art cap is unreal in person. The hand-drawn sun motif gets stopped on the street. Worth every rupee — and only 200 made!",
    product: "Sunset Art Cap",
  },
  {
    name: "Karan D.",
    city: "Delhi",
    rating: 5,
    text: "Finally a cap that breathes. I sweat through normal caps in summer — the bandana top lets air in. My go-to for cricket matches.",
    product: "Café Culture Black",
  },
  {
    name: "Ananya P.",
    city: "Pune",
    rating: 4,
    text: "Bought the Visor Duo for me and my partner. Quality is incredible for the price. Adjustable strap fits both our heads perfectly.",
    product: "Visor Duo Pack",
  },
  {
    name: "Vikram J.",
    city: "Jaipur",
    rating: 5,
    text: "Got the Collector's Set as a gift. The wooden box, the numbered certificate — felt like opening a luxury watch. Caps look even better in person.",
    product: "Collector's Full Set",
  },
];

export default function Testimonials() {
  const { ref, inView } = useInView();
  return (
    <section ref={ref} className="py-24 md:py-32 bg-brand-dark/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={cn("text-center max-w-2xl mx-auto transition-all duration-700", inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6")}>
          <p className="text-xs uppercase tracking-[0.4em] text-brand-red mb-4 font-semibold">
            Loved across India
          </p>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight text-paper">
            700+ happy heads.
            <br />
            <span className="text-brand-red">4.8★</span> average rating.
          </h2>
        </div>

        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <article
              key={t.name}
              className={cn(
                "p-7 rounded-3xl bg-white/5 border border-white/10 transition-all duration-700",
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              )}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <span key={idx} className={idx < t.rating ? "text-brand-gold" : "text-paper/20"}>★</span>
                ))}
              </div>
              <Quote className="w-6 h-6 text-brand-red/40 mb-3" />
              <p className="text-paper/85 text-sm leading-relaxed">{t.text}</p>
              <div className="mt-5 pt-5 border-t border-white/10">
                <p className="text-sm font-semibold text-paper">{t.name}</p>
                <p className="text-xs text-paper/40">
                  {t.city} · bought {t.product}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
