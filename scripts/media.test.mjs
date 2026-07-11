// Dependency-free media-integration checks (Node built-in test runner).
// Run with:  npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const read = (p) => readFileSync(path.join(root, p), "utf8");

const SECTION_DIR = "src/components/sections";
const sectionFiles = readdirSync(path.join(root, SECTION_DIR)).filter((f) => f.endsWith(".tsx"));

// Components actually reachable from the homepage (page.tsx + root layout).
const RENDERED = [
  "src/app/page.tsx",
  "src/app/layout.tsx",
  "src/components/seo/JsonLd.tsx",
  "src/components/layout/Navbar.tsx",
  "src/components/layout/Footer.tsx",
  "src/components/ui/FloatingSidebar.tsx",
  `${SECTION_DIR}/HeroSection.tsx`,
  `${SECTION_DIR}/AboutSection.tsx`,
  `${SECTION_DIR}/ServicesSection.tsx`,
  `${SECTION_DIR}/GallerySection.tsx`,
  `${SECTION_DIR}/BookingSection.tsx`,
  `${SECTION_DIR}/ContactSection.tsx`,
  "src/data/media.ts",
];

test("no media-originals path is referenced anywhere in src", () => {
  const walk = (d) => {
    for (const e of readdirSync(path.join(root, d), { withFileTypes: true })) {
      const rel = path.join(d, e.name);
      if (e.isDirectory()) walk(rel);
      else if (/\.(tsx?|ts)$/.test(e.name)) {
        for (const line of read(rel).split("\n")) {
          const code = line.replace(/\/\/.*$/, ""); // drop line comments
          assert.ok(!code.includes("media-originals"), `${rel} references a media-originals path`);
        }
      }
    }
  };
  walk("src");
});

