# Project Overview

## About the Project

**Kartódromo Vila Real** is a bilingual (Portuguese / English) marketing and booking website for a real
karting venue at the Aeródromo Oeste in Vila Real, Portugal. The public site presents the venue's four
activities — **Karting**, **LaserGame**, **Group events (Grupos)**, and **Birthday parties
(Aniversários)** — with pricing, fleet/kart info, game modes, and party packs. Visitors request a
booking through an on-site modal that **pre-fills a WhatsApp message** and simultaneously saves the
request to the CMS. There is **no online payment** — every booking is confirmed by message.

All site content (activities, prices, karts, game modes, packs, extras, contact details) is editable by
staff in the **Payload CMS admin** at `/admin`. The site also generates shareable **digital birthday
invites** ("track pass") at `/convite/{id}`.

The app is a single Next.js project in `web-app/` combining the public site, the Payload admin, and the
Payload REST/GraphQL API.

---

## The Problem It Solves

The venue needs a fast, self-serve, bilingual storefront where visitors can understand each activity and
its price and start a booking in seconds — without a payment gateway or account. Staff need to edit all
prices and content themselves without a developer, and manage incoming booking requests in one place.
Parents booking birthday parties need a polished, shareable invite they can send to guests.

---

## Pages (routes)

```
/                     → Homepage (activities grid + karting pricing)         (frontend)
/karting              → Karting: pricing, fleet                              (frontend)
/lasergame            → LaserGame: pricing, game modes                       (frontend)
/grupos               → Group events pricing + info                          (frontend)
/aniversarios         → Birthday packs + à-la-carte extras                   (frontend)
/recordes             → Public track records / standings (period × class)   (frontend)
/convite/[id]         → Standalone shareable birthday invite ("track pass")  (invite)
/admin                → Payload CMS admin (staff only)                       (payload)
/api/*                → Payload REST API   ·  /api/graphql                   (payload)
```

There is **no public login**. The only authentication is for staff in the Payload admin.

---

## Navigation

Sticky top header (`src/app/(frontend)/components/Header.tsx`), full width, dark. Logo on the left,
five nav links (KARTING · LASERGAME · GRUPOS · ANIVERSÁRIOS · RECORDES), then on the right a **PT/EN toggle** and a
yellow **RESERVAR / BOOK NOW** button that opens the booking modal. No sidebar.

The `/convite/[id]` invite is **standalone** — it deliberately has no site header/footer, only its own
PT/EN toggle.

---

## Core Flows

### Browsing (public)

- Server Components fetch content from Payload via the local API (`getPayloadClient()`), pass it to
  client "View" components under `src/app/(frontend)/views/` which render it and translate copy live via
  the `useT()` hook. Every page is `export const dynamic = 'force-dynamic'`.

### Booking (public)

- The yellow **RESERVAR** button (header) or a **BookButton** on any page calls `useBooking().open()`.
- A modal (`src/lib/booking.tsx`, `BookingProvider`) collects: activity, date, time, headcount, name,
  optional phone. It shows a live preview of the WhatsApp message.
- On submit it `POST`s the request to `/api/bookings` (Payload REST, public create) **and** opens
  `https://wa.me/{whatsapp}?text=…` in a new tab. No payment.

### Content management (staff)

- Staff log in at `/admin` (Payload, email + password) and edit all collections/globals. Public reads
  are open; writes require a logged-in user.

### Birthday invite (shareable)

- Staff create an `Invites` record in the admin. The `slug` is an **auto-generated, unguessable id**
  (base62) that drives the URL `/convite/{slug}`. A custom admin field renders the full copy-ready link.
- Guests open the link: a VIP "track pass" card with a **live countdown** to the party and an RSVP CTA
  that opens WhatsApp to the host's number. Fully bilingual with its own PT/EN toggle.

---

## Bilingual (PT / EN)

- Default language is **Portuguese**. A single `useT(pt, en)` helper (`src/lib/lang.tsx`) returns the
  active string; language is toggled in the UI and persisted to `localStorage` (`kv_lang`).
- CMS content stores both languages side by side using the `field` / `fieldEn` convention (e.g.
  `label` + `labelEn`, `intro` + `introEn`).

---

## Features In Scope

- Bilingual public site with sticky header, activity pages, and footer
- Homepage activities grid + karting price table
- Karting (pricing + kart fleet), LaserGame (pricing + game modes), Grupos (group-race pricing),
  Aniversários (packs + extras)
- WhatsApp booking modal that also persists the request to Payload (`bookings`)
- Payload CMS admin for all content, with public read / staff-only write
- Digital birthday invites at `/convite/[id]` with live countdown, WhatsApp RSVP, generated share id,
  and a copy-ready share URL in the admin
- Content seeded on first boot; SQLite with committed migrations run on deploy

## Features Out of Scope

- Online payment / checkout
- Public user accounts or login (only staff admin auth)
- Real-time availability / calendar integration
- Email or push notifications
- Multi-venue / franchising
- A separate mobile app

---

## Target Users

- **Visitors** — people in the Vila Real area looking to book karting, LaserGame, a group event, or a
  child's birthday party. Mobile-first, bilingual (many EN-speaking tourists).
- **Staff / editors** — venue employees who edit prices and content and triage booking requests in the
  Payload admin.
- **Party guests** — recipients of a shared birthday invite link.

---

## Success Criteria

- Every activity's pricing and content is editable in `/admin` with no code changes
- A visitor can open the booking modal and send a pre-filled WhatsApp message in a few taps
- Booking requests appear in the `bookings` collection with status tracking
- `/convite/{id}` matches the design handoff and counts down correctly, in both languages
- The site builds and deploys with an empty DB (migrations + seed run on start)
- UI is visually consistent (dark + racing-yellow) across all pages and both languages
