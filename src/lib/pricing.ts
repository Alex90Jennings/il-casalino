import type { PriceSummary } from "@/types/booking";

// Room base rates (€/night) — update these or move to DB when pricing is finalised
export const ROOM_RATES: Record<string, number> = {
  Stella: 90,
  Luna: 90,
  Venere: 100,
  Marte: 110,
};

export function calculateNights(checkIn: Date, checkOut: Date): number {
  const ms = checkOut.getTime() - checkIn.getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

export function calculatePrice(params: {
  rooms: string[];
  checkIn: Date;
  checkOut: Date;
  guests: number;
  breakfast: boolean;
}): PriceSummary {
  const { rooms, checkIn, checkOut, guests, breakfast } = params;
  const nights = calculateNights(checkIn, checkOut);
  const breakfastPricePerPersonPerNight = Number(
    process.env.NEXT_PUBLIC_BREAKFAST_PRICE_PER_PERSON_PER_NIGHT ?? 6
  );

  const roomTotal = rooms.reduce((sum, room) => {
    return sum + (ROOM_RATES[room] ?? 90) * nights;
  }, 0);

  const breakfastTotal = breakfast
    ? breakfastPricePerPersonPerNight * guests * nights
    : 0;

  return {
    nights,
    roomCount: rooms.length,
    guests,
    breakfast,
    breakfastTotal,
    roomTotal,
    total: roomTotal + breakfastTotal,
  };
}
