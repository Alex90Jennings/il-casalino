// Emits the resolved gallery data as JSON so the test suite can verify the
// real ordering/indices at runtime (not just source patterns). Not a test file.
import { GALLERY, firstGalleryIndex, ROOM_ORDER, ROOMS } from "../src/data/media";

const firsts = Object.fromEntries(
  ROOM_ORDER.map((k) => [ROOMS[k].group, firstGalleryIndex(ROOMS[k].group)]),
);

process.stdout.write(
  JSON.stringify({
    gallery: GALLERY.map((i) => ({ id: i.id, group: i.group, kind: i.kind })),
    firsts,
    roomOrder: ROOM_ORDER.map((k) => ROOMS[k].group),
  }),
);
