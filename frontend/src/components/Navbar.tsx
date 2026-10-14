"use client";
// Snitch-style mega menu, Bewakoof-style nav tabs — cleaner, more minimal
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useShop } from "@/context/ShopContext";
import { useAuth } from "@/context/AuthContext";
import { Menu, ShoppingBag, Search, X, Heart, User, ChevronDown, LogOut, Package } from "lucide-react";
import { cn } from "@/lib/utils";

const MEGA_MENU = [
  {
    label: "NEW",
    href: "/shop?filter=new",
    accent: true,
    columns: [
      {
        title: "Just Dropped",
        links: [
          { label: "All New Arrivals", href: "/shop?filter=new" },
          { label: "New Caps", href: "/shop?category=Bandana Caps&filter=new" },
          { label: "New Tees", href: "/shop?category=T-Shirts&filter=new" },
          { label: "Limited Drops", href: "/shop?category=Limited Edition" },
        ],
      },
      {
        title: "Trending",
        links: [
          { label: "Bestsellers", href: "/shop?filter=bestseller" },
          { label: "Bundles & Saves", href: "/shop?category=Bundles" },
          { label: "Under ₹1,499", href: "/shop?filter=under-1499" },
          { label: "Collector's Set", href: "/product/collector-s-full-set" },
        ],
      },
    ],
  },
  {
    label: "CAPS",
    href: "/shop?category=Bandana Caps",
    columns: [
      {
        title: "Bandana Caps",
        links: [
          { label: "All Caps", href: "/shop?category=Bandana Caps" },
          { label: "Signature Red Paisley", href: "/product/signature-red-paisley" },
          { label: "Café Culture Black", href: "/product/cafe-culture-black" },
          { label: "Classic White Paisley", href: "/product/classic-white-paisley" },
        ],
      },
      {
        title: "Visors",
        links: [
          { label: "All Visors", href: "/shop?category=Visors" },
          { label: "Visor Classic — Sand", href: "/product/visor-classic-sand" },
          { label: "Visor Duo Pack", href: "/product/visor-duo-pack" },
        ],
      },
    ],
  },
  {
    label: "T-SHIRTS",
    href: "/shop?category=T-Shirts",
    columns: [
      {
        title: "T-Shirts",
        links: [
          { label: "All Tees", href: "/shop?category=T-Shirts" },
          { label: "Oversized Tees", href: "/shop?category=T-Shirts&fit=oversized" },
          { label: "Graphic Tees", href: "/shop?category=T-Shirts&type=graphic" },
        ],
      },
      {
        title: "Bandana-Inspired",
        links: [
          { label: "Paisley Oversized Tee", href: "/product/paisley-oversized-tee" },
          { label: "Tiger Stripe Tee", href: "/product/tiger-stripe-tee" },
          { label: "Sunset Horizon Tee", href: "/product/sunset-horizon-tee" },
        ],
      },
    ],
  },
  {
    label: "LIMITED",
    href: "/shop?category=Limited Edition",
    accent: true,
    columns: [
      {
        title: "Limited Edition",
        links: [
          { label: "All Limited Drops", href: "/shop?category=Limited Edition" },
          { label: "Sunset Art Cap (200 pcs)", href: "/product/sunset-art-cap" },
          { label: "Skull Edition", href: "/product/skull-edition" },
          { label: "Tiger Print", href: "/product/tiger-print" },
          { label: "Monkey Folk Art", href: "/product/monkey-folk-art" },
        ],
      },
    ],
  },
  {
    label: "COMBO",
    href: "/shop?category=Combo",
    columns: [
      {
        title: "Combo Packs",
        links: [
          { label: "All Combos", href: "/shop?category=Combo" },
          { label: "Cap + Tee Combo — Red", href: "/product/cap-tee-combo-red" },
          { label: "Cap + Tee Combo — Black", href: "/product/cap-tee-combo-black" },
          { label: "Cap + Tee Combo — Indigo", href: "/product/cap-tee-combo-indigo" },
          { label: "Cap + Tee Combo — Cream", href: "/product/cap-tee-combo-cream" },
        ],
      },
    ],
  },
  {
    label: "STORY",
    href: "/about",
    columns: [
      {
        title: "About",
        links: [
          { label: "The Urbandana Story", href: "/about" },
          { label: "Founder — Vikram Kumar", href: "/about" },
          { label: "Made in India", href: "/about" },
          { label: "3-in-1 Cap Concept", href: "/about" },
        ],
      },
    ],
  },
];

