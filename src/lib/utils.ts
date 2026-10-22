export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

const NAME_PREFIXES = new Set(["md", "md.", "mohammad", "mohammed", "muhammad", "mohd", "mst", "mst."]);

/** The name people actually use, e.g. "Muhammad Zarirul Islam" → "Zarirul". */
export function shortName(fullName: string) {
  const words = fullName.trim().split(/\s+/);
  return words.find((w) => !NAME_PREFIXES.has(w.toLowerCase())) ?? words[0] ?? "";
}

/**
 * Google Drive share links open a viewer page, not the image itself.
 * Turn them into a direct image URL; other URLs are returned unchanged.
 */
export function toDirectImageUrl(url: string) {
  if (!/drive\.google\.com|docs\.google\.com/.test(url)) return url;
  const id = url.match(/\/d\/([\w-]{10,})/)?.[1] ?? url.match(/[?&]id=([\w-]{10,})/)?.[1];
  return id ? `https://lh3.googleusercontent.com/d/${id}` : url;
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function formatDate(value: string | null | undefined) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export function readingTime(text: string | null) {
  const words = (text ?? "").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
