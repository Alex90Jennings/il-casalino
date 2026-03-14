import { NextRequest, NextResponse } from "next/server";
import { createPayPalOrder } from "@/lib/paypal";

export async function POST(req: NextRequest) {
  const { amount } = await req.json();
  const orderId = await createPayPalOrder(Number(amount));
  return NextResponse.json({ orderId });
}
