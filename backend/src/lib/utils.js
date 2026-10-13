/** Format paise to ₹ string */
export function rupee(paise) {
  return `₹${(paise / 100).toLocaleString("en-IN")}`;
}

/** Slugify a title */
export function slugify(s) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function generateOrderNumber() {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `UD-${ts}-${rand}`;
}
