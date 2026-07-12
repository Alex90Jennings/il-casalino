// Emits the resolved media metadata as JSON so the test suite can verify the
// real structure/ordering at runtime (not just source patterns). Not a test file.
import { HERO_IMAGE, SHARED_GALLERY, ROOM_GALLERY, ROOMS, ROOM_ORDER } from "../src/data/media";

process.stdout.write(
  JSON.stringify({
    hero: { id: HERO_IMAGE.id, src: HERO_IMAGE.src },
    shared: SHARED_GALLERY.map((i) => ({
      id: i.id,
      kind: i.kind,
      src: i.src,
      poster: i.kind === "video" ? i.poster : null,
    })),
    roomOrder: ROOM_ORDER,
    roomGallery: ROOM_GALLERY.map((v) => ({ id: v.id, kind: v.kind, src: v.src, poster: v.kind === "video" ? v.poster : null })),
    rooms: Object.fromEntries(
      ROOM_ORDER.map((k) => [
        k,
        { icon: ROOMS[k].icon, videos: ROOMS[k].videos.map((v) => ({ id: v.id, src: v.src, poster: v.poster })) },
      ]),
    ),
  }),
);