export default function Navbar() {
  const router = useRouter();
  const { cartCount, setCartOpen } = useShop();
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredTab, setHoveredTab] = useState<number | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQ, setSearchQ] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQ.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQ.trim())}`);
      setSearchOpen(false);
      setSearchQ("");
    }
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-all duration-300",
        scrolled
          ? "bg-brand-black/95 backdrop-blur-xl border-b border-white/10"
          : "bg-brand-black/80 backdrop-blur-md border-b border-white/5"
      )}
      onMouseLeave={() => setHoveredTab(null)}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Left: mobile menu + logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 -ml-2 text-paper hover:text-brand-red transition"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link href="/" className="flex items-center gap-2 group shrink-0">
              <span className="text-xl font-black tracking-tight text-paper group-hover:text-brand-red transition">
                URBAN<span className="text-brand-red">DANA</span>
              </span>
            </Link>
          </div>

          {/* Center: nav tabs (desktop) — minimal, airy like Snitch */}
          <nav className="hidden lg:flex items-center gap-1">
            {MEGA_MENU.map((tab, i) => (
              <div
                key={tab.label}
                onMouseEnter={() => setHoveredTab(i)}
                className="relative"
              >
                <Link
                  href={tab.href}
                  className={cn(
                    "px-4 py-2 text-[12px] font-bold uppercase tracking-widest transition relative flex items-center gap-1",
                    tab.accent ? "text-brand-red" : "text-paper/85 hover:text-paper",
                    hoveredTab === i && "text-paper"
                  )}
                >
                  {tab.label}
                  {tab.columns.length > 0 && (
                    <ChevronDown className={cn("w-3 h-3 transition", hoveredTab === i && "rotate-180")} />
                  )}
                </Link>
              </div>
            ))}
          </nav>

          {/* Right: search + wishlist + cart + user — minimal icon row */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSearchOpen((v) => !v)}
              className="p-2 text-paper/80 hover:text-paper transition"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            <Link
              href="/wishlist"
              className="hidden sm:block p-2 text-paper/80 hover:text-paper transition"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
            </Link>

            {/* User / Auth */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="p-2 text-paper/80 hover:text-paper transition flex items-center gap-1"
                  aria-label="Account"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden md:inline text-xs uppercase tracking-widest">
                    Hi, {user.firstName || user.email.split("@")[0]}
                  </span>
                </button>
                {userMenuOpen && (
                  <div
                    className="absolute right-0 top-full mt-2 w-56 bg-brand-dark border border-brand-black/10 rounded-xl shadow-2xl overflow-hidden"
                    onMouseLeave={() => setUserMenuOpen(false)}
                  >
                    <div className="px-4 py-3 border-b border-brand-black/10">
                      <p className="text-sm font-semibold text-paper truncate">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-paper/50 truncate">{user.email}</p>
                    </div>
                    <Link
                      href="/account"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 text-sm text-paper/80 hover:bg-white/5 transition"
                    >
                      <Package className="w-4 h-4" /> My Orders
                    </Link>
                    <Link
                      href="/wishlist"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 text-sm text-paper/80 hover:bg-white/5 transition"
                    >
                      <Heart className="w-4 h-4" /> Wishlist
                    </Link>
                    {user.role === "ADMIN" && (
                      <a
                        href={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/admin`}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-3 text-sm text-brand-red hover:bg-white/5 transition"
                      >
                        <User className="w-4 h-4" /> Admin Panel
                      </a>
                    )}
                    <button
                      onClick={() => { logout(); setUserMenuOpen(false); router.push("/"); }}
                      className="w-full flex items-center gap-2 px-4 py-3 text-sm text-paper/80 hover:bg-white/5 transition border-t border-white/10"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="p-2 text-paper/80 hover:text-paper transition"
                aria-label="Login"
              >
                <User className="w-5 h-5" />
              </Link>
            )}

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

        {/* Search bar (expandable) */}
        {searchOpen && (
          <div className="pb-4 pt-1">
            <form onSubmit={submitSearch} className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-paper/40" />
              <input
                autoFocus
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
                placeholder="Search caps, tees, drops…"
                className="w-full text-paper bg-white/5 border border-white/10 rounded-full pl-11 pr-4 py-3 text-sm text-paper placeholder:text-paper/40 focus:outline-none focus:border-brand-red"
              />
            </form>
          </div>
        )}
      </div>

      {/* Mega menu panel (desktop) */}
      {hoveredTab !== null && MEGA_MENU[hoveredTab].columns.length > 0 && (
        <div
          className="absolute left-0 right-0 top-full bg-brand-dark/95 backdrop-blur-xl border-b border-white/10 shadow-2xl"
          onMouseEnter={() => setHoveredTab(hoveredTab)}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {MEGA_MENU[hoveredTab].columns.map((col) => (
                <div key={col.title}>
                  <h4 className="text-[10px] uppercase tracking-[0.3em] text-brand-red font-bold mb-4">
                    {col.title}
                  </h4>
                  <ul className="space-y-2.5">
                    {col.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="text-sm text-paper/70 hover:text-paper hover:translate-x-1 transition inline-block"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-[85%] max-w-sm bg-brand-dark border-r border-brand-black/10 overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-brand-black/10 sticky top-0 bg-brand-dark z-10">
              <span className="text-lg font-black text-paper">
                URBAN<span className="text-brand-red">DANA</span>
              </span>
              <button onClick={() => setMobileOpen(false)} className="text-paper/70 hover:text-paper">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="p-5 space-y-6">
              {MEGA_MENU.map((tab) => (
                <div key={tab.label}>
                  <Link
                    href={tab.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "block text-sm font-bold uppercase tracking-widest mb-2",
                      tab.accent ? "text-brand-red" : "text-paper"
                    )}
                  >
                    {tab.label}
                  </Link>
                  <ul className="space-y-1.5 pl-3 border-l border-brand-black/10">
                    {tab.columns.flatMap((col) => col.links).slice(0, 5).map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          onClick={() => setMobileOpen(false)}
                          className="block py-1 text-xs text-paper/60 hover:text-paper transition"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <div className="pt-4 border-t border-brand-black/10 space-y-2">
                {user ? (
                  <>
                    <Link href="/account" onClick={() => setMobileOpen(false)} className="block py-2 text-sm text-paper/80">
                      Hi, {user.firstName} — My Orders
                    </Link>
                    <button
                      onClick={() => { logout(); setMobileOpen(false); router.push("/"); }}
                      className="block py-2 text-sm text-brand-red"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setMobileOpen(false)} className="block py-2 text-sm text-paper/80">
                      Sign In
                    </Link>
                    <Link href="/signup" onClick={() => setMobileOpen(false)} className="block py-2 text-sm text-brand-red">
                      Create Account
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
