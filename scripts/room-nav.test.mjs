// Room-icon navigation: verifies the pure target/active-slug logic at runtime
// and the selector component's accessibility + motion contract via source
// patterns (same dependency-free style as media.test.mjs). Run with: npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const read = (p) => readFileSync(path.join(root, p), "utf8");

function dumpRoomNav() {
  const tsx = path.join(root, "node_modules/.bin/tsx");
  return JSON.parse(execFileSync(tsx, ["scripts/dump-room-nav.ts"], { cwd: root }).toString());
}

test("each room icon targets its first video in the reel (Sole·Stella·Venere·Luna)", () => {
  const { targets, total } = dumpRoomNav();
  // Three grouped videos per room → first-video indices 0, 3, 6, 9.
  assert.equal(total, 12, "twelve room clips in the reel");
  assert.deepEqual(
    targets,
    [
      { slug: "sun", index: 0 },
      { slug: "star", index: 3 },
      { slug: "venus", index: 6 },
      { slug: "moon", index: 9 },
    ],
    "each icon jumps to the room's first clip",
  );
});

test("scrolling the reel selects the room that owns the active clip", () => {
  const { activeByIndex } = dumpRoomNav();
  const expected = ["sun", "sun", "sun", "star", "star", "star", "venus", "venus", "venus", "moon", "moon", "moon"];
  expected.forEach((slug, i) => assert.equal(activeByIndex[i], slug, `index ${i} → ${slug}`));
});

test("indices outside the rooms reel select no room (shared media never wins)", () => {
  const { activeByIndex, total } = dumpRoomNav();
  assert.equal(activeByIndex[-1], null, "before the reel → no room");
  assert.equal(activeByIndex[total], null, "one past the last clip → no room");
  assert.equal(activeByIndex[999], null, "far out of range → no room");
});

test("Italian and English labels map to the same internal slug", () => {
  const { labelMap, unknownLabel } = dumpRoomNav();
  const bySlug = { Sole: "sun", Stella: "star", Venere: "venus", Luna: "moon" };
  for (const row of labelMap) {
    assert.equal(row.slug, bySlug[row.key], `${row.key} slug`);
    assert.equal(row.fromEn, row.slug, `${row.key}: English label resolves to its slug`);
    assert.equal(row.fromIt, row.slug, `${row.key}: Italian label resolves to its slug`);
  }
  // Slugs are language-independent internal keys, never a translated label.
  assert.deepEqual(labelMap.map((r) => r.slug), ["sun", "star", "venus", "moon"]);
  assert.equal(unknownLabel, null, "a non-room label resolves to nothing");
});

test("target is the first VIDEO even when images precede it; falls back to first media when a room has no video", () => {
  const { synthTargets } = dumpRoomNav();
  // Sole: [image, image, video, video] → first video at offset 2.
  // Stella: [image, image] (no video) → fallback to first media at its base (4).
  assert.deepEqual(synthTargets, [
    { slug: "sun", index: 2 },
    { slug: "star", index: 4 },
  ]);
});

test("room icons are real buttons: keyboard-operable, labelled per locale, no URL change", () => {
  const sel = read("src/components/ui/RoomSelector.tsx");
  assert.ok(/<button/.test(sel), "icons render as <button> (Enter/Space work natively)");
  assert.ok(/type="button"/.test(sel), "buttons are type=button — no form submit / navigation");
  assert.ok(/onClick=\{\(\) => goTo\(/.test(sel), "clicking an icon navigates the reel via goTo");
  assert.ok(/aria-label=\{t\.rooms\.viewRoom/.test(sel), "aria-label uses the localised viewRoom string");
  assert.ok(/aria-current=\{active/.test(sel), "active icon marked with aria-current");
  assert.ok(!/href=|router\.|history\.|location\./.test(sel), "selector never changes the URL or history");
  // Localised aria-label template present in both locales.
  assert.ok(/viewRoom:\s*"[^"]*\{\{room\}\}/.test(read("src/translations/it.ts")), "IT viewRoom template");
  assert.ok(/viewRoom:\s*"[^"]*\{\{room\}\}/.test(read("src/translations/en.ts")), "EN viewRoom template");
});

test("active icon is kept in view without scrolling the page; reduced motion disables smooth animation", () => {
  const sel = read("src/components/ui/RoomSelector.tsx");
  assert.ok(/scrollRef\.current/.test(sel) && /container\.scrollTo\(\{/.test(sel), "active icon centred by scrolling the selector container only");
  assert.ok(/scrollWidth <= container\.clientWidth/.test(sel), "no scroll (and no shift) when the selector already fits");
  assert.ok(/behavior:\s*reducedMotion\s*\?\s*"auto"\s*:\s*"smooth"/.test(sel), "reduced motion disables smooth selector scroll");
  assert.ok(/usePrefersReducedMotion/.test(sel), "selector observes prefers-reduced-motion");
  // Reduced motion also turns the carousel jump into an instant cut.
  const mc = read("src/components/ui/MediaCarousel.tsx");
  assert.ok(/if \(reducedMotion\) jumpTo\(target\)/.test(mc), "goTo cuts instantly under reduced motion");
});

test("rooms reel still uses the shared carousel with all 12 grouped room videos", () => {
  const r = read("src/components/sections/RoomsSection.tsx");
  assert.ok(/MediaCarousel/.test(r) && /ROOM_GALLERY/.test(r), "rooms uses the shared carousel");
  assert.ok(/RoomSelector/.test(r), "rooms renders the interactive selector above the reel");
});
