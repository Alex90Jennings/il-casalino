"use client";

import { useState, useMemo } from "react";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useLanguage } from "@/context/LanguageContext";
import { ROOMS, type Room } from "@/types/room";
import { calculatePrice, calculateNights } from "@/lib/pricing";
import { RoomSelector } from "./RoomSelector";
import { DateRangePicker } from "./DateRangePicker";
import { GuestCounter } from "./GuestCounter";
import { BreakfastToggle } from "./BreakfastToggle";
import { PriceSummary } from "./PriceSummary";
import { PayPalButton } from "./PayPalButton";

const MIN_NIGHTS = Number(process.env.NEXT_PUBLIC_BOOKING_MIN_NIGHTS ?? 3);

export function BookingWidget() {
  const { t } = useLanguage();

  const [selectedRooms, setSelectedRooms] = useState<Room[]>([]);
  const [checkIn, setCheckIn] = useState<Date | undefined>();
  const [checkOut, setCheckOut] = useState<Date | undefined>();
  const [guests, setGuests] = useState(1);
  const [breakfast, setBreakfast] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  const pricing = useMemo(() => {
    if (!checkIn || !checkOut || selectedRooms.length === 0) return null;
    return calculatePrice({ rooms: selectedRooms, checkIn, checkOut, guests, breakfast });
  }, [selectedRooms, checkIn, checkOut, guests, breakfast]);

  const validate = (): boolean => {
    if (selectedRooms.length === 0) {
      setError(t.booking.selectRoomError);
      return false;
    }
    if (!checkIn || !checkOut) {
      setError("Seleziona le date di arrivo e partenza.");
      return false;
    }
    if (calculateNights(checkIn, checkOut) < MIN_NIGHTS) {
      setError(t.booking.minNightsError.replace("{{n}}", String(MIN_NIGHTS)));
      return false;
    }
    setError(null);
    return true;
  };

  const isReady =
    selectedRooms.length > 0 &&
    checkIn &&
    checkOut &&
    guestName.trim() &&
    guestEmail.trim() &&
    pricing &&
    pricing.nights >= MIN_NIGHTS;

  return (
    <PayPalScriptProvider
      options={{
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
        currency: process.env.NEXT_PUBLIC_PAYPAL_CURRENCY ?? "EUR",
      }}
    >
      <div className="max-w-3xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left column */}
          <div className="space-y-5">
            <RoomSelector
              rooms={ROOMS}
              selected={selectedRooms}
              onChange={setSelectedRooms}
            />
            <DateRangePicker
              checkIn={checkIn}
              checkOut={checkOut}
              onCheckInChange={setCheckIn}
              onCheckOutChange={setCheckOut}
              selectedRooms={selectedRooms}
            />
            <GuestCounter value={guests} onChange={setGuests} />
            <BreakfastToggle checked={breakfast} onChange={setBreakfast} />
          </div>

          {/* Right column */}
          <div className="space-y-5">
            {/* Guest details */}
            <div>
              <label className="block text-xs tracking-[0.12em] uppercase text-stone mb-1.5">
                {t.booking.name}
              </label>
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="w-full border border-stone-light/60 bg-white px-4 py-2.5 text-sm text-charcoal focus:outline-none focus:border-stone transition-colors"
                placeholder={t.booking.name}
              />
            </div>
            <div>
              <label className="block text-xs tracking-[0.12em] uppercase text-stone mb-1.5">
                {t.booking.email}
              </label>
              <input
                type="email"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                className="w-full border border-stone-light/60 bg-white px-4 py-2.5 text-sm text-charcoal focus:outline-none focus:border-stone transition-colors"
                placeholder={t.booking.email}
              />
            </div>
            <div>
              <label className="block text-xs tracking-[0.12em] uppercase text-stone mb-1.5">
                {t.booking.notes}
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full border border-stone-light/60 bg-white px-4 py-2.5 text-sm text-charcoal focus:outline-none focus:border-stone transition-colors resize-none"
                placeholder={t.booking.notes}
              />
            </div>

            {/* Price summary */}
            {pricing && <PriceSummary summary={pricing} />}

            {/* Error */}
            {error && (
              <p className="text-red-600 text-xs">{error}</p>
            )}

            {/* PayPal button */}
            {isReady ? (
              <PayPalButton
                pricing={pricing!}
                bookingData={{
                  rooms: selectedRooms,
                  checkIn: checkIn!,
                  checkOut: checkOut!,
                  guests,
                  breakfast,
                  guestName,
                  guestEmail,
                  notes,
                }}
                onValidate={validate}
              />
            ) : (
              <button
                onClick={validate}
                className="w-full bg-charcoal/20 text-charcoal/40 text-xs tracking-[0.2em] uppercase py-3 cursor-not-allowed"
                disabled
              >
                {t.booking.payWith}
              </button>
            )}
          </div>
        </div>
      </div>
    </PayPalScriptProvider>
  );
}
