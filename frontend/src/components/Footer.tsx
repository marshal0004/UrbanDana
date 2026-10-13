"use client";
import Link from "next/link";
import { Instagram, Twitter, Youtube, Facebook } from "lucide-react";

// Bewakoof-style multi-column footer
const COLUMNS = [
  {
    title: "Shop",
    links: [
      { label: "All Caps", href: "/shop" },
      { label: "Bandana Caps", href: "/shop?category=Bandana Caps" },
      { label: "T-Shirts", href: "/shop?category=T-Shirts" },
      { label: "Visors", href: "/shop?category=Visors" },
      { label: "Limited Edition", href: "/shop?category=Limited Edition" },
      { label: "Bundles & Saves", href: "/shop?category=Bundles" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Track Order", href: "/account" },
      { label: "Shipping Info", href: "/about" },
      { label: "Returns & Exchanges", href: "/about" },
      { label: "Sizing Guide", href: "/about" },
      { label: "FAQ", href: "/about" },
      { label: "Contact Us", href: "/about" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Our Story", href: "/about" },
      { label: "Founder — Vikram Kumar", href: "/about" },
      { label: "Made in India", href: "/about" },
      { label: "Find a Store", href: "/about" },
      { label: "Bulk & Corporate", href: "/about" },
      { label: "Press", href: "/about" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of Service", href: "/about" },
      { label: "Privacy Policy", href: "/about" },
      { label: "Refund Policy", href: "/about" },
      { label: "Cookie Policy", href: "/about" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10 bg-brand-black mt-32">
      {/* Newsletter band */}
      <div className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-black text-paper">
                Get ₹100 off your first order.
              </h3>
              <p className="mt-2 text-sm text-paper/60">
                Join the Urbandana squad for early drop access, member pricing, and stories from the workshop.
              </p>
            </div>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-paper placeholder:text-paper/40 focus:outline-none focus:border-brand-red"
              />
              <button className="bg-brand-red hover:bg-brand-red-soft transition text-paper text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-lg">
                Join Free
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1 lg:col-span-2">
            <h3 className="text-2xl font-black text-paper">
              URBAN<span className="text-brand-red">DANA</span>
            </h3>
            <p className="text-sm text-paper/60 mt-3 leading-relaxed max-w-xs">
              India's original bandana cap. Handcrafted in India 🇮🇳. Three looks from one cap — forward, backward, or folded low.
            </p>
            <p className="text-xs text-paper/40 mt-3 italic">
              &quot;Style That Never Stops.&quot;
            </p>
            <div className="flex gap-3 mt-5">
              {[Instagram, Twitter, Youtube, Facebook].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-full bg-white/5 hover:bg-brand-red border border-white/10 hover:border-brand-red flex items-center justify-center text-paper/60 hover:text-paper transition"
                  aria-label="Social link"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="text-[10px] uppercase tracking-[0.3em] text-paper/40 mb-4 font-bold">
                {col.title}
              </h4>
              <ul className="space-y-2.5 text-sm">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-paper/70 hover:text-brand-red transition">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Trust badges row */}
        <div className="mt-12 pt-8 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { icon: "🚚", title: "Free Shipping", desc: "On orders over ₹999" },
            { icon: "↩️", title: "Easy Returns", desc: "7-day no-questions-asked" },
            { icon: "🔒", title: "Secure Payments", desc: "UPI · Cards · COD · Razorpay" },
            { icon: "🇮🇳", title: "Made in India", desc: "Handcrafted in Dehradun" },
          ].map((b) => (
            <div key={b.title} className="p-4 rounded-xl bg-white/5 border border-white/5">
              <div className="text-2xl">{b.icon}</div>
              <p className="mt-2 text-xs font-bold uppercase tracking-widest text-paper">{b.title}</p>
              <p className="text-[11px] text-paper/50 mt-1">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-paper/40">
            © 2024–2026 UrbanDana. Made with ❤️ in Delhi & Dehradun, India.
          </p>
          <div className="flex items-center gap-3 text-[10px] text-paper/40 uppercase tracking-widest">
            <span>We accept:</span>
            <span className="px-2 py-1 bg-white/5 rounded">UPI</span>
            <span className="px-2 py-1 bg-white/5 rounded">VISA</span>
            <span className="px-2 py-1 bg-white/5 rounded">Mastercard</span>
            <span className="px-2 py-1 bg-white/5 rounded">Rupay</span>
            <span className="px-2 py-1 bg-white/5 rounded">COD</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
