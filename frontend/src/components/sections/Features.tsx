"use client";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";
import { Truck, RefreshCw, Shield, Sparkles } from "lucide-react";

const FEATURES = [
  {
    icon: Sparkles,
    title: "3-in-1 Cap",
    desc: "Forward, backward, folded low. Three looks from one cap — switch in seconds.",
  },
  {
    icon: Truck,
    title: "Free Shipping",
    desc: "Free pan-India shipping over ₹999. Dispatched within 24 hours. Tracking on every order.",
  },
  {
    icon: RefreshCw,
    title: "7-Day Returns",
    desc: "No-questions-asked returns. Free exchange if the colourway isn't your vibe.",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    desc: "UPI, cards, netbanking, COD. 100% encrypted checkout. No hidden charges.",
  },
];

export default function Features() {
  const { ref, inView } = useInView();
  return (
    <section ref={ref} className="py-16 bg-brand-cream border-t border-brand-black/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className={cn(
                "group p-6 rounded-2xl bg-gray-50 border border-brand-black/10 hover:border-brand-red hover:shadow-lg transition-all duration-500",
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="w-11 h-11 rounded-xl bg-brand-red/15 flex items-center justify-center group-hover:bg-brand-red transition-colors">
                <f.icon className="w-5 h-5 text-brand-red group-hover:text-paper transition-colors" />
              </div>
              <h3 className="mt-4 text-sm font-bold uppercase tracking-wider text-brand-black">
                {f.title}
              </h3>
              <p className="mt-2 text-xs text-brand-black/60 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
