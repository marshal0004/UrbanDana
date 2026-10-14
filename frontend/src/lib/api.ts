export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

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
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
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
