"use client";
// /home/z/my-project/UrbanDana/frontend/src/components/drift/editorial/EditorialRooms.tsx
//
// Adapted from the "Sill" 8B template's #rooms section.
// Three product types as panels of different shapes, each with photo, text
// and price — plus an "Every cap has" list.
// Replaces PromoBanners section.

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const COLORS = {
  ink: "#0b0a0a",
  cream: "#f4f1ee",
  terracotta: "#cf6224",
  maroon: "#6e1116",
  purple: "#5a3cd4",
  beige: "#bca59d",
  mauve: "#a97d9c",
  rust: "#9b3418",
  sage: "#80a89b",
  gold: "#e3b867",
};

const FONT_DISPLAY = "Georgia, 'Times New Roman', serif";
const FONT_SANS = "Inter, system-ui, sans-serif";

export default function EditorialRooms() {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (reduced) return;
    const section = sectionRef.current;
    if (!section) return;
    let cancelled = false;
    let ctx: any = null;

    (async () => {
      try {
        const { default: gsap } = await import("gsap");
        const { default: ScrollTrigger } = await import("gsap/ScrollTrigger");
        if (cancelled || !section) return;
        gsap.registerPlugin(ScrollTrigger);

        ctx = gsap.context(() => {
          // Each room card clips-reveal from corner
          const rooms = section.querySelectorAll<HTMLElement>("[data-room]");
          rooms.forEach((room, i) => {
            gsap.fromTo(
              room,
              { clipPath: "inset(0 100% 100% 0)" },
              {
                clipPath: "inset(0 0% 0% 0)",
                duration: 1,
                ease: "power1.inOut",
                scrollTrigger: {
                  trigger: room,
                  start: "top 85%",
                  end: "bottom 75%",
                  scrub: 0.5,
                },
              }
            );
          });

          // Heading rise
          const head = section.querySelector<HTMLElement>("[data-heading]");
          if (head) {
            gsap.fromTo(
              head,
              { opacity: 0, y: 40 },
              {
                opacity: 1,
                y: 0,
                duration: 0.9,
                ease: "power3.out",
                scrollTrigger: { trigger: head, start: "top 88%", once: true },
              }
            );
          }
        }, section);
      } catch (err) {
        console.warn("EditorialRooms: GSAP failed.", err);
      }
    })();

    return () => {
      cancelled = true;
      if (ctx) ctx.revert();
    };
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      aria-label="Three shapes of product — Cap, Tee, Combo"
      style={{
        padding: "clamp(56px, 9vh, 110px) clamp(8px, 1.1vw, 16px) clamp(8px, 1.1vw, 16px)",
        background: COLORS.ink,
        color: COLORS.cream,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
          gridTemplateRows: "auto minmax(320px, 42vh) minmax(280px, 36vh)",
          gap: "clamp(8px, 1.1vw, 16px)",
        }}
      >
        {/* Header panel */}
        <div
          data-heading
          style={{
            gridColumn: "1 / 9",
            gridRow: "1",
            background: COLORS.beige,
            color: COLORS.ink,
            padding: "clamp(18px, 2.3vw, 34px)",
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr",
            gap: "18px 36px",
            alignContent: "end",
          }}
        >
          <h2
            style={{
              fontFamily: FONT_DISPLAY,
              fontSize: "clamp(2rem, 5vw, 4rem)",
              fontWeight: 700,
              lineHeight: 0.94,
              letterSpacing: "-0.03em",
              margin: 0,
            }}
          >
            Three shapes of product.
          </h2>
          <p style={{ fontFamily: FONT_SANS, fontSize: "clamp(1rem, 1.15vw, 1.125rem)", lineHeight: 1.5, margin: 0 }}>
            Caps you watch from, tees you layer, combos you gift. Tell us your moment
            and we give you the piece that fits.
          </p>
        </div>

        {/* Room 1: The Cap */}
        <article
          data-room
          style={{
            gridColumn: "1 / 9",
            gridRow: "2",
            display: "grid",
            gridTemplateColumns: "1fr 1.15fr",
            background: COLORS.sage,
            color: COLORS.ink,
            overflow: "hidden",
          }}
        >
          <div style={{ padding: "clamp(18px, 2.3vw, 34px)", display: "flex", flexDirection: "column", gap: "12px", order: 2 }}>
            <h3 style={{ fontFamily: FONT_DISPLAY, fontSize: "clamp(1.5rem, 2.3vw, 2.25rem)", fontWeight: 700, margin: 0 }}>
              The Cap
            </h3>
            <p style={{ fontFamily: FONT_SANS, fontSize: "1rem", lineHeight: 1.5, margin: 0 }}>
              For watchers. Hand-knotted bandana, structured visor, three ways to wear
              — forward, backward, folded low. The best view of every street.
            </p>
            <div style={{ marginTop: "auto", display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "6px 18px" }}>
              <strong style={{ fontFamily: FONT_DISPLAY, fontSize: "clamp(1.625rem, 2.4vw, 2.25rem)", fontWeight: 700, letterSpacing: "-0.02em" }}>
                ₹249
              </strong>
              <span style={{ fontFamily: FONT_SANS, fontSize: "13px", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                a cap · 12 colourways
              </span>
            </div>
            <Link
              href="/shop?category=Bandana Caps"
              style={{
                marginTop: "12px",
                display: "inline-flex",
                alignSelf: "flex-start",
                padding: "10px 20px",
                background: COLORS.ink,
                color: COLORS.cream,
                fontFamily: FONT_SANS,
                fontSize: "15px",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Shop Caps →
            </Link>
          </div>
          <div style={{ position: "relative", overflow: "hidden", order: 1, minHeight: "300px" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/editorial/pose_07.jpg"
              alt="Model wearing UrbanDana cap"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }}
              loading="lazy"
            />
          </div>
        </article>

        {/* Room 2: The Tee */}
        <article
          data-room
          style={{
            gridColumn: "9 / 13",
            gridRow: "1 / 4",
            display: "grid",
            gridTemplateRows: "minmax(0, 1.1fr) auto",
            background: COLORS.purple,
            color: COLORS.cream,
            overflow: "hidden",
          }}
        >
          <div style={{ position: "relative", overflow: "hidden", minHeight: "clamp(280px, 36vh, 460px)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/editorial/pose_08.jpg"
              alt="Model wearing UrbanDana t-shirt"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }}
              loading="lazy"
            />
          </div>
          <div style={{ padding: "clamp(18px, 2.3vw, 34px)", display: "flex", flexDirection: "column", gap: "12px" }}>
            <h3 style={{ fontFamily: FONT_DISPLAY, fontSize: "clamp(1.5rem, 2.3vw, 2.25rem)", fontWeight: 700, margin: 0 }}>
              The Tee
            </h3>
            <p style={{ fontFamily: FONT_SANS, fontSize: "1rem", lineHeight: 1.5, margin: 0 }}>
              For layers. 220 GSM combed cotton, oversized cut, silk-screen paisley.
              Pre-washed, true to size.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "6px 18px" }}>
              <strong style={{ fontFamily: FONT_DISPLAY, fontSize: "clamp(1.625rem, 2.4vw, 2.25rem)", fontWeight: 700, letterSpacing: "-0.02em" }}>
                ₹299
              </strong>
              <span style={{ fontFamily: FONT_SANS, fontSize: "13px", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                a tee · 15 designs
              </span>
            </div>
            <Link
              href="/shop?category=T-Shirts"
              style={{
                marginTop: "12px",
                display: "inline-flex",
                alignSelf: "flex-start",
                padding: "10px 20px",
                background: COLORS.cream,
                color: COLORS.ink,
                fontFamily: FONT_SANS,
                fontSize: "15px",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Shop Tees →
            </Link>
          </div>
        </article>

        {/* Room 3: The Combo */}
        <article
          data-room
          style={{
            gridColumn: "1 / 6",
            gridRow: "3",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            background: COLORS.maroon,
            color: COLORS.cream,
            overflow: "hidden",
          }}
        >
          <div style={{ position: "relative", overflow: "hidden", minHeight: "clamp(220px, 28vh, 360px)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/editorial/pose_09.jpg"
              alt="Model with UrbanDana combo"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }}
              loading="lazy"
            />
          </div>
          <div style={{ padding: "clamp(18px, 2.3vw, 34px)", display: "flex", flexDirection: "column", gap: "12px" }}>
            <h3 style={{ fontFamily: FONT_DISPLAY, fontSize: "clamp(1.5rem, 2.3vw, 2.25rem)", fontWeight: 700, margin: 0 }}>
              The Combo
            </h3>
            <p style={{ fontFamily: FONT_SANS, fontSize: "1rem", lineHeight: 1.5, margin: 0 }}>
              For gifts. One cap + one matching tee in a premium wooden box with
              numbered certificate.
            </p>
            <div style={{ marginTop: "auto", display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "6px 18px" }}>
              <strong style={{ fontFamily: FONT_DISPLAY, fontSize: "clamp(1.625rem, 2.4vw, 2.25rem)", fontWeight: 700, letterSpacing: "-0.02em" }}>
                ₹499
              </strong>
              <span style={{ fontFamily: FONT_SANS, fontSize: "13px", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                cap + tee · gift box
              </span>
            </div>
          </div>
        </article>

        {/* Every product has */}
        <div
          data-room
          style={{
            gridColumn: "6 / 9",
            gridRow: "3",
            padding: "clamp(18px, 2.3vw, 34px)",
            background: COLORS.gold,
            color: COLORS.ink,
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          <h3 style={{ fontFamily: FONT_DISPLAY, fontSize: "clamp(1.5rem, 2.3vw, 2.25rem)", fontWeight: 700, margin: 0 }}>
            Every piece has
          </h3>
          <ul style={{ display: "grid", gap: "8px", listStyle: "none", padding: 0, margin: 0, fontFamily: FONT_SANS, fontSize: "1rem", lineHeight: 1.5 }}>
            <li style={{ paddingLeft: "22px", position: "relative" }}>
              <span style={{ position: "absolute", left: 0, top: "0.5em", width: "10px", height: "10px", background: COLORS.ink }} />
              hand-finished cotton shell
            </li>
            <li style={{ paddingLeft: "22px", position: "relative" }}>
              <span style={{ position: "absolute", left: 0, top: "0.5em", width: "10px", height: "10px", background: COLORS.ink }} />
              a knot that holds from dawn to dusk
            </li>
            <li style={{ paddingLeft: "22px", position: "relative" }}>
              <span style={{ position: "absolute", left: 0, top: "0.5em", width: "10px", height: "10px", background: COLORS.ink }} />
              numbered authenticity tag
            </li>
            <li style={{ paddingLeft: "22px", position: "relative" }}>
              <span style={{ position: "absolute", left: 0, top: "0.5em", width: "10px", height: "10px", background: COLORS.ink }} />
              made in Dehradun, India
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
