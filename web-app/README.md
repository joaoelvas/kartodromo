# Kartódromo Vila Real — Next.js 16 + Payload CMS

A rebuild of kartodromovilareal.com: responsive, mobile-first, PT/EN, with a Payload CMS
so staff can edit activities, prices, fleet, packages, game modes, opening hours and read
booking requests — no code needed.

- **Frontend:** Next.js 16 App Router (`src/app/(frontend)`), the "racing-bold" yellow/black design.
- **CMS / Admin:** Payload 3 mounted inside the same Next app (`src/app/(payload)` → `/admin`).
- **Database:** SQLite by default — zero external services. Swap to Postgres/Mongo later if you want.
- **Bookings:** the site's "Reservar" flow saves a `bookings` record **and** opens a pre-filled
  WhatsApp message to the number in Site Settings.

---

## Requirements

- Node.js **20.9+** (or 18.20.2+)
- npm (or pnpm/yarn)

## Run it

```bash
cd kartodromo-app

# 1. install
npm install

# 2. environment
cp .env.example .env
#   then edit .env and set PAYLOAD_SECRET to a long random string:
#   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 3. start
npm run dev
```

Open **http://localhost:3000** — the public site.
Open **http://localhost:3000/admin** — the CMS. On first load it asks you to create the
first admin user, then you're in.

On the very first boot the database is **auto-seeded** with all the real activities, karts,
2026 prices, LaserGame modes, birthday packs and extras, so nothing is blank. The seed only
runs while the DB is empty — delete `kartodromo.db*` to reseed from scratch.

## What editors can manage (in `/admin`)

| Collection / Global | Controls |
|---|---|
| **Atividades** | Home cards + page heroes (Karting, LaserGame, Aniversários, Grupos), PT/EN copy |
| **Karts** | The fleet grid on the Karting page (cc, model, image, low-season flag) |
| **Pricing Tiers** | Every price row (karting individual, group races, LaserGame) |
| **Packages / Extras** | Birthday packs (Pack 1 / Pack 2) and the à-la-carte extras list |
| **Game Modes** | LaserGame modes, split beginner / advanced |
| **Bookings** | Incoming reservation requests with a status workflow |
| **Site Settings** | Phone, WhatsApp number, email, address, hours, social links |

## Project layout

```
src/
  payload.config.ts          Payload config (collections, sqlite, seed on init)
  seed.ts                    First-run content seed
  collections/               Activities, Karts, PricingTiers, Packages, GameModes, Bookings, Media, Users
  globals/SiteSettings.ts
  lib/                       payload client, styles, language + booking context
  app/
    (payload)/               Admin UI + REST/GraphQL API (Payload-owned routes)
    (frontend)/              Public site — layout, pages, views, components
```

## Language toggle

PT is default; the header PT/EN switch stores the choice in `localStorage`. All CMS text
fields have a matching `...En` field — fill those in to translate content.

## Switching the database (optional)

SQLite is the zero-setup default. To use Postgres instead:

```bash
npm install @payloadcms/db-postgres
```

Then in `src/payload.config.ts` replace the `sqliteAdapter({...})` block with
`postgresAdapter({ pool: { connectionString: process.env.DATABASE_URI } })` and point
`DATABASE_URI` at your Postgres instance.

## Generate TypeScript types (optional)

```bash
npm run generate:types
```

Regenerates `src/payload-types.ts` from your collections so you can replace the `any[]`
props in the view components with fully-typed data.

---

### Notes

- Product images currently load from the live kartodromovilareal.com URLs (set in the seed).
  Upload your own via the **Media** collection and attach them on each item to self-host.
- This was scaffolded against Next 16 / Payload 3.37. Both move quickly — if `npm install`
  resolves newer minors and something drifts, `npx create-payload-app@latest` in a scratch
  folder shows the current admin/route boilerplate to diff against `src/app/(payload)`.
