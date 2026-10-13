"use client";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";

const STYLES = [
  {
    n: "01",
    title: "Forward",
    desc: "The classic. Visor front, knot at the back. Clean everyday look that pairs with everything.",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80&auto=format&fit=crop",
  },
  {
    n: "02",
    title: "Backward",
    desc: "Flip it. Knot up front. Bold street energy. The visor frames the back of your head.",
    img: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=800&q=80&auto=format&fit=crop",
  },
  {
    n: "03",
    title: "Folded Low",
    desc: "Fold the bandana into a low band. Minimal. Retro. Ultra-breathable for hot days.",
    img: "https://images.unsplash.com/photo-1488161628813-04466f872be2?w=800&q=80&auto=format&fit=crop",
  },
];

export default function ThreeStyles() {
  const { ref, inView } = useInView();
  return (
    <section ref={ref} className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={cn("max-w-2xl transition-all duration-700", inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6")}>
          <p className="text-xs uppercase tracking-[0.4em] text-brand-red mb-4 font-semibold">
            One Cap · Three Looks
          </p>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight text-paper">
            Why buy three caps when one does it all?
          </h2>
          <p className="mt-5 text-paper/60 text-lg leading-relaxed">
            The bandana knot-tie lets you switch styles in seconds. From street to minimal to bold —
            Urbandana bends to your mood, not the other way round.
          </p>
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-6">
          {STYLES.map((s, i) => (
            <article
              key={s.n}
              className={cn(
                "group relative overflow-hidden rounded-3xl bg-white/5 border border-white/10 transition-all duration-700",
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              )}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              <div className="aspect-[4/5] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.img}
                  alt={s.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/30 to-transparent" />
              </div>
              <div className="absolute inset-0 p-7 flex flex-col justify-end">
                <span className="text-xs uppercase tracking-[0.4em] text-brand-red font-bold">
                  Style {s.n}
                </span>
                <h3 className="mt-2 text-3xl font-black text-paper">{s.title}</h3>
                <p className="mt-3 text-sm text-paper/70 leading-relaxed">{s.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
