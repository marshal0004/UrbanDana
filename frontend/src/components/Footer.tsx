"use client";
import Link from "next/link";
import { Instagram, Twitter, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10 bg-brand-black mt-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-2xl font-black text-paper">
              URBAN<span className="text-brand-red">DANA</span>
            </h3>
            <p className="text-sm text-paper/60 mt-3 leading-relaxed">
              India's original bandana cap. Handcrafted in India 🇮🇳
            </p>
            <p className="text-xs text-paper/40 mt-3 italic">
              &quot;Style That Never Stops.&quot;
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-paper/40 mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-paper/70">
              <li><Link href="/shop" className="hover:text-brand-red transition">All Caps</Link></li>
              <li><Link href="/shop?category=Bandana Caps" className="hover:text-brand-red transition">Bandana Caps</Link></li>
              <li><Link href="/shop?category=Visors" className="hover:text-brand-red transition">Visors</Link></li>
              <li><Link href="/shop?category=Limited Edition" className="hover:text-brand-red transition">Limited Drops</Link></li>
              <li><Link href="/shop?category=Bundles" className="hover:text-brand-red transition">Bundles & Saves</Link></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-paper/40 mb-4">Help</h4>
            <ul className="space-y-2 text-sm text-paper/70">
              <li><Link href="/about" className="hover:text-brand-red transition">Our Story</Link></li>
              <li><a href="#" className="hover:text-brand-red transition">Shipping Info</a></li>
              <li><a href="#" className="hover:text-brand-red transition">Returns & Exchanges</a></li>
              <li><a href="#" className="hover:text-brand-red transition">Sizing Guide</a></li>
              <li><a href="#" className="hover:text-brand-red transition">Contact</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-paper/40 mb-4">Stay in the loop</h4>
            <p className="text-sm text-paper/60 mb-3">Get early access to drops + ₹100 off first order.</p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-paper placeholder:text-paper/40 focus:outline-none focus:border-brand-red"
              />
              <button className="bg-brand-red hover:bg-brand-red-soft transition text-paper text-xs font-semibold uppercase tracking-wider px-4 rounded-lg">
                Join
              </button>
            </form>
            <div className="flex gap-3 mt-4">
              <a href="#" className="text-paper/60 hover:text-brand-red transition" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-paper/60 hover:text-brand-red transition" aria-label="Twitter">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-paper/60 hover:text-brand-red transition" aria-label="Youtube">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-paper/40">© 2024–2026 UrbanDana. Made with ❤️ in Delhi & Dehradun, India.</p>
          <div className="flex gap-5 text-xs text-paper/40">
            <a href="#" className="hover:text-paper transition">Privacy</a>
            <a href="#" className="hover:text-paper transition">Terms</a>
            <a href="#" className="hover:text-paper transition">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
