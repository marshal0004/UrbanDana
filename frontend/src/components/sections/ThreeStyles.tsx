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
 * Card layout (matches the design reference exactly):
 *   - Container widened ~10%:  max-w-[1400px] (was max-w-7xl = 1280px)
 *   - Card height +10%:        565px (was ~513px via aspect-[4/5])
 *   - Top 80% (452px) = IMAGE area  → bg-white, image object-cover fills 100%
 *   - Bottom 20% (113px) = DETAILS  → bg-brand-black (#0a0a0a) with WHITE text
 *
 * Visual split is a HARD EDGE — no gradient, no border line — just a clean
 * color transition between the light image area and the dark details area.
 *
 * Details typography:
 *   - "STYLE 01"  → small GOLD uppercase (text-brand-gold)
 *   - "Forward"   → large BOLD WHITE (text-paper)
 *   - Description → small white/80
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
                "group flex flex-col overflow-hidden rounded-2xl bg-white border border-brand-black/10 transition-all duration-700 hover:shadow-xl",
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              )}
              style={{
                transitionDelay: `${i * 120}ms`,
                height: "565px",
              }}
            >
              {/* TOP 80% — IMAGE area: white bg, image fills completely (object-cover, no overflow) */}
              <div
                className="relative w-full overflow-hidden bg-white"
                style={{ height: "80%" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.img}
                  alt={`${s.title} style — Urbandana bandana cap`}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* BOTTOM 20% — DETAILS area: DARK CHARCOAL bg, WHITE text, hard edge (no border line) */}
              <div
                className="flex flex-col justify-center px-5 bg-brand-black"
                style={{ height: "20%" }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs uppercase tracking-[0.4em] text-brand-gold font-bold whitespace-nowrap">
                    Style {s.n}
                  </span>
                  <span className="h-px flex-1 bg-white/15" />
                  <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-semibold whitespace-nowrap">
                    Convertible
                  </span>
                </div>
                <h3 className="mt-2 text-2xl font-black text-paper leading-tight">
                  {s.title}
                </h3>
                <p className="mt-1 text-sm text-white/80 leading-snug line-clamp-2">
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
