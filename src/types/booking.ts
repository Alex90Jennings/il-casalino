import type { Room } from "./room";

export interface BookingFormData {
  rooms: Room[];
  checkIn: Date;
  checkOut: Date;
  guests: number;
  breakfast: boolean;
  guestName: string;
  guestEmail: string;
  notes?: string;
}

export interface PriceSummary {
  nights: number;
  roomCount: number;
  guests: number;
  breakfast: boolean;
  breakfastTotal: number;
  roomTotal: number;
  total: number;
}

export interface BookingRecord {
  id: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  breakfast: boolean;
  totalPrice: string;
  paypalOrderId: string | null;
  status: "pending" | "confirmed" | "cancelled";
  guestName: string;
  guestEmail: string;
  notes: string | null;
  createdAt: string;
  rooms: Room[];
}
