# Build Plan

## Core Principle

Content-driven pages built on a Payload schema first, then wired to bilingual client views, then booking
and invite flows layered on top. Every activity's data is editable in the admin before the public page
that renders it is considered done. UI is dark + racing-yellow, styled with inline tokens.

This plan reflects how the app is structured and built. Most of it is **already implemented** (see
`progress-tracker.md`); the later items describe the intended shape of remaining/likely work.

---

## Phase 1 — Foundation ✅

### 01 Payload + Next.js scaffold
- Single `web-app/` app: `(frontend)` public site, `(payload)` admin/API, SQLite adapter, `withPayload`
  in `next.config.mjs`, `@/*` + `@payload-config` path aliases.
- `getPayloadClient()` local-API helper (`lib/payload.ts`).

### 02 Design system
- `lib/styles.ts` tokens (`C`, `cond`, `body`, `clipL`, `dashRule`, `stripes`); Barlow/Barlow Condensed via
  `globals.css` `@import`. Inline-style convention (no Tailwind).

### 03 Bilingual layer
- `lib/lang.tsx`: `LangProvider`, `useLang`, `useT`; default PT, persisted to `localStorage` `kv_lang`.

### 04 Content schema
- Collections: `Activities`, `Karts`, `PricingTiers`, `Packages` (+ `Extras`), `GameModes`, `Media`,
  `Users`. Global: `SiteSettings`. Bilingual `field`/`fieldEn` convention. Access: public read, staff write.
- Idempotent `seed.ts` in `onInit`.

---

## Phase 2 — Public Site ✅

### 05 App shell
- `AppShell` (LangProvider → BookingProvider → Header → main → Footer). Frontend layout fetches
  `site-settings` and passes it down.

### 06 Header / Footer / Hero / ui primitives
- Sticky header with nav, PT/EN toggle, RESERVAR CTA, and `BookButton`. Footer from `site-settings`.
  `SectionTitle`, `Eyebrow`, `PriceRow` in `ui.tsx`.

### 07 Activity pages (server → view)
- `/` (HomeView), `/karting` (KartingView), `/lasergame` (LaserView), `/grupos` (GruposView),
  `/aniversarios` (AniversariosView). Each: server page fetches Payload docs → client view renders +
  `useT`. All `dynamic = 'force-dynamic'`.

---

## Phase 3 — Booking ✅

### 08 Booking modal
- `BookingProvider` modal (`lib/booking.tsx`): activity/date/time/people/contact, live WhatsApp preview.
- Submit `POST /api/bookings` (public create) + open `wa.me`. `Bookings` collection with `status` triage
  in the admin. No online payment.

---

## Phase 4 — Deploy hardening ✅

### 09 Migrations on deploy
- Committed migrations in `src/migrations/`; `npm start` runs `payload migrate` before `next start` so an
  empty production DB gets its schema and seed. Fixed REST options for the Payload/Next version.

---

## Phase 5 — Digital Birthday Invite ✅

### 10 Invites collection + generated share id
- `Invites` collection: auto-generated unguessable `slug` (base62, read-only), `childName`, `age`,
  `eventDate`, `dateText(+En)`, `timeText`, `packText(+En)`, `hostPhone`. Public read.

### 11 Standalone invite route
- `(invite)` group: own layout (globals + LangProvider, no header/footer), `convite/[id]/page.tsx`
  (fetch by slug, `notFound()` fallback), `InviteView` (track-pass card, live countdown, WhatsApp RSVP,
  `tel:` fallback), on-brand `not-found.tsx`.

### 12 Admin share URL
- Custom `ShareUrlField` admin component renders the full copy-ready `/convite/{slug}` link; import map
  regenerated.

---

## Phase 6 — Public Track Records ✅

### 14 Standings page (`/recordes`)
- `LapRecords` collection (driverName, timeMs, kartClass, category, laps, recordedAt) — public read,
  designed so the portal's `driver` relationship attaches later without a breaking change.
- Server page computes Year/Month/Week windows relative to now + best lap per driver; `RecordsView`
  re-ranks by period × segment client-side (pure helpers in `lib/records.ts`). Podium + leaderboard +
  yellow CTA to the (future) portal register route. Header nav link added.

## Phase 7 — Likely Next Work (not yet built)

Shape only — confirm scope before building:

- **Driver portal** (`design/design_handoff_portal`) — Payload auth `Drivers` collection (separate
  from admin `Users`), login/register pages, gated portal routes, per-driver dashboard. Adds the
  `driver` relationship to `LapRecords`. Needs an email adapter for forgot-password/notifications.

- **Booking management** — richer admin views/filters for `bookings`; optional email/WhatsApp confirmation
  to staff.
- **Invite generation from the booking flow** — let a birthday booking spawn its `Invites` record and
  surface the share link automatically.
- **Media-backed imagery** — migrate `*ImageUrl` string fallbacks to uploaded `Media` where useful.
- **Content polish** — richer activity intros (Lexical), gallery, FAQ.
- **SEO / metadata** — per-page metadata, Open Graph for invites.

When picking up new work, add the item here and to `progress-tracker.md`, and follow `code-standards.md`
(bilingual fields, access control, a committed migration for any schema change).
