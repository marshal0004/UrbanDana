import Hero from "@/components/sections/Hero";
import Stats from "@/components/sections/Stats";
import ThreeStyles from "@/components/sections/ThreeStyles";
import Features from "@/components/sections/Features";
import Founder from "@/components/sections/Founder";
import Testimonials from "@/components/sections/Testimonials";
import FeaturedProducts from "@/components/sections/FeaturedProducts";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <FeaturedProducts />
      <ThreeStyles />
      <Features />
      <Founder />
      <Testimonials />
    </>
  );
}
