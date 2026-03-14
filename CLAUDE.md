# CLAUDE.md — Il Casino Casalino B&B Website

## Project Overview
Premium single-page scrolling B&B website for **Il Casino Casalino** in Francavilla Fontana, Italy.

- **Framework:** Next.js 15 + TypeScript + Tailwind CSS v4 + App Router
- **Database:** Neon (serverless Postgres) via Drizzle ORM
- **Payments:** PayPal (sandbox → production)
- **i18n:** Custom React context, Italian (default) + English
- **Deployment:** Vercel — no separate backend server

---

## Rooms
The four rooms are always referenced with these exact names:
- **Mirtillo**
- **Limone**
- **Oria**
- **Francavilla**

Max 2 guests per room. Minimum stay 3 nights.

---

## Booking Rules
- Minimum stay: `NEXT_PUBLIC_BOOKING_MIN_NIGHTS` (3)
- Max guests per room: `NEXT_PUBLIC_MAX_GUESTS_PER_ROOM` (2)
- Optional breakfast: `NEXT_PUBLIC_BREAKFAST_PRICE_PER_PERSON_PER_NIGHT` (€6/person/night)
- A booking supports **one or more rooms** — use the `bookings` + `booking_rooms` join table pattern

---

## Environment Variable Rules

### Server-only (never expose to browser)
- `DATABASE_URL` — canonical Neon database URL, always use this name
- `PAYPAL_CLIENT_SECRET`
- `ICAL_MIRTILLO_IMPORT_URL`
- `ICAL_LIMONE_IMPORT_URL`
- `ICAL_ORIA_IMPORT_URL`
- `ICAL_FRANCAVILLA_IMPORT_URL`
- `ICAL_EXPORT_SECRET`

### Browser-safe (`NEXT_PUBLIC_*`)
- `NEXT_PUBLIC_PAYPAL_CLIENT_ID`
- `NEXT_PUBLIC_PAYPAL_CURRENCY`
- `NEXT_PUBLIC_BUSINESS_EMAIL`
- `NEXT_PUBLIC_BUSINESS_PHONE`
- `NEXT_PUBLIC_BUSINESS_ADDRESS`
- `NEXT_PUBLIC_BOOKING_MIN_NIGHTS`
- `NEXT_PUBLIC_BREAKFAST_PRICE_PER_PERSON_PER_NIGHT`
- `NEXT_PUBLIC_MAX_GUESTS_PER_ROOM`
- `NEXT_PUBLIC_SITE_NAME`
- `NEXT_PUBLIC_DEFAULT_LOCALE`
- `NEXT_PUBLIC_BASE_URL`

Never access server-only vars in client components or pass them to the browser.

---

## Folder Structure
```
src/
├── app/
│   ├── layout.tsx          # root layout, fonts, metadata
│   ├── page.tsx            # single page — all sections
│   ├── globals.css
│   └── api/
│       ├── availability/route.ts
│       ├── bookings/route.ts
│       ├── paypal/create-order/route.ts
│       ├── paypal/capture-order/route.ts
│       └── ical/
│           ├── export/[room]/route.ts
│           └── sync/route.ts
├── components/
│   ├── layout/             # Navbar, MobileMenu, Footer
│   ├── sections/           # one file per page section
│   ├── booking/            # booking flow sub-components
│   └── ui/                 # small reusable primitives
├── context/
│   └── LanguageContext.tsx
├── translations/
│   ├── it.ts
│   └── en.ts
├── lib/
│   ├── db.ts               # Neon + Drizzle client
│   ├── schema.ts           # Drizzle table definitions
│   ├── paypal.ts
│   ├── ical.ts
│   └── pricing.ts
└── types/
    ├── booking.ts
    └── room.ts
```

---

## Architecture Decisions
- **No separate backend** — all server logic lives in Next.js API routes (`app/api/`)
- **Drizzle ORM** — edge-compatible, works with Neon serverless driver
- **react-day-picker v9** — for date range selection with blocked dates
- **ical.js** — for iCal import/export (Airbnb / Booking.com cross-sync)
- **Custom i18n** — lightweight React context, no next-intl router complexity on a single-page site
- **`next/font`** — Cormorant Garamond (headings) + Inter (body)

---

## Design Language
- **Palette:** off-white `#FAFAF8`, warm charcoal `#2B2B2B`, stone/taupe `#9C8F82`
- **Typography:** Cormorant Garamond for headings (light serif), Inter for body
- **Nav:** Fixed, dark bar, all-caps letter-spaced items — hamburger on mobile
- **Style:** Premium minimal Italian aesthetic — generous whitespace, full-width imagery

---

## Coding Conventions
- All components are named exports, not default exports (except page/layout)
- Client components get `"use client"` at the top
- Server components are the default — don't add `"use client"` unless needed
- Tailwind only — no inline `style` props or CSS modules
- Keep API routes thin — business logic lives in `src/lib/`
- Do not add comments to self-evident code
- Do not add extra error handling for impossible states

---

## Git / Deployment
- **Remote:** https://github.com/Alex90Jennings/casalino
- **Deploy target:** Vercel
- **Secrets:** Never commit `.env` — always use `.env.example` for placeholders
- **`docs/` folder** is gitignored — design refs stay local only
