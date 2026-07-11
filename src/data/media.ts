// Localised media metadata for Il Casino Casalino.
//
// Captions, alt text and tags are keyed by the same locale used everywhere else
// (see LanguageContext). This mirrors the existing per-item labelIt/labelEn
// convention rather than introducing a second translation system; section-level
// UI strings continue to live in src/translations.
//
// All paths point at optimised outputs under /media produced by
// `npm run media:optimise` (images) and `npm run media:optimise:videos` (video).
// Source originals in media-originals/ are never referenced by the site.

export type Locale = "en" | "it";
export type LocalisedText = { en: string; it: string };

// Group a gallery item belongs to — drives the room selector synchronisation.
export type GalleryGroup = "shared" | "sole" | "stella" | "luna" | "venere";

export interface MediaImage {
  id: string;
  /** Optimised master WebP; next/image derives responsive/AVIF variants from it. */
  src: string;
  width: number;
  height: number;
  alt: LocalisedText;
  caption: LocalisedText;
  tags: { en: string[]; it: string[] };
}

export interface RoomVideo {
  id: string;
  /** Web-ready H.264 MP4 (click-to-play, not preloaded). */
  src: string;
  /** WebP poster shown before playback. */
  poster: string;
  width: number;
  height: number;
  /** Poster alt text. */
  alt: LocalisedText;
  caption: LocalisedText;
}

export type RoomKey = "Sole" | "Stella" | "Luna" | "Venere";
export type RoomIcon = "sun" | "star" | "moon" | "shell";

export interface RoomMedia {
  key: RoomKey;
  group: GalleryGroup;
  icon: RoomIcon;
  /** Room name — Italian celestial name, English translation (Sun/Star/Moon/Venus). */
  name: LocalisedText;
  video: RoomVideo;
}

// Order shown in the selector: sun · star · moon · shell.
export const ROOM_ORDER: RoomKey[] = ["Sole", "Stella", "Luna", "Venere"];

// Hero / main image — the optimised pool photo.
export const HERO_IMAGE: MediaImage = {
  id: "pool",
  src: "/media/images/pool-1920.webp",
  width: 1920,
  height: 1280,
  alt: {
    en: "The swimming pool at Il Casino Casalino",
    it: "La piscina di Il Casino Casalino",
  },
  caption: { en: "Pool", it: "Piscina" },
  tags: { en: ["pool", "outdoor"], it: ["piscina", "esterno"] },
};

// Shared / common areas — the pool leads, then exteriors and interiors.
export const SHARED_GALLERY: MediaImage[] = [
  {
    id: "pool",
    src: "/media/images/pool-1280.webp",
    width: 1280,
    height: 853,
    alt: {
      en: "The swimming pool at Il Casino Casalino",
      it: "La piscina di Il Casino Casalino",
    },
    caption: { en: "Pool", it: "Piscina" },
    tags: { en: ["pool", "outdoor"], it: ["piscina", "esterno"] },
  },
  {
    id: "courtyard",
    src: "/media/images/courtyard-1280.webp",
    width: 1280,
    height: 853,
    alt: {
      en: "Sunlit stone courtyard of the property",
      it: "La corte in pietra della proprietà illuminata dal sole",
    },
    caption: { en: "Courtyard", it: "Corte" },
    tags: { en: ["courtyard", "outdoor"], it: ["corte", "esterno"] },
  },
  {
    id: "gate-entrance",
    src: "/media/images/gate-entrance-1280.webp",
    width: 1280,
    height: 853,
    alt: {
      en: "The arched stone entrance gate of Il Casino Casalino",
      it: "Il portale d'ingresso in pietra ad arco di Il Casino Casalino",
    },
    caption: { en: "Entrance", it: "Ingresso" },
    tags: { en: ["entrance", "architecture"], it: ["ingresso", "architettura"] },
  },
  {
    id: "outdoor-eating",
    src: "/media/images/outdoor-eating-1280.webp",
    width: 1280,
    height: 853,
    alt: {
      en: "Table laid for a meal outdoors in the garden",
      it: "Tavola apparecchiata per un pasto all'aperto nel giardino",
    },
    caption: { en: "Outdoor dining", it: "Pranzo all'aperto" },
    tags: { en: ["dining", "garden", "outdoor"], it: ["pranzo", "giardino", "esterno"] },
  },
  {
    id: "fireplace",
    src: "/media/images/fireplace-1280.webp",
    width: 1280,
    height: 853,
    alt: {
      en: "Traditional stone fireplace in the living room",
      it: "Il tradizionale camino in pietra nel soggiorno",
    },
    caption: { en: "Fireplace", it: "Camino" },
    tags: { en: ["fireplace", "interior"], it: ["camino", "interni"] },
  },
  {
    id: "billiard",
    src: "/media/images/billiard-1280.webp",
    width: 1280,
    height: 853,
    alt: {
      en: "The billiard room with its full-size table",
      it: "La sala biliardo con il tavolo da gioco",
    },
    caption: { en: "Billiard room", it: "Sala biliardo" },
    tags: { en: ["billiard", "interior", "leisure"], it: ["biliardo", "interni", "svago"] },
  },
  {
    id: "dinner-table",
    src: "/media/images/dinner-table-1280.webp",
    width: 1280,
    height: 853,
    alt: {
      en: "Dining table set for dinner indoors",
      it: "La tavola apparecchiata per la cena",
    },
    caption: { en: "Dinner", it: "Cena" },
    tags: { en: ["dining", "interior"], it: ["cena", "interni"] },
  },
];

