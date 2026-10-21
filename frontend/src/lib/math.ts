// /home/z/my-project/UrbanDana/frontend/src/lib/math.ts
export function clamp(v: number, min = 0, max = 1): number {
  return Math.min(max, Math.max(min, v));
}
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}
export function range(v: number, min: number, max: number): number {
  return clamp((v - min) / (max - min));
}
export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}
export function pinProgress(root: HTMLElement): { p: number; rect: DOMRect } {
  const rect = root.getBoundingClientRect();
  const vh = window.innerHeight || 1;
  const total = root.offsetHeight - vh;
  const p = total > 0 ? clamp(-rect.top / total) : 0;
  return { p, rect };
}
