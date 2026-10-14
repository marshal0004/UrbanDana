"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Hero from "@/components/sections/Hero";
import Stats from "@/components/sections/Stats";
import ThreeStyles from "@/components/sections/ThreeStyles";
import Features from "@/components/sections/Features";
import Founder from "@/components/sections/Founder";
import Testimonials from "@/components/sections/Testimonials";

export default function AboutPage() {
  return (
    <>
      <section className="relative min-h-[60vh] flex items-center">
        <div className="absolute inset-0 -z-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/about-hero.jpg"
            alt=""
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-black/40 via-brand-black/50 to-brand-black" />
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <p className="text-xs uppercase tracking-[0.4em] text-brand-red mb-4 font-semibold">
            Est. 2024 · India 🇮🇳
          </p>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-brand-black max-w-3xl">
            We didn&apos;t invent a cap.
            <br />
            We invented a <span className="text-brand-red">category</span>.
          </h1>
        </div>
      </section>

      <Stats />
      <Founder />
      <ThreeStyles />
      <Features />
      <Testimonials />

      <section className="py-24 md:py-32 text-center">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-4xl md:text-6xl font-black tracking-tight text-brand-black">
            Ready to find your cap?
          </h2>
          <p className="mt-4 text-brand-black/60 text-lg">
            Join 700+ happy heads across India. Handcrafted. Limited. Original.
          </p>
          <Link
            href="/shop"
            className="mt-8 inline-flex items-center gap-2 bg-brand-red hover:bg-brand-red-soft transition text-brand-black text-sm font-bold uppercase tracking-widest px-10 py-4 rounded-full"
          >
            Shop the Drop
          </Link>
        </div>
      </section>
    </>
  );
}
