// Locale-routing behaviour for the root route "/".
// Exercises the real resolver (src/lib/locale-detection.ts) via tsx, plus static
// assertions on the middleware, language context and cookie so the whole chain
// (Accept-Language → cookie priority → path-preserving switch) stays wired up.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const read = (p) => readFileSync(path.join(root, p), "utf8");

// Resolve a batch of { cookie?, header? } cases through the actual function.
function resolve(cases) {
  const tsx = path.join(root, "node_modules/.bin/tsx");
  const out = execFileSync(tsx, ["scripts/resolve-locale.ts", JSON.stringify(cases)], {
    cwd: root,
  }).toString();
  return JSON.parse(out);
}

test("root detection: Accept-Language decides /it vs /en (weighted, region-aware)", () => {
  const cases = [
    { header: "it" },                              // 0  bare Italian
    { header: "it-IT,it;q=0.9,en;q=0.8" },         // 1  Italian regional + weights
    { header: "it-CH,it;q=0.9" },                  // 2  Swiss-Italian
    { header: "en-GB,en;q=0.9" },                  // 3  English
    { header: "fr-FR,fr;q=0.9,en;q=0.8" },         // 4  French
    { header: "de-DE,de;q=0.9" },                  // 5  German
    { header: "es-ES,es;q=0.9,pt;q=0.5" },         // 6  another non-Italian language
    { header: "en-GB;q=0.9,it-IT;q=1" },           // 7  weighted → Italian wins
    { header: "it-IT;q=0.7,en-GB;q=0.9" },         // 8  weighted → English wins
  ];
  const expected = ["it", "it", "it", "en", "en", "en", "en", "it", "en"];
  assert.deepEqual(resolve(cases), expected);
});

test("root detection: missing / empty / malformed header falls back to /it", () => {
  const cases = [
    {},                              // 0  no header at all
    { header: null },                // 1  explicitly absent
    { header: "" },                  // 2  empty
    { header: "   " },               // 3  whitespace only
    { header: "@@@@" },              // 4  garbage, no valid tag
    { header: "12345;q=1" },         // 5  numeric, not a language
    { header: ";q=0.5,;q=0.2" },     // 6  weights with no tags
    { header: "en;q=0,it;q=0" },     // 7  everything explicitly unacceptable
  ];
  assert.deepEqual(resolve(cases), ["it", "it", "it", "it", "it", "it", "it", "it"]);
});

test("root detection: a valid cookie overrides browser detection", () => {
  const cases = [
    { cookie: "it", header: "en-GB,en;q=0.9" },   // 0  saved IT beats English browser
    { cookie: "en", header: "it-IT,it;q=0.9" },   // 1  saved EN beats Italian browser
    { cookie: "it", header: null },               // 2  saved IT, no header
    { cookie: "en", header: null },               // 3  saved EN, no header
  ];
  assert.deepEqual(resolve(cases), ["it", "en", "it", "en"]);
});

test("root detection: invalid cookie values are ignored, then browser/fallback apply", () => {
  const cases = [
    { cookie: "fr", header: "it-IT,it;q=0.9" },   // 0  junk cookie → use Italian header
    { cookie: "de", header: "en-GB" },            // 1  junk cookie → use English header
    { cookie: "IT", header: "en-GB" },            // 2  case-sensitive: "IT" invalid → English header
    { cookie: "", header: "de-DE" },              // 3  empty cookie → German header → /en
    { cookie: "xx", header: null },               // 4  junk cookie, no header → Italian fallback
    { cookie: "en ", header: "it-IT" },           // 5  padded value invalid → Italian header
  ];
  assert.deepEqual(resolve(cases), ["it", "en", "en", "en", "it", "it"]);
});

test("middleware: explicit locale routes pass through; others redirect via resolveLocale, no loop", () => {
  const mw = read("src/middleware.ts");
  // Explicit /it or /en (and anything beneath) are served as-is — the early
  // return on a locale first-segment is what prevents a redirect loop.
  assert.ok(
    /firstSegment[\s\S]*LOCALES[\s\S]*includes\(firstSegment\)[\s\S]*NextResponse\.next\(\)/.test(mw),
    "locale routes return NextResponse.next() (no override, no loop)",
  );
  // Redirect target comes from the cookie + Accept-Language resolver.
  assert.ok(/resolveLocale\(/.test(mw), "uses the shared resolver");
  assert.ok(/cookies\.get\(LOCALE_COOKIE\)/.test(mw), "reads the preferred-locale cookie");
  assert.ok(/headers\.get\("accept-language"\)/.test(mw), "reads the Accept-Language header");
  assert.ok(/NextResponse\.redirect\(url\)/.test(mw), "redirects to the resolved locale");
  // clone() carries the query string across the redirect.
  assert.ok(/nextUrl\.clone\(\)/.test(mw), "preserves the query string via clone()");
});

test("cookie: preferred-locale is a long-lived, lax, path=/ cookie, secure over https only", () => {
  const det = read("src/lib/locale-detection.ts");
  assert.ok(/LOCALE_COOKIE = "preferred-locale"/.test(det), "cookie name is preferred-locale");
  assert.ok(/LOCALE_COOKIE_MAX_AGE = 60 \* 60 \* 24 \* 365/.test(det), "one-year lifetime");
  const ctx = read("src/context/LanguageContext.tsx");
  assert.ok(/document\.cookie =/.test(ctx), "manual switch writes the cookie");
  assert.ok(/path=\//.test(ctx), "cookie path=/");
  assert.ok(/samesite=lax/.test(ctx), "cookie sameSite=lax");
  assert.ok(/max-age=\$\{LOCALE_COOKIE_MAX_AGE\}/.test(ctx), "cookie uses the shared max-age");
  assert.ok(/protocol === "https:"[\s\S]*secure/.test(ctx), "secure only over https (works on local http)");
});

test("manual switch preserves the current path and query, swapping only the locale segment", () => {
  const ctx = read("src/context/LanguageContext.tsx");
  assert.ok(/const next: Locale = locale === "it" \? "en" : "it"/.test(ctx), "toggles it ↔ en");
  assert.ok(
    /pathname\.replace\(\/\^\\\/\(it\|en\)\(\?=\\\/\|\$\)\/, ""\)/.test(ctx),
    "strips the leading locale segment, keeping the rest of the path",
  );
  assert.ok(
    /router\.push\(`\/\$\{next\}\$\{rest\}\$\{window\.location\.search\}`/.test(ctx),
    "navigates to the same path under the new locale, keeping the query string",
  );
});
