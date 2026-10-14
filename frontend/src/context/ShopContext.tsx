"use client";
import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { api, type Cart, type Product } from "@/lib/api";

interface ShopContextValue {
  cart: Cart | null;
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
  sessionId: string;
  addToCart: (p: Product, variant?: string) => Promise<void>;
  updateQty: (itemId: string, qty: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  cartCount: number;
  cartTotal: number;
  refreshCart: () => Promise<void>;
}

const ShopContext = createContext<ShopContextValue | null>(null);

export function ShopProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");

  // Initialise session ID from localStorage
  useEffect(() => {
    let id = localStorage.getItem("ud_session");
    if (!id) {
      id = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
      localStorage.setItem("ud_session", id);
    }
    setSessionId(id);
  }, []);

  // Load cart whenever sessionId becomes available
  const refreshCart = useCallback(async () => {
    if (!sessionId) return;
    try {
      const c = await api.getCart(sessionId);
      setCart(c);
    } catch (e) {
      console.error("Failed to load cart", e);
    }
  }, [sessionId]);

  useEffect(() => {
    if (sessionId) refreshCart();
  }, [sessionId, refreshCart]);

  const addToCart = useCallback(
    async (p: Product, variant?: string) => {
      if (!sessionId) return;
      // Guard: verify product has a valid ID before making API call
      if (!p || !p.id || typeof p.id !== "string") {
        console.error("addToCart: product.id is missing or invalid", p);
        return;
      }
      try {
        const updated = await api.addToCart(p.id, 1, variant, sessionId);
        setCart(updated);
        setCartOpen(true);
      } catch (e) {
        console.error("addToCart failed", e);
      }
    },
    [sessionId]
  );

  const updateQty = useCallback(
    async (itemId: string, qty: number) => {
      if (!sessionId) return;
      try {
        await api.updateCartItem(itemId, qty, sessionId);
        await refreshCart();
      } catch (e) {
        console.error("updateQty failed", e);
      }
    },
    [sessionId, refreshCart]
  );

  const removeItem = useCallback(
    async (itemId: string) => {
      if (!sessionId) return;
      try {
        await api.removeCartItem(itemId, sessionId);
        await refreshCart();
      } catch (e) {
        console.error("removeItem failed", e);
      }
    },
    [sessionId, refreshCart]
  );

  const cartCount = cart?.items.reduce((n, i) => n + i.quantity, 0) || 0;
  const cartTotal = cart?.items.reduce((n, i) => n + i.product.price * i.quantity, 0) || 0;

  return (
    <ShopContext.Provider
      value={{ cart, cartOpen, setCartOpen, sessionId, addToCart, updateQty, removeItem, cartCount, cartTotal, refreshCart }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used within ShopProvider");
  return ctx;
}
