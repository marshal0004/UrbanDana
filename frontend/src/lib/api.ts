// Single source of truth for the backend API URL.
//
// CORS-FREE PROXY STRATEGY (the fix for products not loading on Vercel):
// All API FETCH calls use RELATIVE URLs (e.g. `/api/products`) so they go
// through the Vercel rewrite proxy defined in next.config.js. The proxy
// forwards the request to the Render backend server-side, which bypasses
// CORS entirely (same-origin from the browser's perspective).
//
// API_URL is ONLY used for:
//   - absUrl() — turning `/uploads/products/x.jpg` into absolute URLs
//     for <img> tags (img tags don't have CORS restrictions, so this is safe)
//   - The admin link in the Navbar (opens a new tab to the backend)
//
// Priority for API_URL:
//   1. process.env.NEXT_PUBLIC_API_URL — if explicitly set AND non-empty AND not localhost
//   2. https://urbandana.onrender.com — production fallback (Render backend)
const envUrl = process.env.NEXT_PUBLIC_API_URL;
const isLocalhost = envUrl && (envUrl.includes("localhost") || envUrl.includes("127.0.0.1"));
export const API_URL = envUrl && !isLocalhost ? envUrl : "https://urbandana.onrender.com";

export interface ProductImage {
  id: string;
  url: string;
  alt?: string;
  position: number;
}

export interface ProductVariant {
  id: string;
  name: string;
  value: string;
  stock: number;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  category: string;
  badge?: string | null;
  price: number;
  oldPrice?: number | null;
  rating: number;
  reviews: number;
  stock: number;
  isFeatured: boolean;
  isLimited: boolean;
  images: ProductImage[];
  variants: ProductVariant[];
}

export interface ProductListResponse {
  items: Product[];
  total: number;
  page: number;
  limit: number;
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  variant?: string | null;
  product: Product;
}

export interface Cart {
  id: string;
  items: CartItem[];
}

/** Absolute URL helper — turns "/uploads/products/x.jpg" into full backend URL */
export function absUrl(path: string): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API_URL}${path}`;
}

async function fetchJSON<T>(path: string, init?: RequestInit): Promise<T> {
  try {
    // CRITICAL: use RELATIVE URL (not `${API_URL}${path}`).
    // The Vercel rewrite proxy in next.config.js forwards `/api/*` to
    // the Render backend server-side, bypassing CORS entirely. This
    // works because the browser sees same-origin requests.
    const res = await fetch(path, {
      ...init,
      headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`API ${res.status}: ${text}`);
    }
    return res.json() as Promise<T>;
  } catch (err) {
    // Network error (backend not running) — return empty data gracefully
    if (err instanceof TypeError && err.message === "Failed to fetch") {
      console.warn(`Backend not reachable via proxy at ${path} — returning empty data`);
      // Return type-appropriate empty data
      if (path.includes("/api/products")) return { items: [], total: 0, page: 1, limit: 50 } as unknown as T;
      if (path.includes("/api/cart")) return { id: "", items: [] } as unknown as T;
      if (path.includes("/api/orders")) return [] as unknown as T;
      if (path.includes("/api/cms")) return {} as unknown as T;
      if (path.includes("/api/payments")) return { razorpay: false, mode: "COD_ONLY" } as unknown as T;
      return {} as unknown as T;
    }
    throw err;
  }
}

export const api = {
  listProducts: (params: Record<string, string | number | boolean | undefined> = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v != null && v !== "") qs.set(k, String(v));
    });
    return fetchJSON<ProductListResponse>(`/api/products?${qs.toString()}`);
  },
  getProduct: (slug: string) => fetchJSON<Product>(`/api/products/${slug}`),
  getCategories: () => fetchJSON<string[]>(`/api/products/meta/categories`),
  getCart: (sessionId?: string) =>
    fetchJSON<Cart>("/api/cart", { headers: sessionId ? { "x-session-id": sessionId } : {} }),
  addToCart: (productId: string, quantity = 1, variant?: string, sessionId?: string) =>
    fetchJSON<Cart>("/api/cart/items", {
      method: "POST",
      body: JSON.stringify({ productId, quantity, variant }),
      headers: sessionId ? { "x-session-id": sessionId } : {},
    }),
  updateCartItem: (itemId: string, quantity: number, sessionId?: string) =>
    fetchJSON<CartItem>(`/api/cart/items/${itemId}`, {
      method: "PATCH",
      body: JSON.stringify({ quantity }),
      headers: sessionId ? { "x-session-id": sessionId } : {},
    }),
  removeCartItem: (itemId: string, sessionId?: string) =>
    fetchJSON<{ ok: boolean }>(`/api/cart/items/${itemId}`, {
      method: "DELETE",
      headers: sessionId ? { "x-session-id": sessionId } : {},
    }),
  createOrder: (data: {
    email: string; phone: string; firstName: string; lastName: string;
    address: string; city: string; state: string; pincode: string;
    items: { productId: string; quantity: number; variant?: string }[];
    paymentMethod?: string;
  }) => fetchJSON<{ id: string; orderNumber: string; totalAmount: number }>("/api/orders", {
    method: "POST",
    body: JSON.stringify(data),
  }),
  getFounder: () => fetchJSON<{
    name: string; origin: string; story: string; image: string;
  }>("/api/cms/founder"),
};
