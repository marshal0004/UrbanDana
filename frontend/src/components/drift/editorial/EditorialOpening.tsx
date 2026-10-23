"use client";
// /home/z/my-project/UrbanDana/frontend/src/components/drift/editorial/EditorialOpening.tsx
//
// Adapted from the "Sill" 8B template's #opening section.
// Two-screen editorial opener:
//   Screen 1: Grid of colored panels with headline, model photo, intro text,
//             price, and CTAs (replaces ProductCarousel #1 — Caps & Combos).
//   Screen 2: Facade of 12 colored "windows" — 6 with model poses (instead
//             of cats), 6 plain colored panels with style names.
//
// Color palette (port from Sill template tokens):
//   --ink #0b0a0a, --cream #f4f1ee, --terracotta #cf6224, --maroon #6e1116,
//   --purple #5a3cd4, --beige #bca59d, --mauve #a97d9c, --rust #9b3418,
//   --sage #80a89b, --gold #e3b867
//
// All styles are inline (self-contained — doesn't depend on globals.css
// having DRIFT tokens). Uses Tailwind for layout only.

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
const FONT_SCRIPT = "'Brush Script MT', cursive";

// 12 "windows" — 6 with model poses, 6 plain colored panels with style names
const WINDOWS = [
  { type: "plain", color: COLORS.terracotta, label: "01 · Forward" },
  { type: "photo", color: COLORS.maroon, image: "/images/editorial/pose_01.jpg", label: "02 · Street" },
  { type: "plain", color: COLORS.purple, label: "03 · Backward" },
  { type: "plain", color: COLORS.gold, label: "04 · Folded" },
  { type: "plain", color: COLORS.beige, label: "05 · Casual" },
  { type: "photo", color: COLORS.mauve, image: "/images/editorial/pose_02.jpg", label: "06 · Bold" },
  { type: "photo", color: COLORS.sage, image: "/images/editorial/pose_03.jpg", label: "07 · Heritage" },
  { type: "plain", color: COLORS.maroon, label: "08 · Tower" },
  { type: "plain", color: COLORS.mauve, label: "09 · Ledge" },
  { type: "photo", color: COLORS.terracotta, image: "/images/editorial/pose_04.jpg", label: "10 · Party" },
  { type: "plain", color: COLORS.beige, label: "11 · Travel" },
  { type: "photo", color: COLORS.gold, image: "/images/editorial/pose_05.jpg", label: "12 · Office" },
];

