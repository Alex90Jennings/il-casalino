import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { blockedDates, bookings, bookingRooms } from "@/lib/schema";
import { inArray, eq, and, or, gte, lte } from "drizzle-orm";
import type { Room } from "@/types/room";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const rooms = searchParams.getAll("room") as Room[];

  if (rooms.length === 0) {
    return NextResponse.json({ blocked: [] });
  }

  // Fetch explicitly blocked dates for requested rooms
  const manuallyBlocked = await db
    .select({ date: blockedDates.date })
    .from(blockedDates)
    .where(inArray(blockedDates.room, rooms));

  // Fetch dates occupied by confirmed bookings for requested rooms
  const bookedRooms = await db
    .select({
      checkIn: bookings.checkIn,
      checkOut: bookings.checkOut,
    })
    .from(bookingRooms)
    .innerJoin(bookings, eq(bookingRooms.bookingId, bookings.id))
    .where(
      and(
        inArray(bookingRooms.room, rooms),
        inArray(bookings.status, ["pending", "confirmed"])
      )
    );

  // Expand booking ranges into individual blocked dates
  const bookedDates: string[] = [];
  for (const { checkIn, checkOut } of bookedRooms) {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const current = new Date(start);
    while (current < end) {
      bookedDates.push(current.toISOString().split("T")[0]);
      current.setDate(current.getDate() + 1);
    }
  }

  const allBlocked = [
    ...manuallyBlocked.map((r) => r.date),
    ...bookedDates,
  ];

  return NextResponse.json({ blocked: [...new Set(allBlocked)] });
}
