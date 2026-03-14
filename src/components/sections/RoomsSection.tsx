"use client";

import { useLanguage } from "@/context/LanguageContext";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RoomCard } from "@/components/ui/RoomCard";
import { ROOMS } from "@/types/room";

const ROOM_IMAGES: Record<string, string | undefined> = {
  Mirtillo: "/images/rooms/mirtillo/main.jpg",
  Limone: "/images/rooms/limone/main.jpg",
  Oria: "/images/rooms/oria/main.jpg",
  Francavilla: "/images/rooms/francavilla/main.jpg",
};

export function RoomsSection() {
  const { t } = useLanguage();

  return (
    <section id="rooms" className="bg-white py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading
          title={t.rooms.heading}
          subtitle={t.rooms.subtitle}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ROOMS.map((room) => (
            <RoomCard
              key={room}
              name={room}
              image={ROOM_IMAGES[room]}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
