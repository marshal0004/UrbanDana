"use client";
// /home/z/my-project/UrbanDana/frontend/src/components/drift/editorial/EditorialLetters.tsx
//
// Adapted from the "Sill" 8B template's #letters section.
// Three short customer notes in a handwriting-style font with model photos
// — works as testimonials. Replaces ProductCarousel #2 (T-Shirts).

import { useEffect, useRef } from "react";
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
const FONT_SCRIPT = "'Brush Script MT', cursive";

const LETTERS = [
  {
    date: "Tuesday, 18:40 · Mumbai",
    color: COLORS.maroon,
    textColor: COLORS.cream,
    photo: "/images/editorial/pose_10.jpg",
    body: "Dear UrbanDana, the Signature Paisley arrived on Tuesday. Aarav has claimed it for office days and will not discuss it. The knot stays tight from morning coffee to evening gym. Genuinely the most versatile cap I own.",
    sign: "— Aarav S.",
  },
  {
    date: "Wednesday, 18:35 · Bengaluru",
    color: COLORS.gold,
    textColor: COLORS.ink,
    photo: "/images/editorial/pose_11.jpg",
    body: "The Sunset Art Cap is unreal in person. Hand-drawn sun motif gets stopped on the street. Worth every rupee — and only 200 made! The numbered tag made it feel like opening a luxury watch.",
    sign: "— Riya M.",
  },
  {
    date: "Thursday, 18:50 · Delhi",
    color: COLORS.mauve,
    textColor: COLORS.ink,
    photo: "/images/editorial/pose_12.jpg",
    body: "Finally a cap that breathes. I sweat through normal caps in summer — the bandana top lets air in. My go-to for cricket matches now. Three looks from one cap — genius. Folded low for the metro, forward for the stadium.",
    sign: "— Karan D.",
  },
];

export default function EditorialLetters() {
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
          // Each letter: photo "peek" — slide up from below
          const letters = section.querySelectorAll<HTMLElement>("[data-letter]");
          letters.forEach((letter, i) => {
            const photo = letter.querySelector<HTMLElement>("[data-photo] img");
            if (photo) {
              gsap.fromTo(
                photo,
                { yPercent: 42 },
                {
                  yPercent: 0,
                  ease: "none",
                  scrollTrigger: {
                    trigger: letter,
                    start: "top bottom",
                    end: "top 40%",
                    scrub: 0.5,
                  },
                }
              );
            }
            // Letter body fade-in
            const body = letter.querySelector<HTMLElement>("[data-body]");
            if (body) {
              gsap.fromTo(
                body,
                { opacity: 0, y: 30 },
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.8,
                  ease: "power3.out",
                  scrollTrigger: { trigger: letter, start: "top 80%", once: true },
                }
              );
            }
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
        console.warn("EditorialLetters: GSAP failed.", err);
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
      aria-label="A letter every evening — customer notes"
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
          gap: "clamp(8px, 1.1vw, 16px)",
        }}
      >
        {/* Intro */}
        <div
          style={{
            gridColumn: "1 / 5",
            gridRow: "1 / 3",
            display: "flex",
            flexDirection: "column",
            gap: "22px",
            padding: "10px clamp(18px, 2.3vw, 34px) clamp(18px, 2.3vw, 34px) 10px",
          }}
        >
          <h2
            data-heading
            style={{
              fontFamily: FONT_DISPLAY,
              fontSize: "clamp(2rem, 5vw, 4rem)",
              fontWeight: 700,
              lineHeight: 0.94,
              letterSpacing: "-0.03em",
              margin: 0,
              color: COLORS.gold,
            }}
          >
            A letter every evening.
          </h2>
          <p
            style={{
              fontFamily: FONT_SANS,
              fontSize: "clamp(1.125rem, 1.55vw, 1.375rem)",
              lineHeight: 1.4,
              margin: 0,
            }}
          >
            Every cap leaves Dehradun with a hand-written note from the maker. Owners
            write back too — what was worn, where it went, one photo. No app to install,
            just letters you will want to keep.
          </p>
          <p
            style={{
              fontFamily: FONT_SCRIPT,
              fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
              color: COLORS.terracotta,
              margin: "auto 0 0",
            }}
          >
            700+ happy heads
          </p>
        </div>

        {/* Letters list */}
        <div
          style={{
            gridColumn: "5 / 13",
            gridRow: "1 / 3",
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: "clamp(8px, 1.1vw, 16px)",
          }}
        >
          {LETTERS.map((letter, i) => (
            <article
              key={i}
              data-letter
              style={{
                display: "grid",
                gridTemplateColumns: i === 0 ? "0.9fr 1.1fr" : "1fr",
                background: letter.color,
                color: letter.textColor,
                overflow: "hidden",
                ...(i === 0 ? { gridColumn: "1 / 3" } : {}),
              }}
            >
              <div
                data-photo
                style={{
                  position: "relative",
                  aspectRatio: i === 0 ? "auto" : "4 / 3",
                  minHeight: i === 0 ? "340px" : "0",
                  overflow: "hidden",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={letter.photo}
                  alt={`Customer ${letter.sign} wearing UrbanDana`}
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                  loading="lazy"
                />
              </div>
              <div
                data-body
                style={{
                  padding: "clamp(18px, 2.3vw, 34px)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <p
                  style={{
                    fontFamily: FONT_SANS,
                    fontSize: "13px",
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    margin: 0,
                  }}
                >
                  {letter.date}
                </p>
                <p
                  style={{
                    fontFamily: FONT_SCRIPT,
                    fontSize: "clamp(0.95rem, 1.15vw, 1.0625rem)",
                    fontWeight: 400,
                    lineHeight: 1.9,
                    margin: 0,
                  }}
                >
                  {letter.body}
                </p>
                <p
                  style={{
                    fontFamily: FONT_SCRIPT,
                    fontSize: "clamp(1.125rem, 1.55vw, 1.375rem)",
                    marginTop: "auto",
                    margin: 0,
                  }}
                >
                  {letter.sign}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
