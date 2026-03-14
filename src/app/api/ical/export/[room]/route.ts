import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { bookings, bookingRooms } from "@/lib/schema";
import { eq, and, inArray } from "drizzle-orm";
import { generateICal } from "@/lib/ical";
import { ROOMS, type Room } from "@/types/room";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ room: string }> }
) {
  const { room: roomParam } = await params;

  // Auth via secret query param
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== process.env.ICAL_EXPORT_SECRET) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const room = ROOMS.find(
    (r) => r.toLowerCase() === roomParam.toLowerCase()
  ) as Room | undefined;

  if (!room) {
    return new NextResponse("Room not found", { status: 404 });
  }

  const confirmedBookings = await db
    .select({
      id: bookings.id,
      checkIn: bookings.checkIn,
      checkOut: bookings.checkOut,
      guestName: bookings.guestName,
    })
    .from(bookingRooms)
    .innerJoin(bookings, eq(bookingRooms.bookingId, bookings.id))
    .where(
      and(
        eq(bookingRooms.room, room),
        inArray(bookings.status, ["confirmed"])
      )
    );

  const events = confirmedBookings.map((b) => ({
    uid: `${b.id}@casalino`,
    summary: "Prenotato",
    dtstart: b.checkIn,
    dtend: b.checkOut,
  }));

  const ics = generateICal(room, events);

  return new NextResponse(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${room.toLowerCase()}.ics"`,
    },
  });
}
