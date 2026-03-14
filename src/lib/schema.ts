import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  numeric,
  date,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

export const roomEnum = pgEnum("room", [
  "Mirtillo",
  "Limone",
  "Oria",
  "Francavilla",
]);

export const bookingStatusEnum = pgEnum("booking_status", [
  "pending",
  "confirmed",
  "cancelled",
]);

export const blockedDateSourceEnum = pgEnum("blocked_date_source", [
  "manual",
  "ical_import",
]);

// ---------------------------------------------------------------------------
// bookings — one record per guest booking (may span multiple rooms)
// ---------------------------------------------------------------------------

export const bookings = pgTable("bookings", {
  id: uuid("id").primaryKey().defaultRandom(),
  checkIn: date("check_in").notNull(),
  checkOut: date("check_out").notNull(),
  guests: integer("guests").notNull(),
  breakfast: boolean("breakfast").notNull().default(false),
  totalPrice: numeric("total_price", { precision: 10, scale: 2 }).notNull(),
  paypalOrderId: text("paypal_order_id"),
  status: bookingStatusEnum("status").notNull().default("pending"),
  guestName: text("guest_name").notNull(),
  guestEmail: text("guest_email").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ---------------------------------------------------------------------------
// booking_rooms — join table: which rooms belong to a booking
// ---------------------------------------------------------------------------

export const bookingRooms = pgTable("booking_rooms", {
  id: uuid("id").primaryKey().defaultRandom(),
  bookingId: uuid("booking_id")
    .notNull()
    .references(() => bookings.id, { onDelete: "cascade" }),
  room: roomEnum("room").notNull(),
});

// ---------------------------------------------------------------------------
// blocked_dates — dates unavailable for a given room
// (populated via iCal import or manual admin block)
// ---------------------------------------------------------------------------

export const blockedDates = pgTable("blocked_dates", {
  id: uuid("id").primaryKey().defaultRandom(),
  room: roomEnum("room").notNull(),
  date: date("date").notNull(),
  source: blockedDateSourceEnum("source").notNull(),
  externalUid: text("external_uid"),
});

// ---------------------------------------------------------------------------
// Relations
// ---------------------------------------------------------------------------

export const bookingsRelations = relations(bookings, ({ many }) => ({
  rooms: many(bookingRooms),
}));

export const bookingRoomsRelations = relations(bookingRooms, ({ one }) => ({
  booking: one(bookings, {
    fields: [bookingRooms.bookingId],
    references: [bookings.id],
  }),
}));
