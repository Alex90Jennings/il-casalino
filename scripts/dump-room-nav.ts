// Exercises the room-nav helpers against the real media data plus a synthetic
// room layout (images before videos / no video), emitting JSON so the test suite
// can assert the actual runtime behaviour. Not a test file.
import { ROOMS, ROOM_ORDER, type RoomKey, type RoomMedia } from "../src/data/media";
import { roomTargets, activeRoomSlug, slugForLabel } from "../src/lib/room-nav";

const roomItems = (room: RoomMedia) => room.videos.map(() => ({ kind: "video" as const }));

// Real reel: each room's target index and the active slug at every reel position.
const targets = roomTargets(ROOM_ORDER, ROOMS, roomItems);
const total = ROOM_ORDER.reduce((n, k) => n + ROOMS[k].videos.length, 0);
const activeByIndex: Record<number, string | null> = {};
for (const i of [-1, ...Array.from({ length: total }, (_, i) => i), total, 999]) {
  activeByIndex[i] = activeRoomSlug(ROOM_ORDER, ROOMS, roomItems, i);
}

// Both locale labels must resolve to the same internal slug.
const labelMap = ROOM_ORDER.map((key) => ({
  key,
  slug: ROOMS[key].slug,
  fromEn: slugForLabel(ROOM_ORDER, ROOMS, ROOMS[key].name.en),
  fromIt: slugForLabel(ROOM_ORDER, ROOMS, ROOMS[key].name.it),
}));

// Synthetic layout: images before the video (target = first video), and a room
// with no video at all (fallback = first media item).
const synthOrder: RoomKey[] = ["Sole", "Stella"];
const synthItems: Record<RoomKey, ("video" | "image")[]> = {
  Sole: ["image", "image", "video", "video"],
  Stella: ["image", "image"],
  Venere: [],
  Luna: [],
};
const synthTargets = roomTargets(
  synthOrder,
  ROOMS,
  (room) => synthItems[room.key].map((kind) => ({ kind })),
);

process.stdout.write(
  JSON.stringify({
    targets,
    total,
    activeByIndex,
    labelMap,
    unknownLabel: slugForLabel(ROOM_ORDER, ROOMS, "Kitchen"),
    synthTargets,
  }),
);
