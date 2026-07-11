#!/usr/bin/env bash
#
# Video optimisation pipeline for Il Casino Casalino.
#
#   media-originals/videos/*.mp4  ->  public/media/videos/*.mp4 (+ WebP posters)
#
# The source clips are 4K HEVC (H.265) with AAC stereo audio — not reliably
# playable in browsers and far too large to host directly. This script transcodes
# them to web-ready H.264, generates a poster frame, and strips audio from the
# decorative clips. Safe to re-run.
#
# FFmpeg: uses $FFMPEG if set, else the system `ffmpeg`. The npm script wires in
# the bundled ffmpeg-static binary so no system install is required.
#
# Run with:  npm run media:optimise:videos
set -euo pipefail

SRC="media-originals/videos"
OUT="public/media/videos"
FFMPEG="${FFMPEG:-ffmpeg}"

if ! command -v "$FFMPEG" >/dev/null 2>&1 && [ ! -x "$FFMPEG" ]; then
  echo "✗ FFmpeg not found ($FFMPEG). Install it or set \$FFMPEG to a binary." >&2
  exit 1
fi

mkdir -p "$OUT"

# Encode a room video: NO audio (the site always plays these muted), 1080p cap,
# faststart for progressive play. Dropping the audio track trims the file size.
encode_room() {
  local name="$1"
  echo "→ room video: $name"
  "$FFMPEG" -y -i "$SRC/$name.mp4" \
    -vf "scale='min(1920,iw)':-2:flags=lanczos" \
    -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 26 -preset slow \
    -movflags +faststart -an \
    "$OUT/$name.mp4"
  # Poster from a representative frame (~1s in), as WebP.
  "$FFMPEG" -y -ss 00:00:01 -i "$SRC/$name.mp4" -frames:v 1 \
    -vf "scale='min(1280,iw)':-2" "$OUT/$name-poster.webp"
}

# Encode a decorative background clip: NO audio, 720p cap, higher CRF (smaller).
encode_decorative() {
  local name="$1"
  echo "→ decorative video: $name"
  "$FFMPEG" -y -i "$SRC/$name.mp4" \
    -vf "scale='min(1280,iw)':-2:flags=lanczos" \
    -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 28 -preset slow \
    -movflags +faststart -an \
    "$OUT/$name.mp4"
  "$FFMPEG" -y -ss 00:00:01 -i "$SRC/$name.mp4" -frames:v 1 \
    -vf "scale='min(1280,iw)':-2" "$OUT/$name-poster.webp"
}

# Muted web clips (no audio, 1080p) — autoplayed in the gallery.
# breakfast leads the gallery; the four rooms follow.
for r in breakfast luna sole stella venere; do
  [ -f "$SRC/$r.mp4" ] && encode_room "$r"
done

# Bathroom clips are excluded by default (redundant detail shots). Uncomment to add:
# for b in bathroom bathroom-2 bathroom-3 bathroom-4; do encode_decorative "$b"; done

echo "Done. Review output sizes with: du -h $OUT/*"
echo "Flag any clip that remains over ~6MB for further editing or external streaming."
