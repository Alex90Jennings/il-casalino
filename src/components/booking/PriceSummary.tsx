"use client";

import { useLanguage } from "@/context/LanguageContext";
import type { PriceSummary as Summary } from "@/types/booking";

interface PriceSummaryProps {
  summary: Summary;
}

export function PriceSummary({ summary }: PriceSummaryProps) {
  const { t } = useLanguage();
  const { nights, roomCount, breakfast, breakfastTotal, roomTotal, total } = summary;

  const fmt = (n: number) =>
    new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(n);

  return (
    <div className="border border-stone-light/40 bg-white p-4 space-y-2">
      <p className="text-xs tracking-[0.15em] uppercase text-stone mb-3">
        {t.booking.summary}
      </p>
      <div className="flex justify-between text-sm text-charcoal/80">
        <span>
          {t.booking.rooms.replace("{{n}}", String(roomCount))} ×{" "}
          {t.booking.nights.replace("{{n}}", String(nights))}
        </span>
        <span>{fmt(roomTotal)}</span>
      </div>
      <div className="flex justify-between text-sm text-charcoal/80">
        <span>
          {t.booking.breakfastLabel} (
          {breakfast ? t.booking.included : t.booking.notIncluded})
        </span>
        <span>{breakfast ? fmt(breakfastTotal) : "—"}</span>
      </div>
      <div className="border-t border-stone-light/40 pt-2 flex justify-between font-medium text-charcoal">
        <span className="text-xs tracking-widest uppercase">{t.booking.total}</span>
        <span className="font-serif text-lg">{fmt(total)}</span>
      </div>
    </div>
  );
}