function roomVideo(id: string, en: string, it: string): RoomVideo {
  return {
    id: `${id}-video`,
    src: `/media/videos/${id}.mp4`,
    poster: `/media/videos/${id}-poster.webp`,
    width: 1920,
    height: 1080,
    alt: { en, it },
    caption: { en: "Room video", it: "Video della camera" },
  };
}

// Breakfast clip — the lead item of the gallery.
export const BREAKFAST_VIDEO: RoomVideo = {
  id: "breakfast-video",
  src: "/media/videos/breakfast.mp4",
  poster: "/media/videos/breakfast-poster.webp",
  width: 1920,
  height: 1080,
  alt: {
    en: "Breakfast served at Il Casino Casalino",
    it: "La colazione servita a Il Casino Casalino",
  },
  caption: { en: "Breakfast", it: "Colazione" },
};

export const ROOMS: Record<RoomKey, RoomMedia> = {
  Sole: {
    key: "Sole",
    group: "sole",
    icon: "sun",
    name: { en: "Sun", it: "Sole" },
    video: roomVideo("sole", "The Sun guest room", "La camera Sole"),
  },
  Stella: {
    key: "Stella",
    group: "stella",
    icon: "star",
    name: { en: "Star", it: "Stella" },
    video: roomVideo("stella", "The Star guest room", "La camera Stella"),
  },
  Luna: {
    key: "Luna",
    group: "luna",
    icon: "moon",
    name: { en: "Moon", it: "Luna" },
    video: roomVideo("luna", "The Moon guest room", "La camera Luna"),
  },
  Venere: {
    key: "Venere",
    group: "venere",
    icon: "shell",
    name: { en: "Venus", it: "Venere" },
    video: roomVideo("venere", "The Venus guest room", "La camera Venere"),
  },
};

// A single carousel slide: an optimised image or a muted autoplay video.
export type GalleryItem =
  | ({ kind: "image"; group: GalleryGroup } & MediaImage)
  | ({ kind: "video"; group: GalleryGroup } & RoomVideo);

// One explicit, ordered, continuous sequence:
//   breakfast video → pool → shared common areas → Sole → Stella → Luna → Venere.
// Rooms are represented by their video only. This is the single source of
// ordering — components never re-order or filter it.
export const GALLERY: GalleryItem[] = [
  { kind: "video" as const, group: "shared" as const, ...BREAKFAST_VIDEO },
  ...SHARED_GALLERY.map((img) => ({ kind: "image" as const, group: "shared" as const, ...img })),
  ...ROOM_ORDER.map((key) => {
    const room = ROOMS[key];
    return { kind: "video" as const, group: room.group, ...room.video };
  }),
];

// First gallery index for a group — used to navigate the carousel to a room
// without filtering the sequence. Returns -1 if the group is absent.
export function firstGalleryIndex(group: GalleryGroup): number {
  return GALLERY.findIndex((item) => item.group === group);
}
