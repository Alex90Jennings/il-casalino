"use client";

import { useLanguage } from "@/context/LanguageContext";
import { ROOMS } from "@/types/room";

const ROOM_IMAGES: Record<string, string> = {
  Mirtillo: "/images/rooms/mirtillo/main.jpg",
  Limone: "/images/rooms/limone/main.jpg",
  Oria: "/images/rooms/oria/main.jpg",
  Francavilla: "/images/rooms/francavilla/main.jpg",
};

export function RoomsSection() {
  const { t } = useLanguage();
  const maxGuests = process.env.NEXT_PUBLIC_MAX_GUESTS_PER_ROOM ?? "2";

  return (
    <section id="rooms" className="bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section heading */}
        <div className="text-center mb-12">
          <h2 className="font-serif text-2xl md:text-3xl font-light tracking-[0.1em] uppercase text-charcoal mb-5">
            {t.rooms.heading}
          </h2>
          <div className="w-8 h-px bg-stone-light mx-auto mb-4" />
          <p className="text-xs tracking-[0.08em] text-stone">
            {t.rooms.subtitle}
          </p>
        </div>

        {/* Room grid — 2 cols on tablet, 4 on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-stone-light/20">
          {ROOMS.map((room) => (
            <article key={room} className="bg-white group">
              {/* Image */}
              <div className="relative aspect-[3/4] overflow-hidden bg-stone/10">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.03]"
                  style={{ backgroundImage: `url('${ROOM_IMAGES[room]}')` }}
                  role="img"
                  aria-label={`Camera ${room}`}
                />
              </div>
              {/* Text */}
              <div className="px-5 py-5">
                <h3 className="font-serif text-lg font-light tracking-widest uppercase text-charcoal mb-1">
                  {room}
                </h3>
                <p className="text-[10px] tracking-[0.15em] uppercase text-stone mb-3">
                  {t.rooms.maxGuests.replace("{{n}}", maxGuests)}
                </p>
                <p className="text-xs text-charcoal/60 leading-relaxed font-light">
                  {t.rooms[room]?.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
