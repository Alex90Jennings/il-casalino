"use client";

import { useState, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { useLanguage } from "@/context/LanguageContext";
import type { Room } from "@/types/room";

interface DateRangePickerProps {
  checkIn: Date | undefined;
  checkOut: Date | undefined;
  onCheckInChange: (d: Date | undefined) => void;
  onCheckOutChange: (d: Date | undefined) => void;
  selectedRooms: Room[];
}

export function DateRangePicker({
  checkIn,
  checkOut,
  onCheckInChange,
  onCheckOutChange,
  selectedRooms,
}: DateRangePickerProps) {
  const { t, locale } = useLanguage();
  const [blockedDates, setBlockedDates] = useState<Date[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (selectedRooms.length === 0) return;
    const params = new URLSearchParams();
    selectedRooms.forEach((r) => params.append("room", r));
    fetch(`/api/availability?${params}`)
      .then((r) => r.json())
      .then((data: { blocked: string[] }) => {
        setBlockedDates(data.blocked.map((d) => new Date(d)));
      })
      .catch(() => setBlockedDates([]));
  }, [selectedRooms]);

  const handleSelect = (range: { from?: Date; to?: Date } | undefined) => {
    onCheckInChange(range?.from);
    onCheckOutChange(range?.to);
    if (range?.from && range?.to) setOpen(false);
  };

  const formatDate = (d: Date | undefined) =>
    d ? d.toLocaleDateString(locale === "it" ? "it-IT" : "en-GB") : "—";

  return (
    <div>
      <div className="grid grid-cols-2 gap-2 mb-2">
        <div>
          <p className="text-xs tracking-[0.12em] uppercase text-stone mb-1.5">
            {t.booking.checkIn}
          </p>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="w-full border border-stone-light/60 bg-white px-4 py-2.5 text-sm text-charcoal text-left hover:border-stone transition-colors"
          >
            {formatDate(checkIn)}
          </button>
        </div>
        <div>
          <p className="text-xs tracking-[0.12em] uppercase text-stone mb-1.5">
            {t.booking.checkOut}
          </p>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="w-full border border-stone-light/60 bg-white px-4 py-2.5 text-sm text-charcoal text-left hover:border-stone transition-colors"
          >
            {formatDate(checkOut)}
          </button>
        </div>
      </div>

      {open && (
        <div className="border border-stone-light/40 bg-white shadow-lg p-2 mt-1">
          <DayPicker
            mode="range"
            selected={checkIn || checkOut ? { from: checkIn, to: checkOut } : undefined}
            onSelect={handleSelect}
            disabled={[{ before: new Date() }, ...blockedDates]}
            numberOfMonths={1}
            classNames={{
              root: "text-sm",
            }}
          />
        </div>
      )}
    </div>
  );
}
