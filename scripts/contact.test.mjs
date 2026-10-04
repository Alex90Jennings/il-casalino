// Contact form: validation, spam honeypot and the subject line.
// Exercises the real parser (src/lib/contact.ts) via tsx.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const read = (p) => readFileSync(path.join(root, p), "utf8");

function run(cases) {
  const tsx = path.join(root, "node_modules/.bin/tsx");
  return JSON.parse(
    execFileSync(tsx, ["scripts/dump-contact.ts", JSON.stringify(cases)], { cwd: root }).toString(),
  );
}

const valid = { name: "Anna", email: "anna@example.com", message: "Ciao!", locale: "it" };

test("a valid enquiry is accepted and the subject names the sender", () => {
  const [r] = run([valid]);
  assert.equal(r.kind, "ok");
  assert.equal(r.subject, "Website enquiry — Anna");
});

test("rejects missing or malformed fields; honeypot is spam", () => {
  const results = run([
    { ...valid, name: "  " },
    { ...valid, email: "not-an-email" },
    { ...valid, message: "" },
    { ...valid, message: "x".repeat(5001) },
    { ...valid, website: "http://spam" },
  ]);
  assert.deepEqual(results.map((r) => r.kind), ["invalid", "invalid", "invalid", "invalid", "spam"]);
});

test("there is exactly one contact form, in the home Contact section", () => {
  assert.ok(/<ContactForm\b/.test(read("src/components/sections/ContactSection.tsx")));
  const sections = ["PastEventsSection", "HistorySection", "BookingSection"];
  for (const s of sections) assert.ok(!read(`src/components/sections/${s}.tsx`).includes("ContactForm"));
});

test("/events and /{locale}/events redirect to the past-events section", () => {
  const mw = read("src/middleware.ts");
  assert.ok(/rest === "events"/.test(mw), "matches the /events shortcut");
  assert.ok(/url\.hash = "events"/.test(mw), "lands on #events");
  const page = read("src/app/[locale]/page.tsx");
  assert.ok(/<HistorySection \/>\s*<PastEventsSection \/>\s*<ContactSection\b[^>]*\/>/.test(page), "events sit between history and contact");
});
