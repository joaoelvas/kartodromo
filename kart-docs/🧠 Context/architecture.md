# Architecture

## Stack

| Layer            | Tool                                   | Notes                                             |
| ---------------- | -------------------------------------- | ------------------------------------------------- |
| Framework        | Next.js 16 (App Router, Turbopack)     | Public site + admin + API in one app              |
| Runtime          | React 19.2                             | Server Components by default                      |
| CMS / backend    | Payload CMS 3.37                        | Admin UI, REST + GraphQL API, local (Node) API    |
| Database         | SQLite via `@payloadcms/db-sqlite` (libSQL) | File `web-app/kartodromo.db` in dev           |
| Rich text        | `@payloadcms/richtext-lexical`         | Payload editor (config default)                   |
| Images           | `sharp` + Payload `upload` (Media)     | Generates thumbnail/card/hero sizes               |
| Styling          | **Inline styles + shared design tokens** | No Tailwind, no CSS modules. See ui-tokens.md   |
| Fonts            | Barlow + Barlow Condensed              | Google Fonts `@import` in `globals.css`           |
| Language         | TypeScript                             | `@/*` alias → `src/*`; `@payload-config`          |

There is **no separate backend service, no external AI, no analytics**. Everything runs inside the
single Next.js app in `web-app/`.

---

## Folder Structure (`web-app/`)

```
web-app/
├── next.config.mjs                 → withPayload(); turbopack.root pinned to web-app; image remotePatterns
├── package.json                    → scripts: dev, build, start (runs `payload migrate` first), generate:types, payload
├── kartodromo.db                   → dev SQLite database (gitignored)
├── src/
│   ├── payload.config.ts           → buildConfig: collections, globals, sqlite adapter, admin.importMap.baseDir, onInit seed
│   ├── payload-types.ts            → GENERATED — never edit by hand (npm run generate:types)
│   ├── seed.ts                     → idempotent content seed (runs in onInit) + seedDemoInvite
│   ├── lib/
│   │   ├── payload.ts              → getPayloadClient() — cached Payload local API for Server Components
│   │   ├── lang.tsx                → LangProvider, useLang(), useT() — PT/EN, persisted to localStorage 'kv_lang'
│   │   ├── styles.ts               → design tokens: C (colors), cond/body (fonts), clipL, dashRule, stripes
│   │   └── booking.tsx             → BookingProvider + useBooking() — WhatsApp booking modal, Settings type
│   ├── collections/                → Payload collections (one file each; Packages.ts exports Packages + Extras)
│   │   ├── Activities.ts  Karts.ts  PricingTiers.ts  Packages.ts  GameModes.ts
│   │   ├── Bookings.ts  Invites.ts  Media.ts  Users.ts
│   ├── globals/
│   │   └── SiteSettings.ts         → contact info, hours (pt/en), social links
│   ├── components/
│   │   └── admin/ShareUrlField.tsx → custom Payload admin field (copy-ready invite URL)
│   └── app/
│       ├── (frontend)/             → public bilingual site
│       │   ├── layout.tsx          → <html lang="pt">, imports globals.css, fetches site-settings, wraps AppShell
│       │   ├── globals.css         → font @import, resets, flagpulse keyframe
│       │   ├── page.tsx            → Homepage (server) → HomeView
│       │   ├── karting|lasergame|grupos|aniversarios|recordes/page.tsx → server pages → *View
│       │   ├── components/         → AppShell, Header (+ BookButton), Footer, Hero, ui.tsx
│       │   └── views/              → HomeView, KartingView, LaserView, GruposView, AniversariosView, RecordsView (client)
│       ├── (invite)/               → standalone invite (NO site header/footer)
│       │   ├── layout.tsx          → <html>, globals.css, LangProvider only
│       │   ├── convite/[id]/page.tsx → server: fetch invite by slug, notFound() if missing
│       │   ├── InviteView.tsx      → 'use client' — the track-pass card + countdown + RSVP
│       │   └── not-found.tsx       → on-brand 404
│       └── (payload)/              → Payload admin + API (mostly generated)
│           ├── layout.tsx  custom.scss  admin/importMap.js
│           ├── admin/[[...segments]]/page.tsx
│           └── api/[...slug]/route.ts  api/graphql/route.ts  api/graphql-playground/route.ts
└── src/migrations/                 → committed SQLite migrations + index.ts (run on deploy)
```

