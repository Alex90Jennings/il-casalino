import { NextRequest, NextResponse } from "next/server";
import { capturePayPalOrder } from "@/lib/paypal";
import type { BookingFormData } from "@/types/booking";
import { calculatePrice } from "@/lib/pricing";

interface CaptureBody {
  orderId: string;
  bookingData: BookingFormData & {
    checkIn: string;
    checkOut: string;
  };
}

export async function POST(req: NextRequest) {
  const { orderId, bookingData }: CaptureBody = await req.json();

  const { status, captureId } = await capturePayPalOrder(orderId);

  if (status !== "COMPLETED") {
    return NextResponse.json({ error: "Payment not completed" }, { status: 402 });
  }

  const pricing = calculatePrice({
    rooms: bookingData.rooms,
    checkIn: new Date(bookingData.checkIn),
    checkOut: new Date(bookingData.checkOut),
    guests: bookingData.guests,
    breakfast: bookingData.breakfast,
  });

  // Persist booking
  await fetch(new URL("/api/bookings", req.url).toString(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...bookingData,
      totalPrice: pricing.total,
      paypalOrderId: captureId,
    }),
  });

  return NextResponse.json({ success: true, captureId });
}
