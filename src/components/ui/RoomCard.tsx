"use client";

import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import type { Room } from "@/types/room";

interface RoomCardProps {
  name: Room;
  image?: string;
}

export function RoomCard({ name, image }: RoomCardProps) {
  const { t } = useLanguage();
  const description = t.rooms[name]?.description ?? "";
  const maxGuests = process.env.NEXT_PUBLIC_MAX_GUESTS_PER_ROOM ?? "2";

  return (
    <article className="group overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-light/30">
        {image ? (
          <Image
            src={image}
            alt={`Camera ${name}`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-serif text-stone/40 text-lg">{name}</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-6">
        <h3 className="font-serif text-xl font-light text-charcoal mb-1 tracking-wide">
          {name}
        </h3>
        <p className="text-xs text-stone tracking-widest uppercase mb-3">
          {t.rooms.maxGuests.replace("{{n}}", maxGuests)}
        </p>
        <p className="text-sm text-charcoal/70 leading-relaxed font-light">
          {description}
        </p>
      </div>
    </article>
  );
}