---

## System Boundaries

| Location                     | Owns                                                                              |
| ---------------------------- | --------------------------------------------------------------------------------- |
| `app/(frontend)/*/page.tsx`  | Server Components: data fetching via `getPayloadClient()` only. No business logic. |
| `app/(frontend)/views/*`     | Client "View" components: presentation + `useT()`. No direct DB access.           |
| `app/(frontend)/components/*`| Shared UI (Header, Footer, Hero, ui primitives, BookButton).                      |
| `app/(invite)/*`             | The standalone invite; its own layout/provider, no site chrome.                   |
| `collections/`, `globals/`   | Payload schema: fields, access control, admin config. Source of truth for data.   |
| `lib/`                       | Cross-cutting singletons/helpers: Payload client, i18n, tokens, booking modal.    |
| `components/admin/`          | Custom Payload admin field/UI components (registered in the import map).          |
| `src/migrations/`            | DB schema migrations. Generated from collections, committed, run on deploy.       |

---

## Data Flow

### Reads (public pages)

```
Route Server Component (export const dynamic = 'force-dynamic')
        ↓  getPayloadClient()  →  payload.find({ collection, sort, limit, where })
Payload local API (in-process, no HTTP)  →  SQLite
        ↓  docs passed as props
Client View component  →  renders + useT(pt, en) for language
```

Example (`src/app/(frontend)/aniversarios/page.tsx`):

```ts
const payload = await getPayloadClient()
const [packages, extras] = await Promise.all([
  payload.find({ collection: 'packages', sort: 'order', limit: 20 }),
  payload.find({ collection: 'extras', sort: 'order', limit: 50 }),
])
return <AniversariosView packages={packages.docs} extras={extras.docs} />
```

The frontend layout fetches the global once: `payload.findGlobal({ slug: 'site-settings' })`.

### Booking (write)

```
BookButton / header CTA  →  useBooking().open()
        ↓
BookingProvider modal (src/lib/booking.tsx) collects activity/date/time/people/name/phone
        ↓  on submit
fetch('POST /api/bookings', json)   →  Payload REST, public create → bookings row (status 'new')
        ↓  and in parallel
window.open('https://wa.me/{whatsapp}?text=' + encodeURIComponent(message))
```

### Invite (read)

```
/convite/[id]  →  payload.find({ collection: 'invites', where: { slug: { equals: id } }, limit: 1 })
        ↓  notFound() if none
InviteView (client)  →  countdown (setInterval) + RSVP wa.me link to hostPhone
```

---

## Payload Data Model

Collections are registered in `src/payload.config.ts`. Bilingual fields use the `field` / `fieldEn`
convention. Types are generated into `src/payload-types.ts` (`npm run generate:types`).

### Content collections (public read, staff write)

| Collection      | Slug            | Key fields                                                                                          |
| --------------- | --------------- | --------------------------------------------------------------------------------------------------- |
| Activities      | `activities`    | title, slug (unique), order, eyebrow(+En), tagline(+En), intro(+En), priceFrom, cardImage/cardImageUrl, heroImage/heroImageUrl, showOnHome |
| Karts           | `karts`         | name, cc, model, fleet ('races' \| 'experiences'), lowSeason, order, image/imageUrl                 |
| PricingTiers    | `pricing-tiers` | label(+En), activity ('karting' \| 'group-races' \| 'lasergame'), duration, price, note, order      |
| Packages        | `packages`      | name, price, highlight, note(+En), order, features[] { text, textEn }                               |
| Extras          | `extras`        | label(+En), price, order                                                                            |
| GameModes       | `game-modes`    | name, level ('beginner' \| 'advanced'), description(+En), order                                     |
| LapRecords      | `lap-records`   | driverName, timeMs (ms), kartClass ('270' \| '390'), category ('adult' \| 'junior'), laps, recordedAt (date), order. Future: optional `driver` relationship (added with the portal). |

### Operational collections

