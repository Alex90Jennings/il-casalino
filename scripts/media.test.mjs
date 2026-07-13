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

const RENDERED = [
  "src/app/layout.tsx",
  "src/app/[locale]/layout.tsx",
  "src/app/[locale]/page.tsx",
  "src/components/seo/JsonLd.tsx",
  "src/components/layout/Navbar.tsx",
  "src/components/layout/MobileMenu.tsx",
  "src/components/layout/Footer.tsx",
  "src/components/ui/FloatingSidebar.tsx",
  ...sectionFiles.map((f) => `${SECTION_DIR}/${f}`),
  "src/data/media.ts",
];

function dumpMedia() {
  const tsx = path.join(root, "node_modules/.bin/tsx");
  return JSON.parse(execFileSync(tsx, ["scripts/dump-media.ts"], { cwd: root }).toString());
}
const onDisk = (webPath) => existsSync(path.join(root, "public", webPath));

test("no media-originals path is referenced anywhere in src", () => {
  const walk = (d) => {
    for (const e of readdirSync(path.join(root, d), { withFileTypes: true })) {
      const rel = path.join(d, e.name);
      if (e.isDirectory()) walk(rel);
      else if (/\.(tsx?|ts)$/.test(e.name)) {
        for (const line of read(rel).split("\n")) {
          const code = line.replace(/\/\/.*$/, "");
          assert.ok(!code.includes("media-originals"), `${rel} references a media-originals path`);
        }
      }
    }
  };
  walk("src");
});

