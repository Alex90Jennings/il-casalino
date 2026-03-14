import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { bookings, bookingRooms } from "@/lib/schema";
import type { Room } from "@/types/room";

interface CreateBookingBody {
  rooms: Room[];
  checkIn: string;
  checkOut: string;
  guests: number;
  breakfast: boolean;
  totalPrice: number;
  paypalOrderId: string;
  guestName: string;
  guestEmail: string;
  notes?: string;
}

export async function POST(req: NextRequest) {
  const body: CreateBookingBody = await req.json();

  const [booking] = await db
    .insert(bookings)
    .values({
      checkIn: body.checkIn,
      checkOut: body.checkOut,
      guests: body.guests,
      breakfast: body.breakfast,
      totalPrice: String(body.totalPrice),
      paypalOrderId: body.paypalOrderId,
      status: "confirmed",
      guestName: body.guestName,
      guestEmail: body.guestEmail,
      notes: body.notes ?? null,
    })
    .returning();

  await db.insert(bookingRooms).values(
    body.rooms.map((room) => ({ bookingId: booking.id, room }))
  );

  return NextResponse.json({ bookingId: booking.id }, { status: 201 });
}
