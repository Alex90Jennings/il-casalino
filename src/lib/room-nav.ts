// Pure, framework-agnostic helpers that map between the flattened rooms reel
// (ROOM_GALLERY — every room's clips concatenated in ROOM_ORDER) and the
// language-independent room slugs used by the selector. No DOM, no React, so the
// same functions drive the UI and are exercised directly by the test suite.

import type { LocalisedText, RoomKey, RoomMedia, RoomSlug } from "@/data/media";

// A minimal view of a slide: only its media kind matters for target selection.
export interface KindedItem {
  kind: "video" | "image";
}

export interface RoomTarget {
  slug: RoomSlug;
  /** Flattened index in the rooms reel of the room's navigation target. */
  index: number;
}

// The flattened index each room icon should jump to: the room's FIRST video, or —
// if a room unexpectedly has no video — its first media item. Rooms are laid out
// back-to-back in `roomOrder`, so a room's base is the sum of the earlier rooms'
// lengths. `itemsOf` yields a room's ordered slides (images may precede videos).
export function roomTargets(
  roomOrder: RoomKey[],
  rooms: Record<RoomKey, RoomMedia>,
  itemsOf: (room: RoomMedia) => KindedItem[],
): RoomTarget[] {
  const targets: RoomTarget[] = [];
  let base = 0;
  for (const key of roomOrder) {
    const room = rooms[key];
    const items = itemsOf(room);
    const firstVideo = items.findIndex((it) => it.kind === "video");
    const offset = firstVideo === -1 ? 0 : firstVideo;
    targets.push({ slug: room.slug, index: base + offset });
    base += items.length;
  }
  return targets;
}

// Inverse of roomTargets: which room owns a given reel index. Returns null for an
// index that belongs to no room (out of range, or shared-area media that is not
// part of the rooms reel) so shared media can never select a room icon.
export function activeRoomSlug(
  roomOrder: RoomKey[],
  rooms: Record<RoomKey, RoomMedia>,
  itemsOf: (room: RoomMedia) => KindedItem[],
  index: number,
): RoomSlug | null {
  if (index < 0) return null;
  let base = 0;
  for (const key of roomOrder) {
    const len = itemsOf(rooms[key]).length;
    if (index < base + len) return rooms[key].slug;
    base += len;
  }
  return null;
}

// Resolve a slug from a display label in EITHER locale, proving the two languages
// map to the same internal key. Case-insensitive; null if no room matches.
export function slugForLabel(
  roomOrder: RoomKey[],
  rooms: Record<RoomKey, RoomMedia>,
  label: string,
): RoomSlug | null {
  const needle = label.trim().toLowerCase();
  for (const key of roomOrder) {
    const name: LocalisedText = rooms[key].name;
    if (name.en.toLowerCase() === needle || name.it.toLowerCase() === needle) {
      return rooms[key].slug;
    }
  }
  return null;
}
