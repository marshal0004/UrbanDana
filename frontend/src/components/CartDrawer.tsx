"use client";
import { useShop } from "@/context/ShopContext";
import { rupee } from "@/lib/utils";
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { absUrl } from "@/lib/api";

export default function CartDrawer() {
  const { cart, cartOpen, setCartOpen, updateQty, removeItem, cartCount, cartTotal } = useShop();

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          cartOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setCartOpen(false)}
      />

      {/* Drawer */}
      <aside
        className={`fixed right-0 top-0 h-full w-full sm:w-[440px] bg-brand-dark border-l border-white/10 z-50 transition-transform duration-300 flex flex-col ${
          cartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-brand-red" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-paper">
              Your Bag <span className="text-paper/40">({cartCount})</span>
            </h2>
          </div>
          <button
            onClick={() => setCartOpen(false)}
            className="text-paper/60 hover:text-paper transition p-1"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-5">
          {!cart?.items?.length ? (
            <div className="h-full flex flex-col items-center justify-center text-center gap-3 py-20">
              <ShoppingBag className="w-12 h-12 text-paper/20" />
              <p className="text-paper/60 text-sm">Your bag is empty.</p>
              <Link
                href="/shop"
                onClick={() => setCartOpen(false)}
                className="mt-2 inline-flex bg-brand-red hover:bg-brand-red-soft transition text-paper text-xs font-semibold uppercase tracking-widest px-5 py-3 rounded-full"
              >
                Shop the Drop
              </Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {cart.items.map((item) => (
                <li key={item.id} className="flex gap-3 bg-white/5 rounded-xl p-3 border border-white/5">
                  {/* Thumb */}
                  <Link
                    href={`/product/${item.product.slug}`}
                    onClick={() => setCartOpen(false)}
                    className="shrink-0"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={absUrl(item.product.images?.[0]?.url || "")}
                      alt={item.product.title}
                      className="w-16 h-16 object-cover rounded-lg bg-white/5"
                    />
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/product/${item.product.slug}`}
                        onClick={() => setCartOpen(false)}
                        className="text-sm font-semibold text-paper hover:text-brand-red transition truncate"
                      >
                        {item.product.title}
                      </Link>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-paper/40 hover:text-brand-red transition"
                        aria-label="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    {item.variant && (
                      <p className="text-xs text-paper/50 mt-0.5">{item.variant}</p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2 bg-white/5 rounded-full p-1">
                        <button
                          onClick={() => updateQty(item.id, item.quantity - 1)}
                          className="w-6 h-6 rounded-full flex items-center justify-center text-paper/70 hover:bg-white/10 transition"
                          aria-label="Decrease"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-semibold text-paper w-5 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQty(item.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-full flex items-center justify-center text-paper/70 hover:bg-white/10 transition"
                          aria-label="Increase"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-sm font-semibold text-paper">
                        {rupee(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {cart?.items?.length ? (
          <div className="border-t border-white/10 p-5 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-paper/60">Subtotal</span>
              <span className="font-bold text-paper text-lg">{rupee(cartTotal)}</span>
            </div>
            <p className="text-xs text-paper/50">
              {cartTotal >= 99900 ? "🎉 You unlocked FREE shipping!" : `Add ${rupee(99900 - cartTotal)} more for FREE shipping`}
            </p>
            <Link
              href="/checkout"
              onClick={() => setCartOpen(false)}
              className="block w-full bg-brand-red hover:bg-brand-red-soft transition text-paper text-center text-sm font-bold uppercase tracking-widest py-4 rounded-full"
            >
              Checkout — {rupee(cartTotal)}
            </Link>
            <Link
              href="/cart"
              onClick={() => setCartOpen(false)}
              className="block w-full text-center text-xs uppercase tracking-widest text-paper/60 hover:text-paper transition py-2"
            >
              View Full Cart
            </Link>
          </div>
        ) : null}
      </aside>
    </>
  );
}