| Collection | Slug       | Access                                   | Key fields                                                                 |
| ---------- | ---------- | ---------------------------------------- | ------------------------------------------------------------------------- |
| Bookings   | `bookings` | create: public · read/update/delete: staff | name, phone, email, activity, date, time, people, message, status         |
| Invites    | `invites`  | read: public · create/update/delete: staff | slug (auto-generated, unique, readOnly), childName, age, eventDate, dateText(+En), timeText, packText(+En), hostPhone, shareUrl (ui) |
| Media      | `media`    | read: public                             | alt; upload sizes thumbnail 400×300, card 768×576, hero 1600×auto          |
| Users      | `users`    | Payload auth                             | email (title), name; `auth: true`                                         |

### Global

| Global        | Slug            | Fields                                                                        |
| ------------- | --------------- | ----------------------------------------------------------------------------- |
| SiteSettings  | `site-settings` | phone, whatsapp (digits), email, address, hours(+En), social{facebook,instagram,youtube} |

Admin groups: content collections + SiteSettings under **Conteúdo/Reservas**; Bookings & Invites under
**Reservas**; Media & Users under **Admin**.

---

## Database, Migrations & Seed

- Dev DB is SQLite at `web-app/kartodromo.db` (gitignored). Configured in `payload.config.ts` via
  `DATABASE_URI` (default `file:./kartodromo.db`).
- **Dev** uses Payload's auto schema push (no migration needed while iterating).
- **Deploy**: `npm start` runs `payload migrate` **before** `next start`. So any new/changed collection
  needs a committed migration: `npm run payload migrate:create <name>`, then commit the generated files
  under `src/migrations/` (and the updated `index.ts`).
- **Seed** (`src/seed.ts`) runs in `payload.config.ts` `onInit`. It is idempotent: the main content seed
  only runs when `activities` is empty; `seedDemoInvite()` runs every boot and creates the demo invite
  only if one for "Martim" doesn't exist (it logs the generated `/convite/{slug}`).

---

## Authentication

- Only the Payload admin (`/admin`) is authenticated — `Users` collection, email + password.
- No public auth. Public site pages and the invite are open.
- Access control lives on each collection: content is `read: () => true`; writes are gated on
  `req.user`. Bookings allow public `create`. Invites allow public `read`.

---

## Key Patterns

### Payload local API client (`src/lib/payload.ts`)

```ts
import { getPayload } from 'payload'
import config from '@payload-config'
export const getPayloadClient = async () => getPayload({ config })
```

Use in Server Components / route handlers only. Never call Payload from a client component — pass fetched
docs down as props.

### Custom admin component + import map

Custom admin components (e.g. `src/components/admin/ShareUrlField.tsx`) are referenced from a field as
`components: { Field: '/components/admin/ShareUrlField#ShareUrlField' }`. Paths resolve relative to
`admin.importMap.baseDir` (set to `src` in `payload.config.ts`). After adding/changing one, run
`npm run payload generate:importmap` to update `src/app/(payload)/admin/importMap.js`.

---

## Invariants

Rules the AI agent must never violate:

- **Never edit `src/payload-types.ts` by hand** — regenerate with `npm run generate:types`.
- Client components never import Payload or call `getPayloadClient()` — fetch in the Server Component and
  pass props down.
- All user-facing copy is bilingual via `useT(pt, en)` or stored `field`/`fieldEn` pairs — never hardcode
  a single-language string in the UI.
- No Tailwind, no CSS modules, no new styling system — inline styles using tokens from `src/lib/styles.ts`.
- Public reads stay open (`read: () => true`); all writes stay gated on `req.user`. Bookings keep public
  `create`; Invites keep public `read`.
- Any schema change to a collection/global requires a committed migration under `src/migrations/`
  (`payload migrate:create`), or deploy will run against an out-of-date schema.
- The invite `slug` is auto-generated and `readOnly` — never require the user to type it; never make it a
  human-readable name (it is the unguessable share id).
- The `/convite/[id]` route stays in the `(invite)` group with no site header/footer.
- WhatsApp numbers are digits only — always `.replace(/\D/g, '')` before building a `wa.me` URL.
- Every public page keeps `export const dynamic = 'force-dynamic'` (content is CMS-driven).
- After adding/altering a custom admin component, regenerate the import map.
