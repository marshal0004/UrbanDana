import Hero from "@/components/sections/Hero";
import Stats from "@/components/sections/Stats";
import CategoriesGrid from "@/components/sections/CategoriesGrid";
import TrendingWithChips from "@/components/sections/TrendingWithChips";
import PromoBanner from "@/components/sections/PromoBanner";
import ThreeStyles from "@/components/sections/ThreeStyles";
import Features from "@/components/sections/Features";
import Founder from "@/components/sections/Founder";
import Testimonials from "@/components/sections/Testimonials";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <CategoriesGrid />
      <TrendingWithChips />
      <PromoBanner />
      <ThreeStyles />
      <Features />
      <Founder />
      <Testimonials />
    </>
  );
}
