// Privacy notice: one page per locale, the same sections in both languages,
// linked from the footer and the contact form, and listed in the sitemap.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const read = (p) => readFileSync(path.join(root, p), "utf8");
const ids = (src) => [...src.matchAll(/^\s+id: "([a-z]+)",$/gm)].map((m) => m[1]);

test("the privacy page exists under each locale with its own canonical and hreflang", () => {
  assert.ok(existsSync(path.join(root, "src/app/[locale]/privacy/page.tsx")));
  const page = read("src/app/[locale]/privacy/page.tsx");
  assert.ok(page.includes("canonical: `${BASE_URL}/${l}/privacy`"), "per-locale canonical");
  assert.ok(/"x-default": `\$\{BASE_URL\}\/it\/privacy`/.test(page), "x-default → Italian");
  const sitemap = read("src/app/sitemap.ts");
  assert.ok(sitemap.includes("/it/privacy") && sitemap.includes("/en/privacy"), "both locales in the sitemap");
});

test("Italian and English notices have the same sections, in the same order", () => {
  const it = ids(read("src/translations/privacy-it.ts"));
  const en = ids(read("src/translations/privacy-en.ts"));
  assert.ok(it.length >= 10, "notice covers all the required topics");
  assert.deepEqual(en, it);
  for (const required of ["titolare", "finalita", "holidu", "destinatari", "conservazione", "cookie", "diritti"]) {
    assert.ok(it.includes(required), `section ${required} present`);
  }
});

test("the notice names the controller with the business's literal details", () => {
  for (const file of ["src/translations/privacy-it.ts", "src/translations/privacy-en.ts"]) {
    const src = read(file);
    assert.ok(src.includes("08684360723"), `${file}: VAT number`);
    assert.ok(src.includes("Contrada Casalino 18, 72021 Francavilla Fontana"), `${file}: address`);
    assert.ok(src.includes("{{email}}") && src.includes("{{garante}}"), `${file}: contact and complaint links`);
  }
});

test("footer and contact form link to the privacy page in the current locale", () => {
  assert.ok(read("src/components/layout/Footer.tsx").includes("href={`/${locale}/privacy`}"));
  assert.ok(read("src/components/ui/ContactForm.tsx").includes("href={`/${locale}/privacy`}"));
});
