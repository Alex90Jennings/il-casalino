"use client";

import { useEffect, useMemo, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { usePrefersReducedMotion } from "@/lib/reduced-motion";
import { roomTargets, activeRoomSlug } from "@/lib/room-nav";
import { ROOMS, ROOM_ORDER, type RoomIcon, type RoomSlug } from "@/data/media";

const ROOM_ICONS: Record<RoomIcon, React.ReactNode> = {
  sun: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2}>
      <circle cx="12" cy="12" r="3.5" />
      <path strokeLinecap="round" d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6L7 7M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4" />
    </svg>
  ),
  star: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4l2.35 4.76 5.25.76-3.8 3.7.9 5.23L12 16.9l-4.7 2.47.9-5.23-3.8-3.7 5.25-.76z" />
    </svg>
  ),
  shell: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.15}>
      <g transform="translate(0,-1)">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 6.8q1.8-2 3.6 0 1.8-2 3.6 0 1.8-2 3.6 0 1.8-2 3.6 0 1.8-2 3.6 0C21 13 16.2 19 13 20.2L12.9 21.6Q12 22 11.1 21.6L11 20.2C7.8 19 3 13 3 6.8Z"
        />
        <path strokeLinecap="round" d="M12 20 4.9 6.6M12 20 8.4 5.6M12 20 12 5.2M12 20 15.6 5.6M12 20 19.1 6.6" />
      </g>
    </svg>
  ),
  moon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 13.5A7.5 7.5 0 1 1 10.5 4a6 6 0 0 0 9.5 9.5z" />
    </svg>
  ),
};

interface RoomSelectorProps {
  /** Index of the active clip within the rooms reel (ROOM_GALLERY order). */
  activeIndex: number;
  /** Navigate the reel to the given clip index (respects reduced motion). */
  goTo: (index: number) => void;
}

// Clickable room icons above the rooms reel. Each icon jumps the carousel to its
// room's first video; the active icon is derived from the reel's active clip and
// kept in view within the horizontally-scrollable selector. Navigation stays
// inside the carousel — it never scrolls the page or touches the URL.
export function RoomSelector({ activeIndex, goTo }: RoomSelectorProps) {
  const { t, locale } = useLanguage();
  const reducedMotion = usePrefersReducedMotion();

  // Precompute each room icon's target clip index (first video, else first media).
  const targets = useMemo(
    () => roomTargets(ROOM_ORDER, ROOMS, (room) => room.videos.map(() => ({ kind: "video" as const }))),
    [],
  );
  const targetForSlug = useMemo(
    () => new Map<RoomSlug, number>(targets.map((tg) => [tg.slug, tg.index])),
    [targets],
  );

  const activeSlug = activeRoomSlug(
    ROOM_ORDER,
    ROOMS,
    (room) => room.videos.map(() => ({ kind: "video" as const })),
    activeIndex,
  );

  // Keep the active icon centred, scrolling ONLY the selector container and only
  // when it actually overflows. (scrollIntoView would also scroll ancestor
  // scrollables — including the section's overflow-hidden wrapper — dragging the
  // whole reel sideways when centring the rightmost icons.)
  const scrollRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef(new Map<RoomSlug, HTMLButtonElement>());
  useEffect(() => {
    if (!activeSlug) return;
    const container = scrollRef.current;
    const btn = buttonRefs.current.get(activeSlug);
    if (!container || !btn) return;
    if (container.scrollWidth <= container.clientWidth) return; // fits — nothing to centre
    const cRect = container.getBoundingClientRect();
    const bRect = btn.getBoundingClientRect();
    const delta = bRect.left + bRect.width / 2 - (cRect.left + container.clientWidth / 2);
    const max = container.scrollWidth - container.clientWidth;
    container.scrollTo({
      left: Math.max(0, Math.min(container.scrollLeft + delta, max)),
      behavior: reducedMotion ? "auto" : "smooth",
    });
  }, [activeSlug, reducedMotion]);

  return (
    <div ref={scrollRef} className="overflow-x-auto mb-9">
      <div
        role="group"
        aria-label={t.rooms.heading}
        className="flex w-max mx-auto gap-4 sm:gap-8 px-6 pb-1"
      >
        {ROOM_ORDER.map((key) => {
          const room = ROOMS[key];
          const active = activeSlug === room.slug;
          return (
            <button
              key={key}
              type="button"
              ref={(el) => {
                if (el) buttonRefs.current.set(room.slug, el);
                else buttonRefs.current.delete(room.slug);
              }}
              onClick={() => goTo(targetForSlug.get(room.slug) ?? 0)}
              aria-label={t.rooms.viewRoom.replace("{{room}}", room.name[locale])}
              aria-current={active ? "true" : undefined}
              className="flex flex-col items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-charcoal/40 rounded-md"
            >
              <span
                className={`w-12 h-12 flex items-center justify-center rounded-full border transition-colors duration-300 ${
                  active
                    ? "border-charcoal text-charcoal bg-charcoal/[0.04]"
                    : "border-stone-light/70 text-stone/40"
                }`}
              >
                <span className="w-6 h-6">{ROOM_ICONS[room.icon]}</span>
              </span>
              <span
                className={`text-[10px] tracking-[0.18em] uppercase transition-colors duration-300 ${
                  active ? "text-charcoal" : "text-stone/40"
                }`}
              >
                {room.name[locale]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
