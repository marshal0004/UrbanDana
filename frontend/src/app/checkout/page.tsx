"use client";
import { useState, useEffect } from "react";
import { useShop } from "@/context/ShopContext";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { rupee } from "@/lib/utils";
import Link from "next/link";
import { ArrowRight, Check, Lock, CreditCard, Loader2 } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function CheckoutPage() {
  const { cart, cartTotal, sessionId } = useShop();
  const { user, token } = useAuth();
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState<{ orderNumber: string; totalAmount: number; id: string } | null>(null);
  const [razorpayAvailable, setRazorpayAvailable] = useState(false);
  const [razorpayKeyId, setRazorpayKeyId] = useState<string | null>(null);
  const [form, setForm] = useState({
    email: "", phone: "", firstName: "", lastName: "",
    address: "", city: "", state: "", pincode: "", paymentMethod: "COD",
  });

  // Pre-fill from logged-in user
  useEffect(() => {
    if (user) {
      setForm((f) => ({
        ...f,
        email: user.email || f.email,
        firstName: user.firstName || f.firstName,
        lastName: user.lastName || f.lastName,
        phone: user.phone || f.phone,
      }));
    }
  }, [user]);

  // Check Razorpay availability
  useEffect(() => {
    fetch(`${API_URL}/api/payments/health`)
      .then((r) => r.json())
      .then((d) => {
        setRazorpayAvailable(d.razorpay === true);
        setRazorpayKeyId(d.keyId);
      })
      .catch(() => setRazorpayAvailable(false));

    // Load Razorpay checkout.js script
    if (typeof window !== "undefined" && !document.querySelector("script#razorpay-checkout")) {
      const s = document.createElement("script");
      s.id = "razorpay-checkout";
      s.src = "https://checkout.razorpay.com/v1/checkout.js";
      s.async = true;
      document.body.appendChild(s);
    }
  }, []);

  const shipping = cartTotal >= 99900 ? 0 : 9900;
  const total = cartTotal + shipping;

  async function placeOrder(e: React.FormEvent) {
    e.preventDefault();
    if (!cart?.items?.length) return;
    setPlacing(true);
    try {
      // 1. Create UrbanDana order in DB
      const order = await api.createOrder({
        ...form,
        items: cart.items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          variant: i.variant || undefined,
        })),
        paymentMethod: form.paymentMethod,
      });

      // 2. If COD, we're done
      if (form.paymentMethod === "COD") {
        setPlaced({ orderNumber: order.orderNumber, totalAmount: order.totalAmount, id: order.id });
        return;
      }

      // 3. If Razorpay, create Razorpay order + open checkout
      if (form.paymentMethod === "RAZORPAY") {
        if (!razorpayAvailable || !razorpayKeyId) {
          alert("Online payments not configured. Please choose COD.");
          setPlacing(false);
          return;
        }

        const r = await fetch(`${API_URL}/api/payments/create-order`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ amount: total, orderId: order.id }),
        });
        if (!r.ok) {
          const e = await r.json().catch(() => ({}));
          throw new Error(e.error || "Failed to create Razorpay order");
        }
        const rzpOrder = await r.json();

        // Open Razorpay checkout modal
        const rzp = new (window as any).Razorpay({
          key: razorpayKeyId,
          amount: rzpOrder.amount,
          currency: rzpOrder.currency,
          name: "URBANDANA",
          description: `Order ${order.orderNumber}`,
          order_id: rzpOrder.razorpayOrderId,
          prefill: {
            name: `${form.firstName} ${form.lastName}`,
            email: form.email,
            contact: form.phone,
          },
          theme: { color: "#c8102e" },
          handler: async (response: any) => {
            // Verify signature server-side
            try {
              const vr = await fetch(`${API_URL}/api/payments/verify`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  orderId: order.id,
                }),
              });
              if (!vr.ok) {
                const e = await vr.json().catch(() => ({}));
                throw new Error(e.error || "Payment verification failed");
              }
              setPlaced({ orderNumber: order.orderNumber, totalAmount: order.totalAmount, id: order.id });
            } catch (err) {
              console.error("verify failed", err);
              alert(`Payment verification failed: ${err instanceof Error ? err.message : "unknown"}. Contact support with order ${order.orderNumber}.`);
            } finally {
              setPlacing(false);
            }
          },
          modal: {
            ondismiss: () => {
              setPlacing(false);
              alert(`Payment cancelled. Your order ${order.orderNumber} is pending — pay later from your account page.`);
            },
          },
        });
        rzp.open();
        return;
      }
    } catch (e) {
      console.error(e);
      alert(`Failed to place order: ${e instanceof Error ? e.message : "unknown"}`);
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
        <h1 className="mt-8 text-4xl font-black text-brand-black">Order Placed!</h1>
        <p className="mt-3 text-brand-black/70">
          Thanks for your order{user?.firstName ? `, ${user.firstName}` : ""}. We&apos;ll dispatch it within 24 hours.
        </p>
        <div className="mt-8 p-6 rounded-2xl bg-gray-50 border border-brand-black/10 text-left">
          <div className="flex justify-between text-sm mb-3">
            <span className="text-brand-black/60">Order Number</span>
            <span className="font-bold text-brand-black">{placed.orderNumber}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-brand-black/60">Total {form.paymentMethod === "RAZORPAY" ? "Paid" : "(COD)"}</span>
            <span className="font-bold text-brand-black">{rupee(placed.totalAmount)}</span>
          </div>
        </div>
        <p className="mt-6 text-xs text-brand-black/50">
          A confirmation has been sent to your email. Track your order anytime from your account.
        </p>
        <Link
          href="/shop"
          className="mt-8 inline-flex items-center gap-2 bg-brand-red hover:bg-brand-red-soft transition text-brand-black text-sm font-bold uppercase tracking-widest px-8 py-3 rounded-full"
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
        <h1 className="text-3xl font-black text-brand-black">Your bag is empty</h1>
        <Link href="/shop" className="mt-6 inline-block text-brand-red hover:underline">
          ← Back to shop
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl md:text-5xl font-black tracking-tight text-brand-black">Checkout</h1>
      <p className="mt-2 text-brand-black/60 text-sm">
        <Lock className="inline w-3 h-3 mr-1" /> Secure checkout · Your info is encrypted
      </p>

      <form onSubmit={placeOrder} className="mt-10 grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <fieldset className="space-y-4">
            <legend className="text-xs uppercase tracking-widest text-brand-red font-semibold mb-3">
              Contact
            </legend>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Email" type="email" required value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
              <Input label="Phone" type="tel" required value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
            </div>
          </fieldset>

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

          <fieldset>
            <legend className="text-xs uppercase tracking-widest text-brand-red font-semibold mb-3">
              Payment Method
            </legend>
            <div className="space-y-3">
              {/* COD */}
              <label
                className={`cursor-pointer p-4 rounded-2xl border transition flex items-start gap-3 ${
                  form.paymentMethod === "COD"
                    ? "bg-brand-red/10 border-brand-red"
                    : "bg-gray-50 border-brand-black/10 hover:border-brand-black/30"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={form.paymentMethod === "COD"}
                  onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                  className="mt-1 accent-brand-red"
                />
                <div>
                  <p className="text-sm font-bold text-brand-black">Cash on Delivery</p>
                  <p className="text-xs text-brand-black/50 mt-0.5">Pay in cash when your order arrives. Available pan-India.</p>
                </div>
              </label>

              {/* Razorpay */}
              <label
                className={`cursor-pointer p-4 rounded-2xl border transition flex items-start gap-3 ${
                  form.paymentMethod === "RAZORPAY"
                    ? "bg-brand-red/10 border-brand-red"
                    : "bg-gray-50 border-brand-black/10 hover:border-brand-black/30"
                } ${!razorpayAvailable ? "opacity-60 cursor-not-allowed" : ""}`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="RAZORPAY"
                  checked={form.paymentMethod === "RAZORPAY"}
                  onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                  disabled={!razorpayAvailable}
                  className="mt-1 accent-brand-red"
                />
                <div className="flex-1">
                  <p className="text-sm font-bold text-brand-black flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Online Payment
                  </p>
                  <p className="text-xs text-brand-black/50 mt-0.5">
                    {razorpayAvailable
                      ? "Pay via UPI, Credit/Debit Card, NetBanking, or Wallets (powered by Razorpay)."
                      : "Online payments not configured on server. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to enable."}
                  </p>
                  {razorpayAvailable && (
                    <div className="mt-2 flex gap-1.5 flex-wrap">
                      {["UPI", "VISA", "Mastercard", "Rupay", "Wallets"].map((m) => (
                        <span key={m} className="text-[9px] uppercase tracking-widest px-2 py-0.5 bg-gray-50 rounded text-brand-black/60">{m}</span>
                      ))}
                    </div>
                  )}
                </div>
              </label>
            </div>
          </fieldset>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 p-6 rounded-3xl bg-gray-50 border border-brand-black/10">
            <h2 className="text-sm uppercase tracking-widest text-brand-black/60 mb-5">Your Order</h2>
            <ul className="space-y-3 mb-5">
              {cart.items.map((item) => (
                <li key={item.id} className="flex justify-between text-sm">
                  <div className="flex-1 min-w-0">
                    <p className="text-brand-black truncate">{item.product.title}</p>
                    <p className="text-xs text-brand-black/40">Qty {item.quantity}{item.variant ? ` · ${item.variant}` : ""}</p>
                  </div>
                  <span className="text-brand-black font-semibold ml-3">
                    {rupee(item.product.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="pt-4 border-t border-brand-black/10 space-y-2 text-sm">
              <div className="flex justify-between text-brand-black/70">
                <span>Subtotal</span>
                <span className="text-brand-black font-semibold">{rupee(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-brand-black/70">
                <span>Shipping</span>
                <span className={shipping === 0 ? "text-emerald-400 font-semibold" : "text-brand-black font-semibold"}>
                  {shipping === 0 ? "FREE" : rupee(shipping)}
                </span>
              </div>
              <div className="pt-3 border-t border-brand-black/10 flex justify-between items-center">
                <span className="text-brand-black/70">Total</span>
                <span className="text-2xl font-black text-brand-black">{rupee(total)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={placing}
              className="mt-6 w-full bg-brand-red hover:bg-brand-red-soft disabled:opacity-50 transition text-brand-black text-sm font-bold uppercase tracking-widest py-4 rounded-full flex items-center justify-center gap-2"
            >
              {placing ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Processing…</>
              ) : form.paymentMethod === "RAZORPAY" ? (
                <>Pay {rupee(total)} Online</>
              ) : (
                `Place Order — ${rupee(total)}`
              )}
            </button>
            <p className="text-[10px] uppercase tracking-widest text-brand-black/40 text-center mt-3">
              🔒 By placing order you agree to our T&Cs
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
      <span className="block text-xs uppercase tracking-widest text-brand-black/50 mb-1.5">
        {label} {required && <span className="text-brand-red">*</span>}
      </span>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-gray-50 border border-brand-black/10 rounded-lg px-3 py-2.5 text-sm text-brand-black placeholder:text-brand-black/40 focus:outline-none focus:border-brand-red"
      />
    </label>
  );
}
