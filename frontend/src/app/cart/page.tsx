"use client";
import Link from "next/link";
import { useShop } from "@/context/ShopContext";
import { api, absUrl } from "@/lib/api";
import { rupee } from "@/lib/utils";
import { Plus, Minus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

export default function CartPage() {
  const { cart, updateQty, removeItem, cartCount, cartTotal, sessionId, refreshCart } = useShop();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const shipping = cartTotal >= 99900 || cartTotal === 0 ? 0 : 9900;
  const total = cartTotal + shipping;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl md:text-5xl font-black tracking-tight text-brand-black">Your Bag</h1>
      <p className="mt-2 text-brand-black/60">
        {cartCount > 0 ? `${cartCount} item${cartCount > 1 ? "s" : ""} in your bag` : "Your bag is empty"}
      </p>

      {!cart?.items?.length ? (
        <div className="mt-16 text-center py-20 border border-brand-black/10 rounded-3xl bg-gray-50">
          <ShoppingBag className="w-16 h-16 mx-auto text-brand-black/20" />
          <h2 className="mt-6 text-xl font-bold text-brand-black">Nothing here yet</h2>
          <p className="mt-2 text-brand-black/60 text-sm">Find your next favourite cap in the shop.</p>
          <Link
            href="/shop"
            className="mt-6 inline-flex items-center gap-2 bg-brand-red hover:bg-brand-red-soft transition text-brand-black text-sm font-bold uppercase tracking-widest px-8 py-3 rounded-full"
          >
            Shop All Caps
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid lg:grid-cols-3 gap-10">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <div key={item.id} className="flex gap-4 p-4 rounded-2xl bg-gray-50 border border-brand-black/10">
                <Link href={`/product/${item.product.slug}`} className="shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={absUrl(item.product.images?.[0]?.url || "")}
                    alt={item.product.title}
                    className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-xl bg-gray-50"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Link
                        href={`/product/${item.product.slug}`}
                        className="text-sm sm:text-base font-semibold text-brand-black hover:text-brand-red transition"
                      >
                        {item.product.title}
                      </Link>
                      {item.variant && (
                        <p className="text-xs text-brand-black/50 mt-0.5">{item.variant}</p>
                      )}
                      <p className="text-sm font-bold text-brand-black mt-2">{rupee(item.product.price)}</p>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-brand-black/40 hover:text-brand-red transition p-1"
                      aria-label="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2 bg-gray-50 rounded-full p-1 border border-brand-black/10">
                      <button
                        onClick={() => updateQty(item.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-full flex items-center justify-center text-brand-black/70 hover:bg-gray-100 transition"
                        aria-label="Decrease"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-semibold text-brand-black w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQty(item.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-full flex items-center justify-center text-brand-black/70 hover:bg-gray-100 transition"
                        aria-label="Increase"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-sm font-bold text-brand-black">
                      {rupee(item.product.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            <Link href="/shop" className="inline-block text-xs uppercase tracking-widest text-brand-red hover:underline mt-4">
              ← Continue shopping
            </Link>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 p-6 rounded-3xl bg-gray-50 border border-brand-black/10">
              <h2 className="text-sm uppercase tracking-widest text-brand-black/60 mb-5">Order Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-brand-black/70">
                  <span>Subtotal ({cartCount} items)</span>
                  <span className="text-brand-black font-semibold">{rupee(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-brand-black/70">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? "text-emerald-400 font-semibold" : "text-brand-black font-semibold"}>
                    {shipping === 0 ? "FREE" : rupee(shipping)}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-brand-black/40 italic">
                    Add {rupee(99900 - cartTotal)} more to unlock free shipping.
                  </p>
                )}
                <div className="pt-3 border-t border-brand-black/10 flex justify-between items-center">
                  <span className="text-brand-black/70">Total</span>
                  <span className="text-2xl font-black text-brand-black">{rupee(total)}</span>
                </div>
              </div>
              <Link
                href="/checkout"
                className="mt-6 block w-full bg-brand-red hover:bg-brand-red-soft transition text-brand-black text-center text-sm font-bold uppercase tracking-widest py-4 rounded-full"
              >
                Proceed to Checkout
              </Link>
              <p className="text-[10px] uppercase tracking-widest text-brand-black/40 text-center mt-3">
                🔒 Secure checkout · UPI · Cards · COD
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
