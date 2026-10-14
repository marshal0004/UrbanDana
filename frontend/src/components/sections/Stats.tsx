"use client";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";

const STATS = [
  { num: "700+", label: "Happy Heads" },
  { num: "4.8★", label: "Avg. Rating" },
  { num: "3", label: "Ways to Wear" },
  { num: "100%", label: "Made in India" },
];

export default function Stats() {
  const { ref, inView } = useInView();
  return (
    <section ref={ref} className="bg-brand-cream border-y border-brand-black/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className={cn(
                "text-center transition-all duration-700",
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              )}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="text-4xl md:text-5xl font-black text-brand-red tracking-tight">
                {s.num}
              </div>
              <div className="mt-2 text-[10px] uppercase tracking-widest text-brand-black/50 font-semibold">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
