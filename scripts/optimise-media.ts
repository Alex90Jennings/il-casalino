/**
 * Image optimisation pipeline for Il Casino Casalino.
 *
 *   media-originals/images/*.jpg  ->  public/media/images/<name>-<width>.webp
 *
 * Deterministic, safe to run repeatedly, never enlarges, strips metadata and
 * corrects EXIF orientation. Only the curated files listed in IMAGE_CONFIG are
 * processed; anything else in the source folder is skipped with a notice.
 *
 * Run with:  npm run media:optimise
 */

import { readFile, writeFile, mkdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import sharp, { type Metadata } from "sharp";

const SRC_DIR = path.resolve("media-originals/images");
const OUT_DIR = path.resolve("public/media/images");
const MANIFEST = path.resolve("media-manifest.json");

const WEBP_QUALITY = 78;

// Role-based widths — only sizes that are actually useful for each role.
const ROLE_WIDTHS = {
  hero: [960, 1280, 1600, 1920],
  gallery: [640, 960, 1280],
} as const;

type Role = keyof typeof ROLE_WIDTHS;

// Curated set only. Files not listed here are intentionally excluded from the
// site and are left untouched in media-originals.
const IMAGE_CONFIG: { file: string; role: Role }[] = [
  { file: "pool.jpg", role: "hero" },
  { file: "courtyard.jpg", role: "gallery" },
  { file: "gate-entrance.jpg", role: "gallery" },
  { file: "outdoor-eating.jpg", role: "gallery" },
  { file: "fireplace.jpg", role: "gallery" },
  { file: "billiard.jpg", role: "gallery" },
  { file: "dinner-table.jpg", role: "gallery" },
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
  role: Role;
  sourceBytes: number;
  sourceWidth: number;
  sourceHeight: number;
  outputs: OutputRecord[];
}

async function main() {
  if (!existsSync(SRC_DIR)) {
    console.error(`✗ Source directory not found: ${SRC_DIR}`);
    process.exit(1);
  }
  await mkdir(OUT_DIR, { recursive: true });

  const manifest: ManifestEntry[] = [];
  let totalSrc = 0;
  let totalOut = 0;

  for (const { file, role } of IMAGE_CONFIG) {
    const srcPath = path.join(SRC_DIR, file);
    if (!existsSync(srcPath)) {
      console.error(`✗ Missing source, skipping: ${file}`);
      continue;
    }

    const srcBuf = await readFile(srcPath);
    const srcBytes = srcBuf.length;
    let meta: Metadata;
    try {
      meta = await sharp(srcBuf, { failOn: "error" }).metadata();
    } catch {
      console.error(`✗ Unreadable image, skipping: ${file}`);
      continue;
    }
    // EXIF orientation can swap reported width/height; normalise to displayed.
    const oriented = meta.orientation && meta.orientation >= 5;
    const srcW = (oriented ? meta.height : meta.width) ?? 0;
    const srcH = (oriented ? meta.width : meta.height) ?? 0;

    const base = path.basename(file, path.extname(file));
    const outputs: OutputRecord[] = [];

    console.log(`\n${file}  (${srcW}×${srcH}, ${fmtBytes(srcBytes)}, role=${role})`);
    for (const width of ROLE_WIDTHS[role]) {
      if (width > srcW) {
        console.log(`  · ${width}w skipped (would enlarge)`);
        continue;
      }
      const outName = `${base}-${width}.webp`;
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
    manifest.push({ source: file, role, sourceBytes: srcBytes, sourceWidth: srcW, sourceHeight: srcH, outputs });
  }

  await writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
  console.log(`\nManifest written: ${path.relative(process.cwd(), MANIFEST)}`);
  console.log(`Source total: ${fmtBytes(totalSrc)}  →  Output total: ${fmtBytes(totalOut)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
