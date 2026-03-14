/**
 * iCal integration helpers.
 *
 * Import: pull .ics from Airbnb / Booking.com and upsert blocked_dates.
 * Export: generate .ics for each room so external calendars can subscribe.
 *
 * The import URLs are server-only env vars (ICAL_*_IMPORT_URL).
 * The export endpoints are protected by ICAL_EXPORT_SECRET.
 */

import ICAL from "ical.js";
import { db } from "./db";
import { blockedDates, roomEnum } from "./schema";
import { eq, and } from "drizzle-orm";
import type { Room } from "@/types/room";

export const ROOM_ICAL_ENV: Record<Room, string> = {
  Mirtillo: process.env.ICAL_MIRTILLO_IMPORT_URL ?? "",
  Limone: process.env.ICAL_LIMONE_IMPORT_URL ?? "",
  Oria: process.env.ICAL_ORIA_IMPORT_URL ?? "",
  Francavilla: process.env.ICAL_FRANCAVILLA_IMPORT_URL ?? "",
};

/**
 * Fetch and parse an .ics URL, return array of blocked date strings (YYYY-MM-DD).
 */
export async function fetchBlockedDatesFromICal(
  url: string
): Promise<{ date: string; uid: string }[]> {
  const res = await fetch(url, { next: { revalidate: 3600 } });
  const text = await res.text();
  const jcal = ICAL.parse(text);
  const comp = new ICAL.Component(jcal);
  const events = comp.getAllSubcomponents("vevent");

  const result: { date: string; uid: string }[] = [];

  for (const event of events) {
    const uid = (event.getFirstPropertyValue("uid") as string) ?? "";
    const dtstart = event.getFirstPropertyValue("dtstart") as ICAL.Time | null;
    const dtend = event.getFirstPropertyValue("dtend") as ICAL.Time | null;
    if (!dtstart || !dtend) continue;

    const start = dtstart.toJSDate();
    const end = dtend.toJSDate();
    const current = new Date(start);

    while (current < end) {
      result.push({ date: current.toISOString().split("T")[0], uid });
      current.setDate(current.getDate() + 1);
    }
  }

  return result;
}

/**
 * Sync blocked dates for a single room from its configured iCal URL.
 */
export async function syncRoomICal(room: Room): Promise<number> {
  const url = ROOM_ICAL_ENV[room];
  if (!url) return 0;

  const dates = await fetchBlockedDatesFromICal(url);

  // Delete existing ical_import entries for this room
  await db
    .delete(blockedDates)
    .where(
      and(
        eq(blockedDates.room, room),
        eq(blockedDates.source, "ical_import")
      )
    );

  if (dates.length === 0) return 0;

  await db.insert(blockedDates).values(
    dates.map(({ date, uid }) => ({
      room,
      date,
      source: "ical_import" as const,
      externalUid: uid,
    }))
  );

  return dates.length;
}

/**
 * Generate a minimal .ics string for a room based on confirmed bookings.
 */
export function generateICal(
  room: Room,
  bookingEvents: { uid: string; summary: string; dtstart: string; dtend: string }[]
): string {
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Il Casino Casalino//BnB//EN",
    `X-WR-CALNAME:Il Casino Casalino - ${room}`,
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
  ];

  for (const ev of bookingEvents) {
    lines.push(
      "BEGIN:VEVENT",
      `UID:${ev.uid}`,
      `SUMMARY:${ev.summary}`,
      `DTSTART;VALUE=DATE:${ev.dtstart.replace(/-/g, "")}`,
      `DTEND;VALUE=DATE:${ev.dtend.replace(/-/g, "")}`,
      "END:VEVENT"
    );
  }

  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}
