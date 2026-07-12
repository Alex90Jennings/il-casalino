/**
 * Image optimisation pipeline for Il Casino Casalino.
 *
 *   media-originals/{shared-area,images}/<src>  ->  public/media/images/<id>-<width>.webp
 *
 * Deterministic, safe to run repeatedly, never enlarges, strips metadata and
 * corrects EXIF orientation. Only the curated files listed in IMAGE_CONFIG are
 * processed; anything else in the source folders is left untouched.
 *
 * Run with:  npm run media:optimise
 */

import { readFile, writeFile, mkdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import sharp, { type Metadata } from "sharp";

// Source folders (gitignored, never served). `shared-area` holds the new
// professional photos; `images` holds the earlier originals still in use.
const SOURCE_DIRS = {
  shared: path.resolve("media-originals/shared-area"),
  legacy: path.resolve("media-originals/images"),
} as const;
type SourceKey = keyof typeof SOURCE_DIRS;

const OUT_DIR = path.resolve("public/media/images");
const MANIFEST = path.resolve("media-manifest.json");

const WEBP_QUALITY = 78;

// Role-based widths — only sizes that are actually useful for each role.
// next/image derives the responsive srcset from the master, so pre-generating
// smaller widths would just create unused files.
const ROLE_WIDTHS = {
  // 1280 (gallery reuse), 1600 (OG image), 2560 (hero master for next/image).
  hero: [1280, 1600, 2560],
  gallery: [1280],
} as const;

type Role = keyof typeof ROLE_WIDTHS;

// Curated set only, in a deliberate order. `id` is the output basename so
// components never depend on the (sometimes messy) source filenames.
const IMAGE_CONFIG: { file: string; from: SourceKey; id: string; role: Role }[] = [
  // Hero — the arched stone entrance gate.
  { file: "gate-entrance.jpg", from: "legacy", id: "gate-entrance", role: "hero" },
  // Shared-area gallery reel (deliberate order: exteriors → interiors → dining → garden → setting).
  { file: "pool.jpg", from: "legacy", id: "pool", role: "gallery" },
  { file: "pool-garden.jpg", from: "legacy", id: "pool-garden", role: "gallery" },
  { file: "courtyard.jpg", from: "legacy", id: "courtyard", role: "gallery" },
  { file: "angle.jpg", from: "shared", id: "angle", role: "gallery" },
  { file: "bell.jpg", from: "shared", id: "bell", role: "gallery" },
  { file: "chimney.jpg", from: "shared", id: "chimney", role: "gallery" },
  { file: "living-room-1.jpg", from: "shared", id: "living-room", role: "gallery" },
  { file: "fireplace.jpg", from: "legacy", id: "fireplace", role: "gallery" },
  { file: "billiard.jpg", from: "legacy", id: "billiard", role: "gallery" },
  { file: "kitchen.jpg", from: "shared", id: "kitchen", role: "gallery" },
  { file: "coffe-1.jpg", from: "shared", id: "coffee", role: "gallery" },
  { file: "dinner-table.jpg", from: "legacy", id: "dinner-table", role: "gallery" },
  { file: "outdoor-eating.jpg", from: "legacy", id: "outdoor-eating", role: "gallery" },
  { file: "orto.jpg", from: "shared", id: "orto", role: "gallery" },
  { file: "orto-1.jpg", from: "shared", id: "orto-1", role: "gallery" },
  { file: "trees.jpg", from: "shared", id: "trees", role: "gallery" },
  { file: "flower-2.jpg", from: "shared", id: "flower", role: "gallery" },
  { file: "cactus.jpg", from: "shared", id: "cactus", role: "gallery" },
  { file: "francavilla_fontana-casale_casalino@@010022.jpg", from: "shared", id: "francavilla", role: "gallery" },
];

function fmtBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
}

interface OutputRecord {
  file: string;
  width: number;
  height: number;
  bytes: number;
}
interface ManifestEntry {
  source: string;
  id: string;
  role: Role;
  sourceBytes: number;
  sourceWidth: number;
  sourceHeight: number;
  outputs: OutputRecord[];
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  const manifest: ManifestEntry[] = [];
  let totalSrc = 0;
  let totalOut = 0;

  for (const { file, from, id, role } of IMAGE_CONFIG) {
    const srcPath = path.join(SOURCE_DIRS[from], file);
    if (!existsSync(srcPath)) {
      console.error(`✗ Missing source, skipping: ${from}/${file}`);
      continue;
    }

    const srcBuf = await readFile(srcPath);
    const srcBytes = srcBuf.length;
    let meta: Metadata;
    try {
      meta = await sharp(srcBuf, { failOn: "error" }).metadata();
    } catch {
      console.error(`✗ Unreadable image, skipping: ${from}/${file}`);
      continue;
    }
    // EXIF orientation can swap reported width/height; normalise to displayed.
    const oriented = meta.orientation && meta.orientation >= 5;
    const srcW = (oriented ? meta.height : meta.width) ?? 0;
    const srcH = (oriented ? meta.width : meta.height) ?? 0;

    const outputs: OutputRecord[] = [];

    console.log(`\n${id}  (${file}, ${srcW}×${srcH}, ${fmtBytes(srcBytes)}, role=${role})`);
    for (const width of ROLE_WIDTHS[role]) {
      if (width > srcW) {
        console.log(`  · ${width}w skipped (would enlarge)`);
        continue;
      }
      const outName = `${id}-${width}.webp`;
      const outPath = path.join(OUT_DIR, outName);
      const info = await sharp(srcBuf, { failOn: "error" })
        .rotate() // apply EXIF orientation, then metadata is stripped by default
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: WEBP_QUALITY, effort: 5 })
        .toFile(outPath);
      const outBytes = (await stat(outPath)).size;
      outputs.push({ file: `media/images/${outName}`, width: info.width, height: info.height, bytes: outBytes });
      totalOut += outBytes;
      const flag = outBytes > 500 * 1024 ? "  ⚠ >500KB" : "";
      console.log(`  → ${outName}  ${info.width}×${info.height}  ${fmtBytes(outBytes)}${flag}`);
    }

    totalSrc += srcBytes;
    manifest.push({ source: `${from}/${file}`, id, role, sourceBytes: srcBytes, sourceWidth: srcW, sourceHeight: srcH, outputs });
  }

  await writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
  console.log(`\nManifest written: ${path.relative(process.cwd(), MANIFEST)}`);
  console.log(`Source total: ${fmtBytes(totalSrc)}  →  Output total: ${fmtBytes(totalOut)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
