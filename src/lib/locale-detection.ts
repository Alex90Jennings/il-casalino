// Server-side locale resolution for the root route.
//
// Priority (see middleware): a valid manual cookie choice → the browser's
// Accept-Language preference → Italian fallback. Kept as a plain, dependency-free
// module (relative import only) so it runs in the Edge middleware, is covered by
// tsc, and can be exercised directly from the Node test runner.
import { type Locale, DEFAULT_LOCALE } from "./locales";

/** Name of the cookie that stores a visitor's manual language choice. */
export const LOCALE_COOKIE = "preferred-locale";

/** Long-lived so the choice survives across visits — one year, in seconds. */
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

/** True only for the two locales the site actually serves. */
export function isLocale(value: string | null | undefined): value is Locale {
  return value === "it" || value === "en";
}

interface LanguageRange {
  tag: string;
  q: number;
}

// Parse an Accept-Language header into weighted language ranges, best first.
// - malformed tags are dropped (a fully malformed header yields no ranges)
// - a missing q defaults to 1; an explicit q=0 ("not acceptable") is dropped
// - ties on q preserve header order (Array.prototype.sort is stable)
export function parseAcceptLanguage(header: string | null | undefined): LanguageRange[] {
  if (!header) return [];
  const ranges: LanguageRange[] = [];
  for (const part of header.split(",")) {
    const [rawTag, ...params] = part.split(";");
    const tag = rawTag.trim().toLowerCase();
    if (!/^[a-z]{2,3}(-[a-z0-9]{1,8})*$/.test(tag)) continue;
    let q = 1;
    for (const param of params) {
      const match = param.trim().match(/^q=(\d(?:\.\d{1,3})?)$/);
      if (match) q = parseFloat(match[1]);
    }
    if (q > 0) ranges.push({ tag, q });
  }
  return ranges.sort((a, b) => b.q - a.q);
}

// The visitor's decisive language is the highest-weighted range. Italian (any
// region: it, it-IT, it-CH, …) → "it"; every other detected language → "en".
// Returns null when nothing could be detected (missing/empty/unparseable header).
export function detectLocaleFromHeader(header: string | null | undefined): Locale | null {
  const ranges = parseAcceptLanguage(header);
  if (ranges.length === 0) return null;
  const base = ranges[0].tag.split("-")[0];
  return base === "it" ? "it" : "en";
}

// Full priority chain used for requests to "/":
//   1. a valid manual cookie choice (invalid values are ignored)
//   2. the browser/system language from Accept-Language
//   3. Italian fallback
export function resolveLocale(
  cookieValue: string | null | undefined,
  acceptLanguage: string | null | undefined,
): Locale {
  if (isLocale(cookieValue)) return cookieValue;
  return detectLocaleFromHeader(acceptLanguage) ?? DEFAULT_LOCALE;
}
