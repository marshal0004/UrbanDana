"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { api, absUrl, type Product } from "@/lib/api";
import { rupee, discountPct, cn } from "@/lib/utils";
import { useShop } from "@/context/ShopContext";
import { Star, ShoppingBag, Heart, Truck, RefreshCw, Shield, Minus, Plus } from "lucide-react";
import ProductCard from "@/components/ProductCard";

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const { addToCart } = useShop();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setActiveImg(0);
    setQty(1);
    api.getProduct(slug)
      .then((p) => {
        setProduct(p);
        const firstColor = p.variants.find((v) => v.name === "color");
        if (firstColor) setSelectedColor(firstColor.value);
        api.listProducts({ category: p.category, limit: 5 })
          .then((r) => setRelated(r.items.filter((x) => x.id !== p.id).slice(0, 4)))
          .catch(() => {});
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
          <div className="aspect-square rounded-3xl bg-gray-50 animate-pulse" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-50 rounded animate-pulse" />
            <div className="h-6 bg-gray-50 rounded w-2/3 animate-pulse" />
            <div className="h-24 bg-gray-50 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-3xl font-black text-brand-black">Cap not found</h1>
        <Link href="/shop" className="mt-4 inline-block text-brand-red hover:underline">
          ← Back to shop
        </Link>
      </div>
    );
  }

  const discount = discountPct(product.price, product.oldPrice);
  const soldOut = product.stock === 0;
  const colors = product.variants.filter((v) => v.name === "color").map((v) => v.value);
  const sizes = product.variants.filter((v) => v.name === "size").map((v) => v.value);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-brand-black/40 mb-6 flex-wrap">
        <Link href="/" className="hover:text-brand-black transition">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-brand-black transition">Shop</Link>
        <span>/</span>
        <Link href={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-brand-black transition">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-brand-black/80">{product.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
        {/* Gallery */}
        <div className="flex flex-col-reverse lg:flex-row gap-4">
          {product.images.length > 1 && (
            <div className="flex lg:flex-col gap-3 overflow-x-auto no-scrollbar">
              {product.images.slice(0, 6).map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImg(i)}
                  className={cn(
                    "shrink-0 w-16 h-16 lg:w-20 lg:h-20 rounded-xl overflow-hidden border-2 transition",
                    activeImg === i ? "border-brand-red" : "border-transparent opacity-60 hover:opacity-100"
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={absUrl(img.url)} alt={img.alt || product.title} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <div className="flex-1 relative aspect-square rounded-3xl overflow-hidden bg-gray-50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={absUrl(product.images[activeImg]?.url)}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            {product.badge && (
              <span className="absolute top-4 left-4 bg-brand-red text-brand-black text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
                {product.badge}
              </span>
            )}
            {discount && (
              <span className="absolute top-4 right-4 bg-white/70 text-brand-red text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
                Save {discount}%
              </span>
            )}
          </div>
        </div>

        {/* Details */}
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-brand-red font-semibold">
            {product.category}
          </p>
          <h1 className="mt-3 text-3xl md:text-5xl font-black tracking-tight text-brand-black">
            {product.title}
          </h1>
          {product.subtitle && (
            <p className="mt-2 text-brand-black/60 text-lg">{product.subtitle}</p>
          )}

          <div className="mt-4 flex items-center gap-3">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={cn("w-4 h-4", i < Math.round(product.rating) ? "fill-brand-gold text-brand-gold" : "text-brand-black/20")} />
              ))}
            </div>
            <span className="text-sm text-brand-black/60">
              {product.rating.toFixed(1)} · {product.reviews} reviews
            </span>
          </div>

          <div className="mt-6 flex items-center gap-3 flex-wrap">
            <span className="text-3xl font-black text-brand-black">{rupee(product.price)}</span>
            {product.oldPrice && (
              <span className="text-lg text-brand-black/40 line-through">{rupee(product.oldPrice)}</span>
            )}
            {discount && (
              <span className="bg-brand-red/15 text-brand-red text-xs font-bold uppercase tracking-widest px-2 py-1 rounded-full">
                Save {discount}%
              </span>
            )}
          </div>
          <p className="text-xs text-brand-black/40 mt-1">Inclusive of all taxes · Free shipping over ₹999</p>

          <p className="mt-6 text-brand-black/70 leading-relaxed">{product.description}</p>

          {colors.length > 0 && (
            <div className="mt-8">
              <p className="text-xs uppercase tracking-widest text-brand-black/50 mb-3">
                Color: <span className="text-brand-black font-semibold">{selectedColor}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    className={cn(
                      "px-4 py-2 text-xs uppercase tracking-widest rounded-full border transition",
                      selectedColor === c
                        ? "bg-brand-red text-brand-black border-brand-red"
                        : "bg-transparent text-brand-black/70 border-brand-black/20 hover:border-brand-black/10"
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {sizes.length > 0 && (
            <div className="mt-6">
              <p className="text-xs uppercase tracking-widest text-brand-black/50 mb-3">Size</p>
              <div className="flex flex-wrap gap-2">
                {sizes.map((s) => (
                  <span key={s} className="px-4 py-2 text-xs uppercase tracking-widest rounded-full bg-gray-50 text-brand-black/70 border border-brand-black/10">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {product.stock > 0 && product.stock <= 15 && (
            <div className="mt-6 inline-flex items-center gap-2 bg-brand-red/10 border border-brand-red/30 px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse" />
              <span className="text-xs uppercase tracking-widest text-brand-red font-bold">
                Only {product.stock} left — selling fast
              </span>
            </div>
          )}

          <div className="mt-8 flex items-stretch gap-3">
            <div className="flex items-center gap-1 bg-gray-50 border border-brand-black/10 rounded-full px-2">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-9 h-9 rounded-full text-brand-black/70 hover:bg-gray-100 transition flex items-center justify-center"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-semibold text-brand-black">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="w-9 h-9 rounded-full text-brand-black/70 hover:bg-gray-100 transition flex items-center justify-center"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              disabled={soldOut}
              onClick={() => {
                for (let i = 0; i < qty; i++) addToCart(product, selectedColor);
              }}
              className={cn(
                "flex-1 inline-flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-widest py-4 rounded-full transition",
                soldOut
                  ? "bg-gray-50 text-brand-black/40 cursor-not-allowed"
                  : "bg-brand-red hover:bg-brand-red-soft text-brand-black"
              )}
            >
              <ShoppingBag className="w-4 h-4" />
              {soldOut ? "Sold Out" : `Add to Bag — ${rupee(product.price * qty)}`}
            </button>

            <button
              onClick={() => setLiked((v) => !v)}
              className="w-14 bg-gray-50 border border-brand-black/10 rounded-full flex items-center justify-center text-brand-black/70 hover:text-brand-red transition"
              aria-label="Wishlist"
            >
              <Heart className={cn("w-5 h-5", liked && "fill-brand-red text-brand-red")} />
            </button>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3 text-center">
            {[
              { icon: Truck, label: "Free shipping ₹999+" },
              { icon: RefreshCw, label: "7-day returns" },
              { icon: Shield, label: "Secure checkout" },
            ].map((b) => (
              <div key={b.label} className="p-3 rounded-xl bg-gray-50 border border-brand-black/10">
                <b.icon className="w-4 h-4 mx-auto text-brand-red" />
                <p className="text-[10px] uppercase tracking-widest text-brand-black/60 mt-2">{b.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-32">
          <div className="flex items-end justify-between gap-4 mb-10">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-brand-black">
              You might also like
            </h2>
            <Link href="/shop" className="text-xs uppercase tracking-widest text-brand-red hover:underline">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-10">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
