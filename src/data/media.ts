// Localised media metadata for Il Casino Casalino.
//
// Captions and alt text are keyed by the same locale used everywhere else (see
// LanguageContext). This mirrors the existing per-item convention rather than
// introducing a second translation system; section-level UI strings live in
// src/translations. All paths point at optimised outputs under /media produced by
// `npm run media:optimise` (images) and `npm run media:optimise:videos` (video).
// Source originals in media-originals/ are never referenced by the site.

export type LocalisedText = { en: string; it: string };

export interface MediaImage {
  id: string;
  /** Optimised master WebP; next/image derives responsive/AVIF variants from it. */
  src: string;
  width: number;
  height: number;
  alt: LocalisedText;
  caption: LocalisedText;
}

export interface VideoItem {
  id: string;
  /** Web-ready H.264 MP4 (no audio). */
  src: string;
  /** WebP poster shown before playback. */
  poster: string;
  width: number;
  height: number;
  alt: LocalisedText;
  caption: LocalisedText;
}
export type RoomVideo = VideoItem;

// A slide in the first gallery reel: a muted-autoplay video or an image.
export type SharedItem =
  | ({ kind: "video" } & VideoItem)
  | ({ kind: "image" } & MediaImage);

export type RoomKey = "Sole" | "Stella" | "Venere" | "Luna";
export type RoomIcon = "sun" | "star" | "shell" | "moon";
/** Language-independent internal key for a room. Never a translated label. Used
 *  for DOM targets, selector lookups and the active-room scroll sync. */
export type RoomSlug = "sun" | "star" | "venus" | "moon";

export interface RoomMedia {
  key: RoomKey;
  icon: RoomIcon;
  /** Stable, locale-independent identity used by the selector/nav (see RoomSlug). */
  slug: RoomSlug;
  /** Room name — Italian celestial name, English translation (Sun/Star/Venus/Moon). */
  name: LocalisedText;
  /** Exactly three clips for the room, grouped and ordered. */
  videos: VideoItem[];
}

// Selector order: Sole · Stella · Venere · Luna (sun · star · shell · moon).
export const ROOM_ORDER: RoomKey[] = ["Sole", "Stella", "Venere", "Luna"];

const LANDSCAPE = { width: 1280, height: 853 };
const PORTRAIT = { width: 1280, height: 1920 };
const VIDEO = { width: 1280, height: 720 };

// Hero / main image — the arched stone entrance gate.
export const HERO_IMAGE: MediaImage = {
  id: "gate-entrance",
  src: "/media/images/gate-entrance-2560.webp",
  width: 2560,
  height: 1707,
  alt: {
    en: "The arched stone entrance gate of Il Casino Casalino",
    it: "Il portale d'ingresso in pietra ad arco di Il Casino Casalino",
  },
  caption: { en: "Entrance", it: "Ingresso" },
};

// Host portrait — Simona. Shown as a small circular profile photo in the About
// section; the 800w variant is the master (400/800 for 1x/2x).
export const HOST_IMAGE: MediaImage = {
  id: "host",
  src: "/media/images/host-800.webp",
  width: 800,
  height: 1200,
  alt: {
    en: "Simona, your host at Il Casino Casalino",
    it: "Simona, la tua host a Il Casino Casalino",
  },
  caption: { en: "Simona", it: "Simona" },
};

function img(
  id: string,
  shape: typeof LANDSCAPE | typeof PORTRAIT,
  captionEn: string,
  captionIt: string,
  altEn: string,
  altIt: string,
): MediaImage {
  return {
    id,
    src: `/media/images/${id}-1280.webp`,
    ...shape,
    caption: { en: captionEn, it: captionIt },
    alt: { en: altEn, it: altIt },
  };
}

function video(id: string, captionEn: string, captionIt: string): VideoItem {
  return {
    id,
    src: `/media/videos/${id}.mp4`,
    poster: `/media/videos/${id}-poster.webp`,
    ...VIDEO,
    caption: { en: captionEn, it: captionIt },
    alt: { en: `${captionEn} — Il Casino Casalino`, it: `${captionIt} — Il Casino Casalino` },
  };
}

// Shared-area clips (muted autoplay) that lead the first gallery reel.
const SHARED_VIDEOS: VideoItem[] = [
  video("breakfast", "Breakfast", "La colazione"),
  video("living-room-video", "The living room", "Il soggiorno"),
  video("billiards", "Billiard room", "Sala biliardo"),
  video("orange", "Citrus grove", "Agrumeto"),
  video("clip-1", "The property", "La proprietà"),
  video("clip-2", "The countryside", "La campagna"),
  video("courtyard-video", "Courtyard", "Corte"),
];