export default function EditorialOpening() {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const s1Ref = useRef<HTMLDivElement | null>(null);
  const s2Ref = useRef<HTMLDivElement | null>(null);
  const windowsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (reduced) return;
    const section = sectionRef.current;
    const s1 = s1Ref.current;
    const s2 = s2Ref.current;
    const windowsWrap = windowsRef.current;
    if (!section || !s1 || !s2 || !windowsWrap) return;

    let ctx: gsap.Context | null = null;
    let cancelled = false;

    (async () => {
      try {
        const { default: gsapMod } = await import("gsap");
        const { default: ScrollTriggerMod } = await import("gsap/ScrollTrigger");
        if (cancelled) return;
        const gsap = gsapMod;
        const ScrollTrigger = ScrollTriggerMod;
        gsap.registerPlugin(ScrollTrigger);

        ctx = gsap.context(() => {
          // Panel entrance animations (screen 1)
          const panels = s1.querySelectorAll<HTMLElement>("[data-panel]");
          panels.forEach((panel, i) => {
            gsap.fromTo(
              panel,
              { opacity: 0, y: 40 },
              {
                opacity: 1,
                y: 0,
                duration: 0.9,
                delay: 0.05 * i,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: s1,
                  start: "top 80%",
                  once: true,
                },
              }
            );
          });

          // Photo parallax (screen 1 hero photo)
          const heroPhoto = s1.querySelector<HTMLElement>("[data-hero-photo] img");
          if (heroPhoto) {
            gsap.fromTo(
              heroPhoto,
              { yPercent: -8 },
              {
                yPercent: 8,
                ease: "none",
                scrollTrigger: {
                  trigger: s1,
                  start: "top top",
                  end: "bottom top",
                  scrub: 1,
                },
              }
            );
          }

          // Window reveal animations (screen 2) — clip-path inset reveal
          const wins = windowsWrap.querySelectorAll<HTMLElement>("[data-window]");
          wins.forEach((win, i) => {
            const photo = win.querySelector<HTMLElement>("img");
            gsap.fromTo(
              win,
              { clipPath: "inset(100% 0% 0% 0%)" },
              {
                clipPath: "inset(0% 0% 0% 0%)",
                duration: 0.6,
                ease: "power1.out",
                scrollTrigger: {
                  trigger: s2,
                  start: "top 80%",
                  end: "bottom 60%",
                  scrub: 0.5,
                },
                delay: i * 0.02,
              }
            );
            if (photo) {
              gsap.fromTo(
                photo,
                { yPercent: 45 },
                {
                  yPercent: 0,
                  duration: 0.4,
                  ease: "power2.out",
                  scrollTrigger: {
                    trigger: s2,
                    start: "top 80%",
                    end: "bottom 60%",
                    scrub: 0.5,
                  },
                }
              );
            }
          });
        }, section);
      } catch (err) {
        console.warn("EditorialOpening: GSAP failed, leaving panels visible.", err);
      }
    })();

    return () => {
      cancelled = true;
      if (ctx) ctx.revert();
    };
  }, [reduced]);

  return (
    <section ref={sectionRef} aria-label="Editorial opening — Caps for every mood">
      {/* === SCREEN 1: Grid of colored panels with headline, photo, price, CTAs === */}
      <div
        ref={s1Ref}
        className="relative z-10"
        style={{
          minHeight: "100vh",
          padding: "80px clamp(8px, 1.1vw, 16px) clamp(8px, 1.1vw, 16px)",
          background: COLORS.ink,
          color: COLORS.cream,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
            gridTemplateRows: "minmax(0, 1.2fr) minmax(0, 1fr)",
            gap: "clamp(8px, 1.1vw, 16px)",
            height: "calc(100vh - 96px)",
          }}
        >
          {/* Panel A: Headline */}
          <div
            data-panel
            style={{
              gridColumn: "1 / 9",
              gridRow: "1",
              background: COLORS.terracotta,
              color: COLORS.ink,
              padding: "clamp(18px, 2.3vw, 34px)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
            }}
          >
            <h1
              style={{
                fontFamily: FONT_DISPLAY,
                fontSize: "clamp(2.5rem, 8.6vw, 8rem)",
                fontWeight: 700,
                lineHeight: 0.9,
                letterSpacing: "-0.035em",
                maxWidth: "7em",
              }}
            >
              Caps for every mood.
            </h1>
          </div>

          {/* Panel B: Hero model photo */}
          <div
            data-panel
            style={{
              gridColumn: "9 / 13",
              gridRow: "1 / 3",
              background: COLORS.mauve,
              color: COLORS.ink,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              data-hero-photo
              style={{ flex: 1, position: "relative", overflow: "hidden", minHeight: 0 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/editorial/pose_06.jpg"
                alt="Model wearing UrbanDana cap in a styled editorial pose"
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "124%",
                  left: "-12%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "50% 30%",
                }}
                loading="lazy"
              />
            </div>
            <p
              style={{
                fontFamily: FONT_SANS,
                fontSize: "13px",
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                padding: "16px clamp(18px, 2.3vw, 34px) 18px",
              }}
            >
              Pose 06 · Signature Paisley · ₹249
            </p>
          </div>

          {/* Panel C: Intro text */}
          <div
            data-panel
            style={{
              gridColumn: "1 / 4",
              gridRow: "2",
              background: COLORS.purple,
              color: COLORS.cream,
              padding: "clamp(18px, 2.3vw, 34px)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
            }}
          >
            <p
              style={{
                fontFamily: FONT_SANS,
                fontSize: "clamp(1.125rem, 1.55vw, 1.375rem)",
                fontWeight: 400,
                lineHeight: 1.4,
              }}
            >
              Twelve signature colourways in a quiet workshop in Dehradun. Each cap
              hand-cut, hand-knotted, hand-finished — for every you, in every moment.
            </p>
          </div>

          {/* Panel D: Price + CTAs */}
          <div
            data-panel
            style={{
              gridColumn: "4 / 7",
              gridRow: "2",
              background: COLORS.maroon,
              color: COLORS.cream,
              padding: "clamp(18px, 2.3vw, 34px)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: "14px",
            }}
          >
            <p
              style={{
                fontFamily: FONT_SANS,
                fontSize: "13px",
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              From ₹249 a cap · 3 ways to wear
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "14px 22px" }}>
              <Link
                href="/shop?category=Bandana Caps"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "52px",
                  padding: "14px 26px",
                  background: COLORS.ink,
                  color: COLORS.cream,
                  fontFamily: FONT_SANS,
                  fontSize: "16px",
                  fontWeight: 600,
                  textDecoration: "none",
                  borderRadius: "0",
                }}
              >
                Shop Caps →
              </Link>
              <Link
                href="/about"
                style={{
                  color: COLORS.cream,
                  fontFamily: FONT_SANS,
                  fontSize: "15px",
                  fontWeight: 600,
                  textDecoration: "underline",
                  textDecorationThickness: "2px",
                  textUnderlineOffset: "3px",
                }}
              >
                See the workshop
              </Link>
            </div>
          </div>

          {/* Panel E: Combo promo */}
          <div
            data-panel
            style={{
              gridColumn: "7 / 9",
              gridRow: "2",
              background: COLORS.gold,
              color: COLORS.ink,
              padding: "clamp(18px, 2.3vw, 34px)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: "8px",
            }}
          >
            <p
              style={{
                fontFamily: FONT_SANS,
                fontSize: "13px",
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              Cap + Tee Combo
            </p>
            <p style={{ fontFamily: FONT_SANS, fontSize: "16px", lineHeight: 1.4 }}>
              Get the complete look. ₹499 for a matching cap and tee in a gift box.
            </p>
            <Link
              href="/shop?category=Combo"
              style={{
                color: COLORS.ink,
                fontFamily: FONT_SANS,
                fontSize: "15px",
                fontWeight: 600,
                textDecoration: "underline",
                textDecorationThickness: "2px",
                textUnderlineOffset: "3px",
              }}
            >
              Shop Combos →
            </Link>
          </div>
        </div>
      </div>

      {/* === SCREEN 2: Facade of 12 colored "windows" === */}
      <div
        ref={s2Ref}
        className="relative z-10"
        style={{
          minHeight: "100vh",
          padding: "80px clamp(8px, 1.1vw, 16px) clamp(8px, 1.1vw, 16px)",
          background: COLORS.ink,
          color: COLORS.cream,
          display: "grid",
          gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
          gap: "clamp(8px, 1.1vw, 16px)",
        }}
      >
        {/* Left text column */}
        <div
          style={{
            gridColumn: "1 / 5",
            alignSelf: "start",
            display: "flex",
            flexDirection: "column",
            gap: "22px",
            padding: "0 clamp(18px, 2.3vw, 34px) clamp(18px, 2.3vw, 34px) 10px",
          }}
        >
          <h2
            style={{
              fontFamily: FONT_DISPLAY,
              fontSize: "clamp(2.25rem, 5vw, 4.5rem)",
              fontWeight: 700,
              lineHeight: 0.94,
              letterSpacing: "-0.03em",
            }}
          >
            Twelve caps, twelve windows.
          </h2>
          <p
            style={{
              fontFamily: FONT_SANS,
              fontSize: "clamp(1.125rem, 1.55vw, 1.375rem)",
              fontWeight: 400,
              lineHeight: 1.4,
            }}
          >
            Every cap is built around its moment: a knot-tie that holds from dawn to
            dusk, a cotton shell that breathes in summer, a visor that frames the
            light. The lamps go on at seven.
          </p>
          <Link
            href="/shop?category=Bandana Caps"
            style={{
              color: COLORS.gold,
              fontFamily: FONT_SANS,
              fontSize: "15px",
              fontWeight: 600,
              textDecoration: "underline",
              textDecorationThickness: "2px",
              textUnderlineOffset: "3px",
            }}
          >
            Walk through the collection →
          </Link>
        </div>

        {/* 12-window facade */}
        <div
          ref={windowsRef}
          style={{
            gridColumn: "5 / 13",
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gridTemplateRows: "repeat(3, minmax(0, 1fr))",
            gap: "clamp(8px, 1.1vw, 16px)",
          }}
        >
          {WINDOWS.map((win, i) => (
            <div
              key={i}
              data-window
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                minHeight: "150px",
                overflow: "hidden",
                background: win.color,
                color: COLORS.ink,
                clipPath: "inset(0 0 0 0)",
              }}
            >
              {win.type === "photo" ? (
                <>
                  <div style={{ position: "absolute", inset: "0 0 42px", overflow: "hidden" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={win.image}
                      alt={`Model pose ${i + 1} — UrbanDana editorial`}
                      style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      loading="lazy"
                    />
                  </div>
                  <p
                    style={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      bottom: 0,
                      height: "42px",
                      padding: "10px 12px 0",
                      borderTop: `clamp(8px, 1.1vw, 16px) solid ${COLORS.ink}`,
                      background: win.color,
                      color: COLORS.ink,
                      fontFamily: FONT_SANS,
                      fontSize: "13px",
                      fontWeight: 600,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      margin: 0,
                    }}
                  >
                    {win.label}
                  </p>
                </>
              ) : (
                <p
                  style={{
                    padding: "10px 12px 0",
                    fontFamily: FONT_SANS,
                    fontSize: "13px",
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    margin: 0,
                  }}
                >
                  {win.label}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
