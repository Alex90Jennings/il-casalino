"use client";

import { useLanguage } from "@/context/LanguageContext";
import type { Room } from "@/types/room";

interface RoomSelectorProps {
  rooms: readonly Room[];
  selected: Room[];
  onChange: (rooms: Room[]) => void;
}

export function RoomSelector({ rooms, selected, onChange }: RoomSelectorProps) {
  const { t } = useLanguage();

  const toggle = (room: Room) => {
    if (selected.includes(room)) {
      onChange(selected.filter((r) => r !== room));
    } else {
      onChange([...selected, room]);
    }
  };

  return (
    <div>
      <p className="text-xs tracking-[0.12em] uppercase text-stone mb-2">
        {t.booking.selectRooms}
      </p>
      <div className="grid grid-cols-2 gap-2">
        {rooms.map((room) => {
          const active = selected.includes(room);
          return (
            <button
              key={room}
              type="button"
              onClick={() => toggle(room)}
              className={`px-3 py-2.5 text-sm border transition-all duration-200 text-left font-light ${
                active
                  ? "bg-charcoal text-white border-charcoal"
                  : "bg-white text-charcoal border-stone-light/60 hover:border-stone"
              }`}
            >
              {room}
            </button>
          );
        })}
      </div>
    </div>
  );
}
