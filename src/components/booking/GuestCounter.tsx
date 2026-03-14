"use client";

import { useLanguage } from "@/context/LanguageContext";

interface GuestCounterProps {
  value: number;
  onChange: (n: number) => void;
}

const MAX = Number(process.env.NEXT_PUBLIC_MAX_GUESTS_PER_ROOM ?? 2);

export function GuestCounter({ value, onChange }: GuestCounterProps) {
  const { t } = useLanguage();

  return (
    <div>
      <p className="text-xs tracking-[0.12em] uppercase text-stone mb-1.5">
        {t.booking.guests}
      </p>
      <div className="flex items-center gap-3 border border-stone-light/60 bg-white px-4 py-2 w-fit">
        <button
          type="button"
          onClick={() => onChange(Math.max(1, value - 1))}
          className="text-charcoal/60 hover:text-charcoal w-6 h-6 flex items-center justify-center transition-colors"
          aria-label="Decrease guests"
        >
          −
        </button>
        <span className="text-sm text-charcoal w-4 text-center">{value}</span>
        <button
          type="button"
          onClick={() => onChange(Math.min(MAX, value + 1))}
          className="text-charcoal/60 hover:text-charcoal w-6 h-6 flex items-center justify-center transition-colors"
          aria-label="Increase guests"
        >
          +
        </button>
      </div>
    </div>
  );
}
