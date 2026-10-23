"use client";
// /home/z/my-project/UrbanDana/frontend/src/components/drift/editorial/EditorialDay.tsx
//
// Adapted from the "Sill" 8B template's #day section.
// Pinned horizontal track of 6 timed panels under a sky band — shows how
// UrbanDana fits into a customer's day from 07:00 to 22:00.
//
// The Sill template pins the section vertically and translates the track
// horizontally based on scroll progress. We replicate that here.

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

const HOURS = [
  {
    time: "07:00",
    title: "Morning stretch",
    body: "Cap goes on with the coffee. Knot-tie forward — clean everyday look that pairs with everything.",
    color: COLORS.purple,
    textColor: COLORS.cream,
    photo: "/images/editorial/pose_03.jpg",
  },
  {
    time: "10:00",
    title: "Coffee run",
    body: "Folded low for the metro. Minimal, retro, ultra-breathable for the warm commute.",
    color: COLORS.terracotta,
    textColor: COLORS.ink,
    photo: "/images/editorial/pose_04.jpg",
  },
  {
    time: "13:00",
    title: "Lunch break",
    body: "Backward for the office canteen. Bold street energy — visor frames the back of the head.",
    color: COLORS.cream,
    textColor: COLORS.ink,
    photo: "/images/editorial/pose_05.jpg",
  },
  {
    time: "16:00",
    title: "Afternoon walk",
    body: "Tee layered under a jacket. 220 GSM combed cotton holds its shape through the day.",
    color: COLORS.sage,
    textColor: COLORS.ink,
    photo: "/images/editorial/pose_06.jpg",
  },
  {
    time: "19:00",
    title: "Evening hang",
    body: "Signature Paisley for the bar. Hand-drawn motif catches the warm light, gets noticed.",
    color: COLORS.maroon,
    textColor: COLORS.cream,
    photo: "/images/editorial/pose_07.jpg",
  },
  {
    time: "22:00",
    title: "Night out",
    body: "Sunset Art Cap — hand-drawn sun motif in golden orange against deep indigo. Only 200 made.",
    color: COLORS.gold,
    textColor: COLORS.ink,
    photo: "/images/editorial/pose_08.jpg",
  },
];

// Sky-band background colors cycle through warm tones (sunrise → sunset → night)
const SKY_COLORS = [COLORS.terracotta, COLORS.gold, COLORS.sage, COLORS.beige, COLORS.mauve, COLORS.ink];

