"use client";
import { useState } from "react";
import { useShop } from "@/context/ShopContext";
import { api } from "@/lib/api";
import { rupee } from "@/lib/utils";
import Link from "next/link";
import { ArrowRight, Check, Lock } from "lucide-react";

export default function CheckoutPage() {
  const { cart, cartTotal, sessionId } = useShop();
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState<{ orderNumber: string; totalAmount: number } | null>(null);
  const [form, setForm] = useState({
    email: "", phone: "", firstName: "", lastName: "",
    address: "", city: "", state: "", pincode: "", paymentMethod: "COD",
  });

  const shipping = cartTotal >= 99900 ? 0 : 9900;
  const total = cartTotal + shipping;

  async function placeOrder(e: React.FormEvent) {
    e.preventDefault();
    if (!cart?.items?.length) return;
    setPlacing(true);
    try {
      const order = await api.createOrder({
        ...form,
        items: cart.items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          variant: i.variant || undefined,
        })),
        paymentMethod: form.paymentMethod,
      });
      setPlaced({ orderNumber: order.orderNumber, totalAmount: order.totalAmount });
    } catch (e) {
      console.error(e);
      alert("Failed to place order. Please try again.");
    } finally {
      setPlacing(false);
    }
  }

  if (placed) {
    return (
      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto">
          <Check className="w-10 h-10 text-emerald-400" />
        </div>
        <h1 className="mt-8 text-4xl font-black text-paper">Order Placed!</h1>
        <p className="mt-3 text-paper/70">
          Thanks for your order. We&apos;ll dispatch it within 24 hours.
        </p>
        <div className="mt-8 p-6 rounded-2xl bg-white/5 border border-white/10 text-left">
          <div className="flex justify-between text-sm mb-3">
            <span className="text-paper/60">Order Number</span>
            <span className="font-bold text-paper">{placed.orderNumber}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-paper/60">Total Paid (COD)</span>
            <span className="font-bold text-paper">{rupee(placed.totalAmount)}</span>
          </div>
        </div>
        <p className="mt-6 text-xs text-paper/50">
          A confirmation has been sent to your email. Track your order anytime using the order number.
        </p>
        <Link
          href="/shop"
          className="mt-8 inline-flex items-center gap-2 bg-brand-red hover:bg-brand-red-soft transition text-paper text-sm font-bold uppercase tracking-widest px-8 py-3 rounded-full"
        >
          Continue Shopping
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  if (!cart?.items?.length) {
    return (
      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-20 text-center">
        <h1 className="text-3xl font-black text-paper">Your bag is empty</h1>
        <Link href="/shop" className="mt-6 inline-block text-brand-red hover:underline">
          ← Back to shop
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl md:text-5xl font-black tracking-tight text-paper">Checkout</h1>
      <p className="mt-2 text-paper/60 text-sm">
        <Lock className="inline w-3 h-3 mr-1" /> Secure checkout · Your info is encrypted
      </p>

      <form onSubmit={placeOrder} className="mt-10 grid lg:grid-cols-3 gap-10">
        {/* Form */}
        <div className="lg:col-span-2 space-y-8">
          {/* Contact */}
          <fieldset className="space-y-4">
            <legend className="text-xs uppercase tracking-widest text-brand-red font-semibold mb-3">
              Contact
            </legend>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Email" type="email" required value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
              <Input label="Phone" type="tel" required value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
            </div>
          </fieldset>

          {/* Shipping */}
          <fieldset className="space-y-4">
            <legend className="text-xs uppercase tracking-widest text-brand-red font-semibold mb-3">
              Shipping Address
            </legend>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="First Name" required value={form.firstName} onChange={(v) => setForm({ ...form, firstName: v })} />
              <Input label="Last Name" required value={form.lastName} onChange={(v) => setForm({ ...form, lastName: v })} />
            </div>
            <Input label="Address (House no, Street, Area)" required value={form.address} onChange={(v) => setForm({ ...form, address: v })} />
            <div className="grid sm:grid-cols-3 gap-4">
              <Input label="City" required value={form.city} onChange={(v) => setForm({ ...form, city: v })} />
              <Input label="State" required value={form.state} onChange={(v) => setForm({ ...form, state: v })} />
              <Input label="Pincode" required value={form.pincode} onChange={(v) => setForm({ ...form, pincode: v })} />
            </div>
          </fieldset>

          {/* Payment */}
          <fieldset>
            <legend className="text-xs uppercase tracking-widest text-brand-red font-semibold mb-3">
              Payment Method
            </legend>
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { v: "COD", l: "Cash on Delivery", desc: "Pay when delivered" },
                { v: "UPI", l: "UPI", desc: "GPay, PhonePe, Paytm" },
                { v: "CARD", l: "Card", desc: "Credit / Debit" },
              ].map((p) => (
                <label
                  key={p.v}
                  className={`cursor-pointer p-4 rounded-2xl border transition ${
                    form.paymentMethod === p.v
                      ? "bg-brand-red/10 border-brand-red"
                      : "bg-white/5 border-white/10 hover:border-white/30"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={p.v}
                    checked={form.paymentMethod === p.v}
                    onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                    className="sr-only"
                  />
                  <p className="text-sm font-bold text-paper">{p.l}</p>
                  <p className="text-xs text-paper/50 mt-0.5">{p.desc}</p>
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 p-6 rounded-3xl bg-white/5 border border-white/10">
            <h2 className="text-sm uppercase tracking-widest text-paper/60 mb-5">Your Order</h2>
            <ul className="space-y-3 mb-5">
              {cart.items.map((item) => (
                <li key={item.id} className="flex justify-between text-sm">
                  <div className="flex-1 min-w-0">
                    <p className="text-paper truncate">{item.product.title}</p>
                    <p className="text-xs text-paper/40">Qty {item.quantity}{item.variant ? ` · ${item.variant}` : ""}</p>
                  </div>
                  <span className="text-paper font-semibold ml-3">
                    {rupee(item.product.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="pt-4 border-t border-white/10 space-y-2 text-sm">
              <div className="flex justify-between text-paper/70">
                <span>Subtotal</span>
                <span className="text-paper font-semibold">{rupee(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-paper/70">
                <span>Shipping</span>
                <span className={shipping === 0 ? "text-emerald-400 font-semibold" : "text-paper font-semibold"}>
                  {shipping === 0 ? "FREE" : rupee(shipping)}
                </span>
              </div>
              <div className="pt-3 border-t border-white/10 flex justify-between items-center">
                <span className="text-paper/70">Total</span>
                <span className="text-2xl font-black text-paper">{rupee(total)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={placing}
              className="mt-6 w-full bg-brand-red hover:bg-brand-red-soft disabled:opacity-50 transition text-paper text-sm font-bold uppercase tracking-widest py-4 rounded-full"
            >
              {placing ? "Placing Order…" : `Place Order — ${rupee(total)}`}
            </button>
            <p className="text-[10px] uppercase tracking-widest text-paper/40 text-center mt-3">
              By placing order you agree to our T&Cs
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}

function Input({
  label, value, onChange, type = "text", required = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-widest text-paper/50 mb-1.5">
        {label} {required && <span className="text-brand-red">*</span>}
      </span>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-paper placeholder:text-paper/40 focus:outline-none focus:border-brand-red"
      />
    </label>
  );
}