test("rendered components reference only optimised /media/ assets that exist", () => {
  for (const rel of RENDERED) {
    const src = read(rel);
    for (const m of src.matchAll(/["'`](\/[^"'`$]+\.(?:webp|jpe?g|avif|mp4))/g)) {
      assert.ok(m[1].startsWith("/media/"), `${rel} uses a non-/media asset: ${m[1]}`);
      assert.ok(onDisk(m[1]), `${rel} references a missing file: ${m[1]}`);
    }
  }
});

test("hero is the optimised gate-entrance asset (not pool) and the only priority image", () => {
  const hero = read(`${SECTION_DIR}/HeroSection.tsx`);
  const media = read("src/data/media.ts");
  assert.ok(hero.includes("HERO_IMAGE"), "hero uses HERO_IMAGE metadata");
  assert.ok(media.includes("/media/images/gate-entrance-2560.webp"), "hero uses gate-entrance master");
  assert.match(media.match(/HERO_IMAGE[^}]*id:\s*"([^"]+)"/s)[1], /gate-entrance/);
  for (const f of sectionFiles) {
    const src = read(`${SECTION_DIR}/${f}`);
    if (f === "HeroSection.tsx") {
      assert.ok(/priority/.test(src) && /fetchPriority="high"/.test(src), "hero sets priority");
    } else {
      assert.ok(!/\bpriority\b/.test(src), `${f} must not mark an image priority`);
    }
  }
});

test("Open Graph and JSON-LD reference the optimised gate-entrance image", () => {
  const og = "/media/images/gate-entrance-1600.webp";
  assert.ok(onDisk(og), "gate-entrance-1600.webp exists on disk");
  for (const rel of ["src/app/layout.tsx", "src/components/seo/JsonLd.tsx"]) {
    const src = read(rel);
    assert.ok(src.includes(og), `${rel} should use the gate-entrance OG image`);
    assert.ok(!src.includes("og-image"), `${rel} must not reference og-image.jpg`);
    assert.ok(!src.includes("pool-1600"), `${rel} must not reference a non-generated pool-1600`);
  }
});

test("shared gallery reel: videos first then images, all files on disk", () => {
  const { shared, hero } = dumpMedia();
  assert.ok(onDisk(hero.src), `hero missing: ${hero.src}`);
  assert.ok(shared.length >= 20, "expected shared videos + images");
  // Videos lead the reel; the first item is a video.
  const firstImageIdx = shared.findIndex((s) => s.kind === "image");
  assert.equal(shared[0].kind, "video", "a video leads the reel");
  assert.ok(shared.slice(0, firstImageIdx).every((s) => s.kind === "video"), "all videos precede the images");
  assert.equal(shared[firstImageIdx].kind, "image", "images follow the videos");
  const imageIds = shared.filter((s) => s.kind === "image").map((s) => s.id);
  assert.ok(imageIds.includes("pool") && imageIds.includes("pool-garden"), "both pool photos in the reel");
  assert.ok(!shared.some((s) => s.id === "gate-entrance"), "hero image not repeated in the reel");
  for (const s of shared) {
    assert.ok(onDisk(s.src), `shared media missing: ${s.src}`);
    if (s.kind === "video") assert.ok(onDisk(s.poster), `poster missing: ${s.poster}`);
  }
  // GallerySection renders the shared peek carousel with muted-autoplay video slides.
  const g = read(`${SECTION_DIR}/GallerySection.tsx`);
  assert.ok(g.includes("SHARED_GALLERY") && g.includes("MediaCarousel"), "reel uses shared gallery + carousel");
  assert.ok(!/priority/.test(g), "reel media is not priority");
  const lv = read("src/components/ui/LazyVideo.tsx");
  assert.ok(/\bmuted\b/.test(lv) && /\bautoPlay\b/.test(lv) && /\bloop\b/.test(lv), "autoplay muted looped");
  assert.ok(!/\bcontrols\b/.test(lv.replace(/\/\/.*$/gm, "")), "shared clips have no audio controls");
});

test("rooms gallery: order Sole·Stella·Venere·Luna, exactly 3 grouped videos each, files exist", () => {
  const { roomOrder, rooms } = dumpMedia();
  assert.deepEqual(roomOrder, ["Sole", "Stella", "Venere", "Luna"], "required room order");
  const stems = { Sole: "sole", Stella: "stella", Venere: "venere", Luna: "luna" };
  for (const key of roomOrder) {
    const vids = rooms[key].videos;
    assert.equal(vids.length, 3, `${key} must have exactly 3 videos`);
    for (const v of vids) {
      assert.ok(v.id.startsWith(stems[key]), `${key} video ${v.id} not grouped to the room`);
      assert.ok(onDisk(v.src), `missing video: ${v.src}`);
      assert.ok(onDisk(v.poster), `missing poster: ${v.poster}`);
    }
  }
});

test("rooms reel is the same carousel, holding all 12 room videos grouped in order", () => {
  const { roomGallery } = dumpMedia();
  assert.equal(roomGallery.length, 12, "twelve room videos in the reel");
  assert.ok(roomGallery.every((v) => v.kind === "video"), "rooms reel is videos only");
  // Grouped by room, in selector order (never interleaved).
  const stems = ["sole", "stella", "venere", "luna"];
  roomGallery.forEach((v, i) => {
    const group = Math.floor(i / 3);
    assert.ok(v.id.startsWith(stems[group]), `${v.id} at index ${i} not in group ${stems[group]}`);
    assert.ok(onDisk(v.src) && onDisk(v.poster), `missing room video/poster: ${v.id}`);
  });
  // RoomsSection reuses the shared MediaCarousel with ROOM_GALLERY (muted autoplay).
  // The room icons are a read-only indicator of the room in focus (synced to the
  // active clip); navigation is via the carousel arrows only — no click-to-navigate.
  const r = read(`${SECTION_DIR}/RoomsSection.tsx`);
  assert.ok(/MediaCarousel/.test(r) && /ROOM_GALLERY/.test(r), "rooms uses the shared carousel");
  assert.ok(/ROOM_ORDER\.map/.test(r), "room indicator iterates the rooms");
  assert.ok(/const activeRoom = ROOM_ORDER\[Math\.floor\(activeIndex/.test(r), "active room derived from the active clip");
  assert.ok(/aria-current=\{active/.test(r), "active room marked with aria-current");
  assert.ok(!/goTo\(/.test(r) && !/onClick/.test(r), "indicator is read-only — no click navigation");
  const mc = read("src/components/ui/MediaCarousel.tsx");
  assert.ok(mc.includes("LazyVideo"), "carousel plays videos via LazyVideo (muted autoplay)");
});

test("localisation: both locales in sync; host bio, extras and branding present; pool sentence removed", () => {
  const itSrc = read("src/translations/it.ts");
  const enSrc = read("src/translations/en.ts");
  // Removed pool wording gone from both locales.
  for (const [name, src] of [["it", itSrc], ["en", enSrc]]) {
    assert.ok(!src.includes("per rinfrescarsi nelle giornate di sole"), `${name}: IT pool sentence remains`);
    assert.ok(!src.includes("a refreshing dip on sunny days"), `${name}: EN pool sentence remains`);
  }
  // Host section (three paragraphs) + optional extras + rooms nav in both.
  for (const [name, src] of [["it", itSrc], ["en", enSrc]]) {
    assert.ok(/host:\s*\{/.test(src) && /body:\s*\[/.test(src), `${name}: host bio missing`);
    assert.ok(src.includes("extrasHeading") && src.includes("italianLessons") && src.includes("carRental"), `${name}: extras missing`);
    assert.ok(/rooms:\s*"/.test(src), `${name}: rooms nav label missing`);
  }
  assert.ok(itSrc.includes("Sono un'insegnante di italiano"), "exact IT host text present");
  assert.ok(!enSrc.includes("Sono un'insegnante"), "IT text must not leak into the English locale");
  // Branding: title with B&B, no separate tagline key.
  const hero = read(`${SECTION_DIR}/HeroSection.tsx`);
  assert.ok(/Il Casino Casalino B&amp;B/.test(hero), "hero title reads IL CASINO CASALINO B&B");
  assert.ok(!/hero\.tagline|Bed & Breakfast|BED & BREAKFAST/.test(hero), "old Bed & Breakfast tagline removed");
});

test("navigation exposes the rooms section", () => {
  const navbar = read("src/components/layout/Navbar.tsx");
  const ids = [...navbar.matchAll(/sectionId:\s*"([^"]+)"/g)].map((m) => m[1]);
  assert.ok(ids.includes("gallery") && ids.includes("rooms") && ids.includes("about"));
  const rendered = sectionFiles.map((f) => read(`${SECTION_DIR}/${f}`)).join("\n");
  for (const id of ids) {
    if (id === "hero") continue;
    assert.ok(rendered.includes(`id="${id}"`), `no section renders id="${id}"`);
  }
});

test("Holidu booking integration is preserved", () => {
  assert.ok(read("src/lib/holidu.ts").includes("widget.holiduhost.com/widget/dff485ac-a76f-49ef-9ea2-5e78e06bfbc5"));
  assert.ok(read(`${SECTION_DIR}/BookingSection.tsx`).includes("HoliduWidget"));
});
