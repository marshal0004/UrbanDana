"use client";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";

const STYLES = [
  {
    n: "01",
    title: "Forward",
    desc: "The classic. Visor front, knot at the back. Clean everyday look that pairs with everything.",
    img: "/images/style-forward.jpg",
  },
  {
    n: "02",
    title: "Backward",
    desc: "Flip it. Knot up front. Bold street energy. The visor frames the back of your head.",
    img: "/images/style-backward.jpg",
  },
  {
    n: "03",
    title: "Folded Low",
    desc: "Fold the bandana into a low band. Minimal. Retro. Ultra-breathable for hot days.",
    img: "/images/style-folded.jpg",
  },
];

/**
 * One Cap · Three Looks — placed AFTER Founder section.
 *
 * Card layout requirements:
 *   - Card width  +10% (was ~411px @ max-w-7xl/gap-6 → now ~452px @ max-w-[1400px]/gap-6)
 *   - Card height +10% (was aspect-[4/5] → 513px tall → now 565px tall)
 *   - 80% of card height = image area (object-cover, no overflow)
 *   - 20% of card height = details area (Style tag + Title + Description)
 *
 * Math:
 *   max-w-[1400px] = 1400px container (10% wider than 1280px)
 *   gap-6 = 24px between cards → 3 cards × 452px + 2 × 24px = 1404px (≈ container)
 *   Card height = 565px (10% taller than 513px)
 *   Image area = 80% × 565px = 452px tall
 *   Details area = 20% × 565px = 113px tall
 */
export default function ThreeStyles() {
  const { ref, inView } = useInView();
  return (
    <section ref={ref} className="py-16 md:py-24 bg-brand-cream">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className={cn("max-w-2xl transition-all duration-700", inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6")}>
          <p className="text-xs uppercase tracking-[0.4em] text-brand-red mb-3 font-semibold">
            One Cap · Three Looks
          </p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-brand-black">
            Why buy three caps when one does it all?
          </h2>
          <p className="mt-4 text-brand-black/60 text-lg leading-relaxed">
            The bandana knot-tie lets you switch styles in seconds. From street to minimal to bold —
            Urbandana bends to your mood, not the other way round.
          </p>
        </div>

        {/* 3 cards — 10% wider (max-w-[1400px]) + 10% taller (565px) + 80/20 split */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {STYLES.map((s, i) => (
            <article
              key={s.n}
              className={cn(
                "group relative flex flex-col overflow-hidden rounded-2xl bg-white border border-brand-black/10 transition-all duration-700 hover:shadow-xl",
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              )}
              style={{
                transitionDelay: `${i * 120}ms`,
                height: "565px",
              }}
            >
              {/* Top 80% — image fills completely, no overflow */}
              <div
                className="relative overflow-hidden bg-gray-50"
                style={{ height: "80%" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.img}
                  alt={`${s.title} style — Urbandana bandana cap`}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  loading="lazy"
                />
              </div>

              {/* Bottom 20% — details: Style tag + Title + Description */}
              <div
                className="flex flex-col justify-center px-5 py-4 bg-white"
                style={{ height: "20%" }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs uppercase tracking-[0.4em] text-brand-gold font-bold whitespace-nowrap">
                    Style {s.n}
                  </span>
                  <span className="h-px flex-1 bg-brand-black/10" />
                  <span className="text-xs uppercase tracking-[0.2em] text-brand-black/40 font-semibold whitespace-nowrap">
                    Convertible
                  </span>
                </div>
                <h3 className="mt-2 text-2xl font-black text-brand-black leading-tight">
                  {s.title}
                </h3>
                <p className="mt-1 text-sm text-brand-black/60 leading-snug line-clamp-2">
                  {s.desc}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
