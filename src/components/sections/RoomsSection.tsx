"use client";

import { useLanguage } from "@/context/LanguageContext";
import { MediaCarousel } from "@/components/ui/MediaCarousel";
import { RoomSelector } from "@/components/ui/RoomSelector";
import { ROOM_GALLERY } from "@/data/media";

// Rooms reel — the same peek carousel as the first gallery, holding the twelve
// room videos grouped by room. The room icons above it are clickable: each jumps
// the reel to its room's first video, and the active icon tracks the clip in view.
export function RoomsSection() {
  const { t } = useLanguage();

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
        renderAbove={({ activeIndex, goTo }) => (
          <RoomSelector activeIndex={activeIndex} goTo={goTo} />
        )}
      />
    </section>
  );
}