// Shared-area photos — a deliberate, stable order (exteriors → interiors →
// dining → garden → setting). gate-entrance is the hero and is not repeated.
const SHARED_IMAGES: MediaImage[] = [
  img("courtyard", LANDSCAPE, "Courtyard", "Corte", "The sunlit stone courtyard", "La corte in pietra illuminata dal sole"),
  img("angle", PORTRAIT, "The residence", "La dimora", "A view of the historic stone residence", "Uno scorcio della dimora storica in pietra"),
  img("bell", PORTRAIT, "The bell", "La campana", "The old wall bell of the property", "L'antica campana a muro della proprietà"),
  img("chimney", PORTRAIT, "The chimney", "Il comignolo", "A traditional Puglian chimney against the sky", "Un comignolo tradizionale pugliese contro il cielo"),
  img("fireplace", LANDSCAPE, "The fireplace", "Il camino", "The traditional stone fireplace", "Il tradizionale camino in pietra"),
  img("billiard", LANDSCAPE, "Billiard room", "Sala biliardo", "The billiard room with its full-size table", "La sala biliardo con il tavolo da gioco"),
  img("coffee", PORTRAIT, "Breakfast", "La colazione", "A cup of coffee laid out for breakfast", "Una tazza di caffè per la colazione"),
  img("dinner-table", LANDSCAPE, "The dining room", "La sala da pranzo", "The dining table set indoors", "La tavola apparecchiata all'interno"),
  img("outdoor-eating", LANDSCAPE, "Outdoor dining", "Pranzo all'aperto", "A table laid for a meal in the garden", "Una tavola apparecchiata per un pasto nel giardino"),
  img("orto", PORTRAIT, "The vegetable garden", "L'orto", "The property's vegetable garden", "L'orto della proprietà"),
  img("orto-1", LANDSCAPE, "In the garden", "Nell'orto", "Rows of vegetables in the kitchen garden", "Filari di ortaggi nell'orto"),
  img("trees", PORTRAIT, "The grounds", "Il giardino", "Trees in the surrounding grounds", "Gli alberi del giardino circostante"),
  img("flower", PORTRAIT, "In bloom", "In fiore", "Flowers in bloom in the garden", "Fiori in fiore nel giardino"),
  img("cactus", LANDSCAPE, "Greenery", "Le piante", "Mediterranean plants around the property", "Piante mediterranee attorno alla proprietà"),
  img("francavilla", LANDSCAPE, "The property", "La proprietà", "Il Casino Casalino in the Puglian countryside", "Il Casino Casalino nella campagna pugliese"),
  img("pool", LANDSCAPE, "Pool", "Piscina", "The swimming pool set in the garden", "La piscina immersa nel giardino"),
];

// First gallery reel — videos first, then photos. Single source of ordering.
export const SHARED_GALLERY: SharedItem[] = [
  ...SHARED_VIDEOS.map((v) => ({ kind: "video" as const, ...v })),
  ...SHARED_IMAGES.map((i) => ({ kind: "image" as const, ...i })),
];

// Room display names — the single source shared by the video captions and the
// selector icon labels, so both read "Star"/"Stella" in the active locale.
const ROOM_NAMES: Record<RoomKey, LocalisedText> = {
  Sole: { en: "Sun", it: "Sole" },
  Stella: { en: "Star", it: "Stella" },
  Venere: { en: "Venus", it: "Venere" },
  Luna: { en: "Moon", it: "Luna" },
};

function roomVideo(id: string, captionEn: string, captionIt: string, name: LocalisedText): VideoItem {
  return {
    id,
    src: `/media/videos/${id}.mp4`,
    poster: `/media/videos/${id}-poster.webp`,
    ...VIDEO,
    caption: { en: `${name.en} — ${captionEn}`, it: `${name.it} — ${captionIt}` },
    alt: { en: `${name.en} — ${captionEn}`, it: `${name.it} — ${captionIt}` },
  };
}

// Each room has exactly three clips, grouped together (never interleaved).
// Derived from filenames: {room}, {room}-bath, {room}-pillow — Venere has no base
// clip, so it uses {venere-bed, venere-bath, venere-pillow}.
export const ROOMS: Record<RoomKey, RoomMedia> = {
  Sole: {
    key: "Sole",
    icon: "sun",
    slug: "sun",
    name: ROOM_NAMES.Sole,
    videos: [
      roomVideo("sole", "The room", "La camera", ROOM_NAMES.Sole),
      roomVideo("sole-bath", "The bathroom", "Il bagno", ROOM_NAMES.Sole),
      roomVideo("sole-pillow", "Details", "Dettagli", ROOM_NAMES.Sole),
    ],
  },
  Stella: {
    key: "Stella",
    icon: "star",
    slug: "star",
    name: ROOM_NAMES.Stella,
    videos: [
      roomVideo("stella", "The room", "La camera", ROOM_NAMES.Stella),
      roomVideo("stella-bath", "The bathroom", "Il bagno", ROOM_NAMES.Stella),
      roomVideo("stella-pillow", "Details", "Dettagli", ROOM_NAMES.Stella),
    ],
  },
  Venere: {
    key: "Venere",
    icon: "shell",
    slug: "venus",
    name: ROOM_NAMES.Venere,
    videos: [
      roomVideo("venere-bed", "The room", "La camera", ROOM_NAMES.Venere),
      roomVideo("venere-bath", "The bathroom", "Il bagno", ROOM_NAMES.Venere),
      roomVideo("venere-pillow", "Details", "Dettagli", ROOM_NAMES.Venere),
    ],
  },
  Luna: {
    key: "Luna",
    icon: "moon",
    slug: "moon",
    name: ROOM_NAMES.Luna,
    videos: [
      roomVideo("luna", "The room", "La camera", ROOM_NAMES.Luna),
      roomVideo("luna-bath", "The bathroom", "Il bagno", ROOM_NAMES.Luna),
      roomVideo("luna-pillow", "Details", "Dettagli", ROOM_NAMES.Luna),
    ],
  },
};

// Rooms gallery reel — the twelve room videos, grouped by room in selector order
// (Sole → Stella → Venere → Luna), rendered in the same carousel as the reel.
export const ROOM_GALLERY: SharedItem[] = ROOM_ORDER.flatMap((key) =>
  ROOMS[key].videos.map((v) => ({ kind: "video" as const, ...v })),
);
