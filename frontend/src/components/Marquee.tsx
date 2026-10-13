"use client";
export default function Marquee() {
  const items = [
    "FREE SHIPPING OVER ₹999",
    "HANDCRAFTED IN INDIA 🇮🇳",
    "3 CAPS IN 1 — WEAR IT 3 WAYS",
    "7-DAY EASY RETURNS",
    "COD AVAILABLE",
    "MADE IN DEHRADUN",
    "LIMITED DROPS — NO RESTOCKS",
  ];
  const rail = [...items, ...items, ...items];
  return (
    <div className="relative z-20 bg-brand-red text-paper text-xs font-semibold tracking-widest overflow-hidden border-b border-white/10">
      <div className="flex animate-marquee whitespace-nowrap py-2">
        {rail.map((t, i) => (
          <span key={i} className="mx-6 inline-flex items-center gap-2">
            <span className="opacity-60">✦</span>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
