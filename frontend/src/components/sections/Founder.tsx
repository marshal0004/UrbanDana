"use client";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function Founder() {
  const { ref, inView } = useInView();
  const [data, setData] = useState<{ name: string; origin: string; story: string; image: string } | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/cms/founder`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData(null));
  }, []);

  return (
    <section ref={ref} className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <div className={cn("relative transition-all duration-1000", inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8")}>
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-white/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1000&q=80&auto=format&fit=crop"
                alt={data?.name || "Founder"}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-black/80 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-xs uppercase tracking-[0.4em] text-brand-red font-bold">Founder</p>
                <p className="mt-1 text-2xl font-black text-paper">{data?.name || "Vikram Kumar"}</p>
                <p className="text-sm text-paper/60">{data?.origin || "Delhi & Dehradun, India"}</p>
              </div>
            </div>
            {/* Decorative accent */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-brand-red/20 rounded-full blur-3xl -z-10" />
          </div>

          {/* Story */}
          <div className={cn("transition-all duration-1000 delay-200", inView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8")}>
            <p className="text-xs uppercase tracking-[0.4em] text-brand-red mb-4 font-semibold">
              The Urbandana Story
            </p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-paper">
              &quot;What if the bandana and the cap became one?&quot;
            </h2>
            <div className="mt-6 space-y-4 text-paper/70 leading-relaxed text-base">
              <p>
                {data?.story || "Urbandana was founded by Vikram Kumar. He grew up in Delhi, but the idea struck one night in Dehradun, Uttarakhand — surrounded by people wearing bandanas as everyday culture."}
              </p>
              <p>
                He handcrafted the first prototypes himself. Today Urbandana is India&apos;s original bandana cap — an entirely new category of headwear that didn&apos;t exist before him.
              </p>
              <p className="text-paper/50 italic">
                100% designed and handcrafted in India 🇮🇳. Every cap supports local craftsmanship and a homegrown brand doing something genuinely original.
              </p>
            </div>
            <div className="mt-8 inline-flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-3 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs uppercase tracking-widest text-paper/70">
                Handcrafted in India
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
