#!/usr/bin/env bash
#
# Video optimisation for Il Casino Casalino.
#
#   media-originals/room-videos/*.mp4   ->  public/media/videos/*.mp4 (+ posters)
#   media-originals/shared-area/*.mp4    ->  public/media/videos/*.mp4 (+ posters)
#
# Room clips feed the rooms gallery (user-controlled). Shared-area clips feed the
# first gallery reel (muted autoplay). Both are transcoded to a consistent
# web-ready H.264 MP4 (1280px cap, NO audio — every clip plays silent) plus a
# WebP poster, so playback is smooth and inline on iOS/Android/desktop.
#
# FFmpeg: uses $FFMPEG if set, else system `ffmpeg`. The npm script wires in the
# bundled ffmpeg-static binary. Deterministic settings; safe to re-run.
set -euo pipefail

ROOMS_SRC="media-originals/room-videos"
SHARED_SRC="media-originals/shared-area"
OUT="public/media/videos"
FFMPEG="${FFMPEG:-ffmpeg}"

if ! command -v "$FFMPEG" >/dev/null 2>&1 && [ ! -x "$FFMPEG" ]; then
  echo "✗ FFmpeg not found ($FFMPEG). Install it or set \$FFMPEG to a binary." >&2
  exit 1
fi

mkdir -p "$OUT"

# encode_file <source.mp4> <output-basename>
encode_file() {
  local src="$1" out="$2"
  echo "→ $out"
  "$FFMPEG" -y -loglevel error -i "$src" \
    -vf "scale='min(1280,iw)':-2:flags=lanczos" \
    -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 26 -preset medium \
    -movflags +faststart -an \
    "$OUT/$out.mp4"
  "$FFMPEG" -y -loglevel error -ss 00:00:01 -i "$src" -frames:v 1 \
    -vf "scale='min(1280,iw)':-2" "$OUT/$out-poster.webp"
}

# Room clips (4 rooms × 3) — output name = source name.
for f in "$ROOMS_SRC"/*.mp4; do
  encode_file "$f" "$(basename "$f" .mp4)"
done

# Shared-area clips for the first gallery reel. Explicit src → id mapping keeps
# clean names and avoids clashing with the shared image ids (courtyard/living-room).
encode_file "$SHARED_SRC/courtyard.mp4"                 "courtyard-video"
encode_file "$SHARED_SRC/living-room.mp4"               "living-room-video"
encode_file "$SHARED_SRC/billiards.mp4"                 "billiards"
encode_file "$SHARED_SRC/orange.mp4"                    "orange"
encode_file "$SHARED_SRC/breakfast.mp4"                 "breakfast"
encode_file "$SHARED_SRC/VID_20260629_165245_246.mp4"  "clip-1"
encode_file "$SHARED_SRC/VID_20260629_173125_291.mp4"  "clip-2"

echo "Done. Outputs in $OUT:"
du -h "$OUT"/*.mp4 | sort
