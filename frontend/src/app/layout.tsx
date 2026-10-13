import type { Metadata } from "next";
import "./globals.css";
import { ShopProvider } from "@/context/ShopContext";
import { AuthProvider } from "@/context/AuthContext";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";

export const metadata: Metadata = {
  title: "URBANDANA — India's Original Bandana Cap | Style That Never Stops",
  description:
    "Shop India's original 3-in-1 bandana cap + premium graphic tees. Handcrafted in India. Wear it forward, backward, or folded low. Free shipping over ₹999. 7-day returns.",
  keywords: ["bandana cap", "urbandana", "indian streetwear", "handcrafted caps", "oversized t-shirts", "visor", "limited drops"],
  openGraph: {
    title: "URBANDANA — India's Original Bandana Cap",
    description: "Style That Never Stops. Handcrafted in India 🇮🇳. Caps + Tees.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-brand-black text-paper antialiased">
        <AuthProvider>
          <ShopProvider>
            <TopBar />
            <Navbar />
            <main className="relative z-10 min-h-[60vh]">{children}</main>
            <Footer />
            <CartDrawer />
          </ShopProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
