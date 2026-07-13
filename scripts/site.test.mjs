// Asserts the site's public configuration is hard-coded (no env vars) and correct.
// Static source assertions — deliberately never reads or mutates process.env.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const read = (p) => readFileSync(path.join(root, p), "utf8");

const SITE_URL = "https://www.ilcasinocasalino.com";
const EMAIL = "ilcasinocasalino@gmail.com";
const PHONE = "+393277755170";
const ADDRESS = "Contrada Casalino, 18, 72021, Francavilla Fontana BR, Italy";
const NAME = "Il Casino Casalino";

test("canonical base URL is the literal production domain, no env, no trailing slash", () => {
  const site = read("src/lib/site.ts");
  assert.ok(site.includes(`"${SITE_URL}"`), "SITE_URL is the production literal");
  assert.ok(!site.includes("process.env"), "no env read in lib/site");
  assert.ok(!SITE_URL.endsWith("/"), "no trailing slash → no double slashes when appended");
});

test("metadata, canonical, sitemap and robots use the literal SITE_URL", () => {
  const layout = read("src/app/layout.tsx");
  assert.ok(/import \{ SITE_URL as BASE_URL \} from "@\/lib\/site"/.test(layout));
  assert.ok(/metadataBase: new URL\(BASE_URL\)/.test(layout) && /canonical: BASE_URL/.test(layout));
  assert.ok(read("src/app/sitemap.ts").includes("SITE_URL"));
  const robots = read("src/app/robots.ts");
  assert.ok(robots.includes("`${SITE_URL}/sitemap.xml`") && robots.includes("host: SITE_URL"));
});

test("JSON-LD uses literal contact details and the site URL", () => {
  const j = read("src/components/seo/JsonLd.tsx");
  assert.ok(j.includes(`telephone: "${PHONE}"`), "literal telephone");
  assert.ok(j.includes(`email: "${EMAIL}"`), "literal email");
  assert.ok(j.includes(`name: "${NAME}"`), "literal site name");
  assert.ok(j.includes("BASE_URL"), "JSON-LD url/image built from SITE_URL");
  assert.ok(!j.includes("process.env"), "no env in JSON-LD");
});

test("contact links use the exact machine-readable email and phone", () => {
  const c = read("src/components/sections/ContactSection.tsx");
  assert.ok(c.includes(`href="mailto:${EMAIL}"`), "mailto link");
  assert.ok(c.includes(`href="tel:${PHONE}"`), "tel link (international)");
  assert.ok(c.includes(ADDRESS), "business address rendered exactly");
  assert.ok(!c.includes("process.env"));
  const sidebar = read("src/components/ui/FloatingSidebar.tsx");
  assert.ok(sidebar.includes(`"mailto:${EMAIL}"`) && !sidebar.includes("process.env"));
});

test("footer renders literal name, address, phone and email (no env)", () => {
  const f = read("src/components/layout/Footer.tsx");
  for (const v of [NAME, ADDRESS, PHONE, EMAIL]) assert.ok(f.includes(v), `footer missing ${v}`);
  assert.ok(!f.includes("process.env"), "no env in footer");
});

test("locale routing: /it default, /it + /en routes, toggle navigates, 404 → /it", () => {
  const locales = read("src/lib/locales.ts");
  assert.ok(/DEFAULT_LOCALE: Locale = "it"/.test(locales), "default locale is Italian");
  assert.ok(/LOCALES: Locale\[\] = \["it", "en"\]/.test(locales), "Italian + English locales");
  const ctx = read("src/context/LanguageContext.tsx");
  assert.ok(!ctx.includes("process.env"), "no env for locale");
  assert.ok(/router\.push\(`\/\$\{next\}/.test(ctx), "toggle navigates between locale routes");
  assert.ok(/locale === "it" \? "en" : "it"/.test(ctx), "toggle swaps it ↔ en");
  // Route files exist.
  assert.ok(existsSync(path.join(root, "src/app/[locale]/page.tsx")), "[locale]/page route");
  const localeLayout = read("src/app/[locale]/layout.tsx");
  assert.ok(/generateStaticParams/.test(localeLayout) && /notFound\(\)/.test(localeLayout), "static params + invalid-locale 404");
  assert.ok(/"x-default":\s*`\$\{BASE_URL\}\/it`/.test(localeLayout), "x-default hreflang → /it");
  // Root and 404 both redirect to the default locale (/it).
  assert.ok(/redirect\(`\/\$\{DEFAULT_LOCALE\}`\)/.test(read("src/app/page.tsx")), "root / redirects to /it");
  assert.ok(/redirect\(`\/\$\{DEFAULT_LOCALE\}`\)/.test(read("src/app/not-found.tsx")), "404 redirects to /it");
});

test("none of the six public env variables are referenced anywhere in src", () => {
  const names = [
    "NEXT_PUBLIC_BUSINESS_ADDRESS",
    "NEXT_PUBLIC_BASE_URL",
    "NEXT_PUBLIC_BUSINESS_EMAIL",
    "NEXT_PUBLIC_BUSINESS_PHONE",
    "NEXT_PUBLIC_SITE_NAME",
    "NEXT_PUBLIC_DEFAULT_LOCALE",
  ];
  const walk = (d) => {
    for (const e of readdirSync(path.join(root, d), { withFileTypes: true })) {
      const rel = path.join(d, e.name);
      if (e.isDirectory()) walk(rel);
      else if (/\.(tsx?|mjs|js)$/.test(e.name)) {
        const src = read(rel);
        assert.ok(!/process\.env/.test(src), `${rel} still reads process.env`);
        for (const n of names) assert.ok(!src.includes(n), `${rel} references ${n}`);
      }
    }
  };
  walk("src");
});
