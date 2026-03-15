"use client";

import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { ROOMS } from "@/types/room";

const ROOM_IMAGES: Record<string, string> = {
  Mirtillo: "/images/mirtillo.jpeg",
  Limone: "/images/lemon.jpeg",
  Oria: "/images/oria.jpeg",
  Francavilla: "/images/francavilla.jpeg",
};

export function RoomsSection() {
  const { t } = useLanguage();
  const maxGuests = process.env.NEXT_PUBLIC_MAX_GUESTS_PER_ROOM ?? "2";

  return (
    <section id="rooms" className="bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="font-serif text-2xl md:text-3xl font-light tracking-[0.1em] uppercase text-charcoal mb-5">
            {t.rooms.heading}
          </h2>
          <div className="w-8 h-px bg-stone-light mx-auto mb-4" />
          <p className="text-xs tracking-[0.08em] text-stone">
            {t.rooms.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-stone-light/20">
          {ROOMS.map((room) => (
            <article key={room} className="bg-white group">
              {/* Image with subtle bottom vignette */}
              <div className="relative aspect-[3/4] overflow-hidden bg-stone/10">
                <Image
                  src={ROOM_IMAGES[room]}
                  alt={`Camera ${room} — Il Casino Casalino, Francavilla Fontana`}
                  fill
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                {/* Subtle bottom gradient so the room name reads well */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
              </div>
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
