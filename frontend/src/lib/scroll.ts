// /home/z/my-project/UrbanDana/frontend/src/lib/scroll.ts
import Lenis from "lenis";

type Tick = (time: number) => void;
const subscribers = new Set<Tick>();
let lenis: Lenis | null = null;

export function startScroll(reducedMotion: boolean): () => void {
  if (!reducedMotion) {
    lenis = new Lenis({ lerp: 0.09, smoothWheel: true, wheelMultiplier: 0.9 });
  }
  let raf = 0;
  const loop = (time: number) => {
    lenis?.raf(time);
    subscribers.forEach((fn) => fn(time));
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);
  return () => {
    cancelAnimationFrame(raf);
    lenis?.destroy();
    lenis = null;
  };
}

export function onFrame(fn: Tick): () => void {
  subscribers.add(fn);
  return () => { subscribers.delete(fn); };
}

export function scrollToHash(hash: string) {
  const target = hash === "#top" ? 0 : document.querySelector<HTMLElement>(hash);
  if (target === null) return;
  if (lenis) { lenis.scrollTo(target, { duration: 1.6 }); }
  else if (typeof target === "number") { window.scrollTo({ top: target }); }
  else { target.scrollIntoView(); }
}