test("rendered homepage components reference only optimised /media/ assets", () => {
  for (const rel of RENDERED) {
    const src = read(rel);
    // A path literal beginning with /images/ (the deleted folder) — note
    // /media/images/ is the valid optimised location and must not trip this.
    assert.ok(!/["'`]\/images\//.test(src), `${rel} references a deleted /images/ path`);
    // Every photo/video asset must come from the optimised /media/ pipeline
    // (logo.png / favicons are not part of it and are intentionally excluded).
    for (const m of src.matchAll(/["'`](\/[^"'`]+\.(?:webp|jpe?g|avif|mp4))/g)) {
      assert.ok(m[1].startsWith("/media/"), `${rel} uses a non-/media asset: ${m[1]}`);
    }
  }
});

test("media metadata only points at optimised /media/ assets that exist on disk", () => {
  const media = read("src/data/media.ts");
  const paths = [...media.matchAll(/["'`](\/media\/[^"'`]+)["'`]/g)].map((m) => m[1]);
  const concrete = paths.filter((p) => !p.includes("${")); // skip template-literal video paths
  assert.ok(concrete.length >= 7, "expected hero + shared gallery image paths");
  for (const s of concrete) {
    assert.ok(existsSync(path.join(root, "public", s)), `optimised file missing: ${s}`);
  }
  // Room videos + WebP posters are built from room ids by the roomVideo() helper.
  for (const id of ["sole", "stella", "luna", "venere"]) {
    assert.ok(existsSync(path.join(root, `public/media/videos/${id}.mp4`)), `missing ${id}.mp4`);
    assert.ok(existsSync(path.join(root, `public/media/videos/${id}-poster.webp`)), `missing ${id} poster`);
  }
});

test("hero uses the optimised pool asset (not pool-garden) and is the only priority image", () => {
  const hero = read(`${SECTION_DIR}/HeroSection.tsx`);
  const media = read("src/data/media.ts");
  assert.ok(hero.includes("HERO_IMAGE"), "hero should use HERO_IMAGE metadata");
  assert.ok(media.includes("/media/images/pool-1920.webp"), "hero should use optimised pool");
  assert.ok(!media.includes("pool-garden"), "pool-garden must no longer be referenced");

  for (const f of sectionFiles) {
    const src = read(`${SECTION_DIR}/${f}`);
    if (f === "HeroSection.tsx") {
      assert.ok(/priority/.test(src), "hero must set priority");
      assert.ok(/fetchPriority="high"/.test(src), "hero should set fetchPriority high");
    } else {
      assert.ok(!/\bpriority\b/.test(src), `${f} must not use priority (only the hero should)`);
    }
  }
});

test("Open Graph and JSON-LD reference the optimised pool image", () => {
  for (const rel of ["src/app/layout.tsx", "src/components/seo/JsonLd.tsx"]) {
    const src = read(rel);
    assert.ok(src.includes("/media/images/pool-1600.webp"), `${rel} should use optimised pool`);
    assert.ok(!src.includes("pool-garden"), `${rel} must not reference pool-garden`);
  }
});

test("gallery renders the full continuous sequence with localised captions/alt, lazily", () => {
  const g = read(`${SECTION_DIR}/GallerySection.tsx`);
  assert.ok(g.includes("GALLERY"), "gallery should consume the single ordered GALLERY");
  assert.ok(/const slides = GALLERY/.test(g), "slides must be the full gallery (no filtering)");
  assert.ok(!/selectedRoom/.test(g), "gallery must not filter by a selected room");
  assert.ok(g.includes("slide.alt[locale]"), "alt must follow locale");
  assert.ok(g.includes("slide.caption[locale]"), "caption must follow locale");
  assert.ok(!/priority/.test(g), "gallery media must not be priority (below the fold)");
});

test("room selector navigates (not filters) and syncs to the active slide", () => {
  const g = read(`${SECTION_DIR}/GallerySection.tsx`);
  assert.ok(g.includes("ROOM_ORDER"), "selector should iterate ROOM_ORDER");
  assert.ok(/role="group"/.test(g), "selector should be a labelled group");
  assert.ok(g.includes("aria-pressed={selected}"), "room buttons must expose pressed state");
  assert.ok(g.includes("room.name[locale]"), "room names must follow locale");
  // Navigation, not filter: click jumps to the room's first slide.
  assert.ok(/firstGalleryIndex\(ROOMS\[key\]\.group\)/.test(g), "click must jump via firstGalleryIndex");
  // Selected state is derived from the active slide's group (auto-sync).
  assert.ok(/activeGroup = slides\[current\]/.test(g), "active group derived from current slide");
  assert.ok(/const selected = activeGroup === room\.group/.test(g), "selection derived, not stored");
  // Sun / Star / Moon / Venus mapping present in the data.
  const media = read("src/data/media.ts");
  for (const [it, en] of [["Sole", "Sun"], ["Stella", "Star"], ["Luna", "Moon"], ["Venere", "Venus"]]) {
    assert.ok(media.includes(`{ en: "${en}", it: "${it}" }`), `missing room name ${en}/${it}`);
  }
});

test("gallery data: one continuous sequence, rooms reachable by first index", () => {
  const tsx = path.join(root, "node_modules/.bin/tsx");
  const out = execFileSync(tsx, ["scripts/dump-gallery.ts"], { cwd: root }).toString();
  const { gallery, firsts, roomOrder } = JSON.parse(out);

  // Shared + all four rooms present in a single sequence, each room with a video.
  const groups = new Set(gallery.map((i) => i.group));
  for (const grp of ["shared", "sole", "stella", "luna", "venere"]) {
    assert.ok(groups.has(grp), `gallery missing group ${grp}`);
  }
  for (const grp of ["sole", "stella", "luna", "venere"]) {
    assert.ok(gallery.some((i) => i.group === grp && i.kind === "video"), `${grp} missing its video`);
    // Room photos were removed — rooms are represented by their video only.
    assert.ok(!gallery.some((i) => i.group === grp && i.kind === "image"), `${grp} should have no photo`);
  }
  // Breakfast video leads; shared areas come before any room.
  assert.equal(gallery[0].id, "breakfast-video");
  assert.equal(gallery[0].kind, "video");
  const firstRoom = gallery.findIndex((i) => i.group !== "shared");
  assert.ok(gallery.slice(0, firstRoom).every((i) => i.group === "shared"), "shared block precedes rooms");

  // Selecting a room jumps to the FIRST item of that group, and the full
  // sequence is unchanged (navigation, not filtering).
  for (const grp of roomOrder) {
    const idx = firsts[grp];
    assert.ok(idx >= 0, `${grp} has no first index`);
    assert.equal(gallery[idx].group, grp, `${grp} first index points at the group`);
    assert.ok(idx === gallery.findIndex((i) => i.group === grp), `${grp} index is the first occurrence`);
  }
  // 1 breakfast video + 7 shared images + 4 room videos = 12 items, always.
  assert.equal(gallery.length, 12, "gallery item count is fixed regardless of navigation");
});

test("room videos autoplay muted on the active slide, never eagerly, no sound option", () => {
  const raw = read("src/components/ui/LazyVideo.tsx");
  const v = raw.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, ""); // strip comments
  assert.ok(/\bmuted\b/.test(v), "video must be muted");
  assert.ok(/\bautoPlay\b/.test(v), "active video autoplays");
  assert.ok(/\bloop\b/.test(v), "video loops");
  assert.ok(!/\bcontrols\b/.test(v), "no controls → sound can never be enabled");
  assert.ok(/prefers-reduced-motion/.test(v), "reduced motion must be respected");
  // The <video> only mounts while the slide is active → not fetched on initial load.
  assert.ok(/const play = active &&/.test(v), "video gated behind the active slide");
  assert.ok(v.includes("aria-label={playLabel}"), "reduced-motion play button keeps a localised label");
});

test("language toggle drives media metadata (both locales present)", () => {
  const media = read("src/data/media.ts");
  assert.ok(/en:\s*"/.test(media) && /it:\s*"/.test(media), "metadata must define en and it");
});

test("navigation section IDs resolve to real sections", () => {
  const navbar = read("src/components/layout/Navbar.tsx");
  const ids = [...navbar.matchAll(/sectionId:\s*"([^"]+)"/g)].map((m) => m[1]);
  assert.ok(ids.includes("gallery") && ids.includes("booking"));
  const rendered = sectionFiles.map((f) => read(`${SECTION_DIR}/${f}`)).join("\n");
  for (const id of ids) {
    if (id === "hero") continue; // hero id lives in HeroSection
    assert.ok(rendered.includes(`id="${id}"`), `no section renders id="${id}"`);
  }
  assert.ok(read(`${SECTION_DIR}/HeroSection.tsx`).includes('id="hero"'));
});

test("Holidu booking integration is preserved", () => {
  assert.ok(read("src/lib/holidu.ts").includes("widget.holiduhost.com/widget/dff485ac-a76f-49ef-9ea2-5e78e06bfbc5"));
  assert.ok(read(`${SECTION_DIR}/BookingSection.tsx`).includes("HoliduWidget"));
});

test("Holidu widget follows the site locale (single iframe, verified `language` param)", () => {
  const w = read("src/components/booking/HoliduWidget.tsx");
  // Exactly one iframe, reloaded on locale change.
  assert.equal((w.match(/<iframe/g) ?? []).length, 1, "must render exactly one iframe");
  assert.ok(/key=\{locale\}/.test(w), "iframe must remount on locale change");
  assert.ok(w.includes("buildHoliduWidgetUrl(locale)"), "src derived from locale via builder");
  assert.ok(w.includes("buildHoliduWidgetUrl(locale, { standalone: true })"), "fallback uses builder");
  assert.ok(w.includes("loading=\"lazy\""), "widget stays lazy (below the fold)");
  // Builder output verified at runtime.
  const tsx = path.join(root, "node_modules/.bin/tsx");
  const u = JSON.parse(execFileSync(tsx, ["scripts/dump-holidu.ts"], { cwd: root }).toString());
  const base = "https://widget.holiduhost.com/widget/dff485ac-a76f-49ef-9ea2-5e78e06bfbc5";
  assert.equal(u.en, `${base}?language=en`, "English URL");
  assert.equal(u.it, `${base}?language=it`, "Italian URL");
  assert.notEqual(u.en, u.it, "switching locale changes the src");
  assert.ok(u.enStandalone.includes("standalone=1") && u.enStandalone.includes("language=en"));
  assert.ok(u.itStandalone.includes("standalone=1") && u.itStandalone.includes("language=it"));
  // Unsupported/injected locale can never reach the URL — falls back to en, encoded.
  assert.ok(u.injected.endsWith("language=en"), "unsupported locale falls back to en");
  assert.ok(!u.injected.includes("<script>"), "no raw input reaches the URL");
});
