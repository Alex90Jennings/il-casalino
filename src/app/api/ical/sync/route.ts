import { NextRequest, NextResponse } from "next/server";
import { syncRoomICal } from "@/lib/ical";
import { ROOMS } from "@/types/room";

/**
 * POST /api/ical/sync
 * Trigger manually or via Vercel cron. Syncs all rooms.
 * Protected by ICAL_EXPORT_SECRET.
 */
export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-sync-secret");
  if (secret !== process.env.ICAL_EXPORT_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results: Record<string, number> = {};
  for (const room of ROOMS) {
    results[room] = await syncRoomICal(room);
  }

  return NextResponse.json({ synced: results });
}
