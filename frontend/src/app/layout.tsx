import type { Metadata } from "next";
import "./globals.css";
import { ShopProvider } from "@/context/ShopContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import Marquee from "@/components/Marquee";

export const metadata: Metadata = {
  title: "URBANDANA — India's Original Bandana Cap | Style That Never Stops",
  description:
    "Shop India's original 3-in-1 bandana cap. Handcrafted in India. Wear it forward, backward, or folded low. Free shipping over ₹999. 7-day returns.",
  keywords: ["bandana cap", "urbandana", "indian streetwear", "handcrafted caps", "oversized cap", "visor"],
  openGraph: {
    title: "URBANDANA — India's Original Bandana Cap",
    description: "Style That Never Stops. Handcrafted in India 🇮🇳",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="aurora-bg min-h-screen bg-brand-black text-paper antialiased">
        <ShopProvider>
          <Marquee />
          <Navbar />
          <main className="relative z-10">{children}</main>
          <Footer />
          <CartDrawer />
        </ShopProvider>
      </body>
    </html>
  );
}
