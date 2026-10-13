"use client";
// Bewakoof-style top utility bar — slim, informational, with quick links
import Link from "next/link";
import { Truck, MapPin, Phone, Package } from "lucide-react";

const ITEMS = [
  { icon: Truck, label: "Free shipping over ₹999", href: "/shop" },
  { icon: Package, label: "Track Order", href: "/account" },
  { icon: MapPin, label: "Find a Store", href: "/about" },
  { icon: Phone, label: "Contact", href: "/about" },
];

export default function TopBar() {
  return (
    <div className="bg-brand-dark text-paper/60 text-[11px] border-b border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-9">
          {/* Left: brand promise */}
          <p className="hidden sm:flex items-center gap-2 uppercase tracking-widest">
            <span className="text-brand-red">🇮🇳</span>
            <span className="text-paper/70">Handcrafted in India</span>
            <span className="opacity-30">|</span>
            <span>Style That Never Stops</span>
          </p>

          {/* Right: quick links */}
          <nav className="flex items-center gap-4 sm:gap-5 ml-auto">
            {ITEMS.map((item, idx) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-1.5 uppercase tracking-widest hover:text-paper transition"
              >
                <item.icon className="w-3 h-3" />
                <span className="hidden sm:inline">{item.label}</span>
                <span className="sm:hidden">{idx === 0 ? "Free Ship ₹999+" : item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