export default function EditorialDay() {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLOListElement | null>(null);
  const skyRef = useRef<HTMLDivElement | null>(null);
  const discRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (reduced) return;
    const section = sectionRef.current;
    const stage = stageRef.current;
    const track = trackRef.current;
    const sky = skyRef.current;
    const disc = discRef.current;
    if (!section || !stage || !track || !sky || !disc) return;

    let cancelled = false;
    let ctx: any = null;

    (async () => {
      try {
        const { default: gsap } = await import("gsap");
        const { default: ScrollTrigger } = await import("gsap/ScrollTrigger");
        if (cancelled || !section || !stage || !track || !sky || !disc) return;
        gsap.registerPlugin(ScrollTrigger);

        ctx = gsap.context(() => {
          // Pinned horizontal scroll: track translates left as user scrolls
          const travel = () => Math.max(0, track.scrollWidth - stage.clientWidth);

          const timeline = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: () => `+=${Math.max(window.innerHeight, travel() * 1.15)}`,
              pin: stage,
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          });

          // Translate track horizontally
          timeline.fromTo(track, { x: 0 }, { x: () => -travel(), duration: 1 }, 0);

          // Sky band: cycle through colors (sunrise → sunset → night)
          SKY_COLORS.slice(1).forEach((color, i) => {
            timeline.to(sky, {
              backgroundColor: color,
              duration: 1 / (SKY_COLORS.length - 1),
            }, i / (SKY_COLORS.length - 1));
          });

          // Disc (sun/moon): travels across the sky
          timeline.fromTo(
            disc,
            { x: () => sky.clientWidth * 0.06 },
            { x: () => sky.clientWidth - disc.offsetWidth - sky.clientWidth * 0.06, duration: 1 },
            0
          );
          // Disc rises then sets
          timeline.fromTo(
            disc,
            { y: () => sky.clientHeight + 4 },
            { y: () => sky.clientHeight * 0.12, duration: 0.42, ease: "sine.out" },
            0.02
          );
          timeline.to(
            disc,
            { y: () => sky.clientHeight + 4, duration: 0.4, ease: "sine.in" },
            0.58
          );
        }, section);
      } catch (err) {
        console.warn("EditorialDay: GSAP failed.", err);
      }
    })();

    return () => {
      cancelled = true;
      if (ctx) ctx.revert();
    };
  }, [reduced]);

  // Mobile / reduced-motion: stack vertically (no pinning)
  const useNativeScroll = reduced;

  return (
    <section
      ref={sectionRef}
      aria-label="A day at UrbanDana — six moments"
      style={{
        padding: useNativeScroll ? "clamp(56px, 9vh, 110px) clamp(8px, 1.1vw, 16px)" : "0",
        background: COLORS.ink,
        color: COLORS.cream,
      }}
    >
      <div
        ref={stageRef}
        style={
          useNativeScroll
            ? { display: "grid", gap: "clamp(8px, 1.1vw, 16px)" }
            : {
                height: "100vh",
                padding: "80px clamp(8px, 1.1vw, 16px) clamp(8px, 1.1vw, 16px)",
                display: "grid",
                gridTemplateRows: "auto minmax(0, 0.5fr) minmax(0, 1fr)",
                gap: "clamp(8px, 1.1vw, 16px)",
                overflow: "hidden",
              }
        }
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: "12px 40px",
            padding: "0 10px 10px",
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
              color: COLORS.gold,
            }}
          >
            A day at UrbanDana.
          </h2>
          <p
            style={{
              fontFamily: FONT_SANS,
              fontSize: "1rem",
              lineHeight: 1.5,
              margin: 0,
              maxWidth: "36ch",
            }}
          >
            The same hours every day. Three looks from one cap — wear it forward,
            backward, or fold it low.
          </p>
        </div>

        {/* Sky band — only shown when pinned (desktop) */}
        {!useNativeScroll ? (
          <div
            ref={skyRef}
            style={{
              position: "relative",
              overflow: "hidden",
              background: COLORS.terracotta,
              minHeight: "60px",
            }}
            aria-hidden
          >
            <div
              ref={discRef}
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: "clamp(84px, 15vmin, 160px)",
                aspectRatio: "1",
                borderRadius: "50%",
                background: COLORS.ink,
              }}
            />
          </div>
        ) : null}

        {/* Horizontal track (or vertical stack on mobile) */}
        <div style={{ overflow: useNativeScroll ? "visible" : "hidden", minHeight: useNativeScroll ? "0" : "0", display: useNativeScroll ? "block" : "flex" }}>
          <ol
            ref={trackRef}
            style={
              useNativeScroll
                ? {
                    display: "grid",
                    gridTemplateColumns: "1fr",
                    gap: "clamp(8px, 1.1vw, 16px)",
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                  }
                : {
                    display: "flex",
                    width: "max-content",
                    height: "100%",
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    gap: "clamp(8px, 1.1vw, 16px)",
                  }
            }
          >
            {HOURS.map((hour, i) => (
              <li
                key={i}
                style={{
                  ...(useNativeScroll
                    ? {}
                    : { width: "clamp(290px, 31vw, 450px)", paddingTop: "clamp(16px, 2vw, 28px)" }),
                  display: "flex",
                  flexDirection: "column",
                  gap: useNativeScroll ? "16px" : "6px",
                  padding: useNativeScroll ? "clamp(18px, 2.3vw, 34px)" : "clamp(18px, 2.3vw, 34px) clamp(18px, 2.3vw, 34px) 0",
                  background: hour.color,
                  color: hour.textColor,
                  overflow: "hidden",
                }}
              >
                <p
                  style={{
                    fontFamily: FONT_DISPLAY,
                    fontSize: "clamp(2.5rem, 4.2vw, 4rem)",
                    fontWeight: 700,
                    letterSpacing: "-0.03em",
                    lineHeight: 1,
                    margin: 0,
                  }}
                >
                  {hour.time}
                </p>
                <h3
                  style={{
                    fontFamily: FONT_DISPLAY,
                    fontSize: "clamp(1.5rem, 2.3vw, 2.25rem)",
                    fontWeight: 700,
                    margin: 0,
                  }}
                >
                  {hour.title}
                </h3>
                <p
                  style={{
                    fontFamily: FONT_SANS,
                    fontSize: "1rem",
                    lineHeight: 1.5,
                    margin: 0,
                    maxWidth: "34ch",
                  }}
                >
                  {hour.body}
                </p>
                <div
                  style={{
                    aspectRatio: useNativeScroll ? "16 / 9" : "auto",
                    flex: useNativeScroll ? "none" : "1 1 0",
                    minHeight: useNativeScroll ? "0" : "90px",
                    marginTop: useNativeScroll ? "0" : "auto",
                    marginLeft: useNativeScroll ? "0" : "calc(-1 * clamp(18px, 2.3vw, 34px))",
                    marginRight: useNativeScroll ? "0" : "calc(-1 * clamp(18px, 2.3vw, 34px))",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={hour.photo}
                    alt={`Model pose for ${hour.time} — ${hour.title}`}
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                    loading="lazy"
                  />
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
