"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useShop } from "@/context/ShopContext";
import { Menu, ShoppingBag, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop All" },
  { href: "/shop?category=Bandana Caps", label: "Bandana Caps" },
  { href: "/shop?category=Visors", label: "Visors" },
  { href: "/shop?category=Limited Edition", label: "Limited Edition" },
  { href: "/shop?category=Bundles", label: "Bundles" },
  { href: "/about", label: "Our Story" },
];

export default function Navbar() {
  const { cartCount, setCartOpen } = useShop();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-all duration-300",
        scrolled
          ? "bg-brand-black/85 backdrop-blur-xl border-b border-white/10"
          : "bg-transparent border-b border-transparent"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left: mobile menu + logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 -ml-2 text-paper hover:text-brand-red transition"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-xl font-black tracking-tight text-paper group-hover:text-brand-red transition">
                URBAN<span className="text-brand-red">DANA</span>
              </span>
            </Link>
          </div>

          {/* Center: nav (desktop) */}
          <nav className="hidden lg:flex items-center gap-7">
            {NAV.map((n) => (
              <Link
                key={n.label}
                href={n.href}
                className="text-[13px] uppercase tracking-widest text-paper/80 hover:text-paper transition relative group"
              >
                {n.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-brand-red group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </nav>

          {/* Right: search + cart */}
          <div className="flex items-center gap-1">
            <button
              className="p-2 text-paper/80 hover:text-paper transition"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 text-paper/80 hover:text-paper transition"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-brand-red text-paper text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-[80%] max-w-sm bg-brand-dark border-r border-white/10 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <span className="text-lg font-black text-paper">
                URBAN<span className="text-brand-red">DANA</span>
              </span>
              <button onClick={() => setMobileOpen(false)} className="text-paper/70 hover:text-paper">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex flex-col gap-1">
              {NAV.map((n) => (
                <Link
                  key={n.label}
                  href={n.href}
                  onClick={() => setMobileOpen(false)}
                  className="py-3 text-sm uppercase tracking-widest text-paper/85 hover:text-brand-red border-b border-white/5 transition"
                >
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
