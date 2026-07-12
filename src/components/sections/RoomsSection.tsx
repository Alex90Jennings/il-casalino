"use client";

import { useLanguage } from "@/context/LanguageContext";
import { MediaCarousel } from "@/components/ui/MediaCarousel";
import { ROOM_GALLERY, ROOMS, ROOM_ORDER, type RoomIcon } from "@/data/media";

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

const VIDEOS_PER_ROOM = 3; // ROOM_GALLERY = Sole×3, Stella×3, Venere×3, Luna×3

// Rooms reel — the same peek carousel as the first gallery, holding the twelve
// room videos grouped by room. The room selector (as on main) navigates the
// carousel to a room's first clip; the active clip keeps the selector in sync.
export function RoomsSection() {
  const { t, locale } = useLanguage();

  return (
    <section id="rooms" className="bg-white pt-12 pb-8 md:pt-16 md:pb-10 overflow-hidden">
      <div className="text-center mb-8 px-6">
        <h2 className="font-serif text-2xl md:text-3xl font-light tracking-[0.1em] uppercase text-charcoal mb-5">
          {t.rooms.heading}
        </h2>
        <div className="w-8 h-px bg-stone-light mx-auto" />
      </div>

      <MediaCarousel
        items={ROOM_GALLERY}
        renderAbove={({ activeIndex, goTo }) => {
          const activeRoom = ROOM_ORDER[Math.floor(activeIndex / VIDEOS_PER_ROOM)];
          return (
            <div className="overflow-x-auto mb-9">
              <div
                role="group"
                aria-label={t.rooms.heading}
                className="flex w-max mx-auto gap-4 sm:gap-8 px-6 pb-1"
              >
                {ROOM_ORDER.map((key, roomIdx) => {
                  const room = ROOMS[key];
                  const selected = activeRoom === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => goTo(roomIdx * VIDEOS_PER_ROOM)}
                      aria-pressed={selected}
                      aria-label={room.name[locale]}
                      className="group flex flex-col items-center gap-2 focus:outline-none"
                    >
                      <span
                        className={`w-12 h-12 flex items-center justify-center rounded-full border transition-colors duration-300 ${
                          selected
                            ? "border-charcoal text-charcoal bg-charcoal/[0.04]"
                            : "border-stone-light/70 text-stone/70 group-hover:border-stone group-hover:text-stone group-focus-visible:border-stone"
                        }`}
                      >
                        <span className="w-6 h-6">{ROOM_ICONS[room.icon]}</span>
                      </span>
                      <span
                        className={`text-[10px] tracking-[0.18em] uppercase transition-colors duration-300 ${
                          selected ? "text-charcoal" : "text-stone/70 group-hover:text-stone"
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
        }}
      />
    </section>
  );
}
