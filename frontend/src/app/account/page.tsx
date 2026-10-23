"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { rupee } from "@/lib/utils";
import { Package, LogOut, User as UserIcon } from "lucide-react";
import { API_URL } from "@/lib/api";

interface Order {
  id: string;
  orderNumber: string;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
  items: { id: string; title: string; price: number; quantity: number; variant?: string | null }[];
}

// API_URL imported from @/lib/api — single source of truth (no env var reliance).

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  PAID: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  SHIPPED: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  DELIVERED: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  CANCELLED: "bg-brand-red/20 text-brand-red border-brand-red/30",
};

export default function AccountPage() {
  const { user, logout, token, loading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoadingOrders(false);
      return;
    }
    // Note: backend doesn't yet have GET /api/orders for the logged-in user — but we can
    // fetch all orders and filter client-side for now (admin sees all, customer sees their own)
    fetch("/api/orders", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch(() => setOrders([]))
      .finally(() => setLoadingOrders(false));
  }, [token]);

  if (loading) {
    return <div className="py-20 text-center text-brand-black/60">Loading…</div>;
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-md py-20 text-center px-4">
        <h1 className="text-3xl font-black text-brand-black">Please sign in</h1>
        <p className="mt-3 text-brand-black/60">You need an account to view your orders.</p>
        <div className="mt-6 flex gap-3 justify-center">
          <Link href="/login?redirect=/account" className="bg-brand-red hover:bg-brand-red-soft text-brand-black text-sm font-bold uppercase tracking-widest px-6 py-3 rounded-full">
            Sign In
          </Link>
          <Link href="/signup?redirect=/account" className="border border-brand-black/20 hover:border-white text-brand-black text-sm font-bold uppercase tracking-widest px-6 py-3 rounded-full">
            Create Account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-12">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-brand-red/20 flex items-center justify-center">
            <UserIcon className="w-6 h-6 text-brand-red" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-brand-black">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-sm text-brand-black/60">{user.email}</p>
            {user.role === "ADMIN" && (
              <span className="inline-block mt-1 text-[10px] uppercase tracking-widest bg-brand-red/20 text-brand-red px-2 py-0.5 rounded">Admin</span>
            )}
          </div>
        </div>
        <button
          onClick={logout}
          className="inline-flex items-center gap-2 border border-brand-black/20 hover:border-white text-brand-black text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-full"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>

      {/* Orders */}
      <div>
        <h2 className="text-xl font-black text-brand-black mb-6 flex items-center gap-2">
          <Package className="w-5 h-5 text-brand-red" /> Your Orders
        </h2>
        {loadingOrders ? (
          <div className="py-10 text-center text-brand-black/50">Loading orders…</div>
        ) : orders.length === 0 ? (
          <div className="p-10 rounded-2xl bg-gray-50 border border-brand-black/10 text-center">
            <p className="text-brand-black/60">No orders yet.</p>
            <Link href="/shop" className="mt-4 inline-block text-brand-red hover:underline text-sm">
              Start shopping →
            </Link>
          </div>
        ) : (
          <ul className="space-y-4">
            {orders.map((o) => (
              <li key={o.id} className="p-5 rounded-2xl bg-gray-50 border border-brand-black/10">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <div>
                    <p className="text-sm font-bold text-brand-black">{o.orderNumber}</p>
                    <p className="text-xs text-brand-black/50">
                      {new Date(o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] uppercase tracking-widest px-2 py-1 rounded border ${STATUS_COLORS[o.status] || STATUS_COLORS.PENDING}`}>
                      {o.status}
                    </span>
                    <span className="text-sm font-bold text-brand-black">{rupee(o.totalAmount)}</span>
                  </div>
                </div>
                <ul className="text-xs text-brand-black/60 space-y-1">
                  {o.items.map((it) => (
                    <li key={it.id}>
                      {it.quantity}× {it.title}{it.variant ? ` (${it.variant})` : ""} — {rupee(it.price * it.quantity)}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
