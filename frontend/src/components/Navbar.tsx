// /home/z/my-project/UrbanDana/frontend/src/components/Navbar.tsx
"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useShop } from "@/context/ShopContext";
import { useAuth } from "@/context/AuthContext";
import { Menu, ShoppingBag, Search, X, Heart, User, LogOut, Package } from "lucide-react";
import { cn } from "@/lib/utils";

// NO dropdowns — simple nav links only
// Order: LIMITED first, then NEW, CAPS, T-SHIRTS, COMBO, About Us
const NAV_LINKS = [
  { label: "LIMITED", href: "/shop?category=Limited Edition", accent: true },
  { label: "NEW", href: "/shop?filter=new", accent: true },
  { label: "CAPS", href: "/shop?category=Bandana Caps" },
  { label: "T-SHIRTS", href: "/shop?category=T-Shirts" },
  { label: "COMBO", href: "/shop?category=Combo" },
  { label: "About Us", href: "/about" },
];

export default function Navbar() {
  const router = useRouter();
  const { cartCount, setCartOpen } = useShop();
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
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
        "bg-brand-black border-b border-white/10"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-28 items-center justify-between gap-4">
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
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logo.png"
                alt="URBANDANA"
                className="h-24 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Center: nav links — NO dropdowns, simple links */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "px-4 py-2 text-[12px] font-bold uppercase tracking-widest transition",
                  link.accent ? "text-brand-red" : "text-paper/85 hover:text-paper"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right: search + wishlist + cart + user */}
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
                    className="absolute right-0 top-full mt-2 w-56 bg-brand-dark border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                    onMouseLeave={() => setUserMenuOpen(false)}
                  >
                    <div className="px-4 py-3 border-b border-white/10">
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
                placeholder="Search caps, t-shirts, drops…"
                className="w-full text-paper bg-white/5 border border-white/10 rounded-full pl-11 pr-4 py-3 text-sm placeholder:text-paper/40 focus:outline-none focus:border-brand-red"
              />
            </form>
          </div>
        )}
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-[85%] max-w-sm bg-brand-dark border-r border-white/10 overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-white/10 sticky top-0 bg-brand-dark z-10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/logo.png" alt="URBANDANA" className="h-20 w-auto object-contain" />
              <button onClick={() => setMobileOpen(false)} className="text-paper/70 hover:text-paper">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="p-5 space-y-3">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "block text-sm font-bold uppercase tracking-widest",
                    link.accent ? "text-brand-red" : "text-paper"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-white/10 space-y-2">
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
