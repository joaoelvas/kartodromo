# Library Docs

Project-specific usage patterns for the libraries this codebase actually uses. This covers **how we use
each one in Kartódromo Vila Real** — not general tutorials. Read the relevant section before touching a
feature that uses it.

Order of authority: **official docs / MCP for the current version → this file (project rules) → general
knowledge.** Payload and Next.js APIs change between versions — verify against the installed versions
(`payload@^3.37`, `next@^16.2`) rather than trusting training data.

The whole stack is: **Next.js 16 · React 19 · Payload CMS 3.37 · SQLite (libSQL) · sharp**. There is no
AI, analytics, auth-provider, or PDF library in this project.

---

## Payload CMS (3.37)

### Local API in Server Components

`src/lib/payload.ts` exposes the in-process client — use it in Server Components and route handlers, never
in client components.

```ts
import { getPayload } from 'payload'
import config from '@payload-config'
export const getPayloadClient = async () => getPayload({ config })
```

```ts
// In a Server Component page
const payload = await getPayloadClient()
const { docs } = await payload.find({
  collection: 'pricing-tiers',
  where: { activity: { equals: 'karting' } },
  sort: 'order',
  limit: 20,
})
const settings = await payload.findGlobal({ slug: 'site-settings' })
```

**Rules:**
- Fetch in the Server Component, pass `docs` to a client View. Never `getPayloadClient()` in a
  `'use client'` file.
- Use `sort: 'order'` for ordered content; `where` filters use Payload's `{ field: { equals } }` syntax.
- `payload.create({ collection, data })` runs field hooks and access as the local API (used in `seed.ts`).

### Defining a collection

```ts
import type { CollectionConfig } from 'payload'

export const Thing: CollectionConfig = {
  slug: 'things',
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'order'], group: 'Conteúdo' },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'nameEn', type: 'text' },                 // bilingual: field + fieldEn
    { name: 'order', type: 'number', defaultValue: 0 },
  ],
}
```

Register in `src/payload.config.ts` (`collections[]`). Then `npm run generate:types` and
`npm run payload migrate:create <name>`.

### Field hooks (auto-generated values)

`Invites.slug` auto-fills an unguessable id before validation, and is read-only in the admin:

```ts
{
  name: 'slug', type: 'text', required: true, unique: true, index: true,
  admin: { readOnly: true, position: 'sidebar', description: 'Auto-generated id…' },
  hooks: { beforeValidate: [({ value }) => value || generateInviteId()] },
}
```
`beforeValidate` runs before the `required` check, so the value is always set and the NOT NULL column /
existing migration stay valid — no schema change needed to keep it `required`.

### Custom admin components + import map

```ts
{ name: 'shareUrl', type: 'ui',
  admin: { position: 'sidebar', components: { Field: '/components/admin/ShareUrlField#ShareUrlField' } } }
```
Component paths resolve relative to `admin.importMap.baseDir` (set to `src` in `payload.config.ts`). After
adding/changing one: `npm run payload generate:importmap` and commit
`src/app/(payload)/admin/importMap.js`. Admin components are `'use client'` and use Payload UI hooks:

```tsx
import { useFormFields } from '@payloadcms/ui'
const slug = useFormFields(([fields]) => fields?.slug?.value) as string | undefined
```

### Uploads (Media)

`Media` uses `upload` with `imageSizes` thumbnail 400×300 / card 768×576 / hero 1600×auto, `staticDir:
'media'`, `mimeTypes: ['image/*']`, and a required `alt`. Content collections reference an uploaded image
(`cardImage`) or fall back to an external URL string (`cardImageUrl`).

**Rules:**
- Public read stays open on content collections and Media; writes stay staff-only.
- Don't add a Payload localization plugin — bilingual data uses `field`/`fieldEn`.

---

## SQLite adapter (`@payloadcms/db-sqlite`, libSQL)

```ts
db: sqliteAdapter({ client: { url: process.env.DATABASE_URI || 'file:./kartodromo.db' } })
```

- **Dev:** auto schema-push — collection edits reflect without a migration. This can mask a missing
  migration; always create one before shipping.
- **Deploy:** `npm start` = `payload migrate && next start`. Migrations live in `src/migrations/`
  (committed) and are registered in `src/migrations/index.ts`.
- Running `payload migrate` against a dev DB that was schema-pushed prompts about data loss — for a clean
  local reseed, move `kartodromo.db` aside and let `onInit` reseed, rather than forcing a migrate.
- `kartodromo.db` is gitignored; never commit it.

---

## Seed (`src/seed.ts`)

Runs in `payload.config.ts` `onInit` (wrapped in try/catch — a failure logs, not crashes). Idempotent:

- Main content seed returns early if `activities` already has docs.
- `seedDemoInvite()` runs every boot and creates the demo invite only if one for `childName: 'Martim'`
  doesn't exist; it logs the generated `/convite/{slug}`.
- `seedLapRecords()` runs every boot and seeds the `/recordes` demo lap records only if the
  `lap-records` collection is empty (relative `recordedAt` dates so all three period windows populate).

Add seed data by extending the arrays (activities, karts, pricing, modes, packages, extras) and calling
`payload.create`. Keep it idempotent.

---

## Next.js 16 (App Router, Turbopack)

- Server Components by default; `'use client'` only when needed (state/effects/events/i18n hooks).
- Route groups: `(frontend)`, `(invite)`, `(payload)`. Each group with its own `layout.tsx` renders its
  own `<html><body>`.
- `export const dynamic = 'force-dynamic'` on content pages (uncached, CMS-driven).
- `next.config.mjs` uses `withPayload(...)`, pins `turbopack.root` to `web-app`, and allows remote images
  from `www.kartodromovilareal.com` (`images.remotePatterns`). External images used via `<img>` in some
  components (e.g. the logo) — that's intentional.
- `@payloadcms/next` provides the admin/API handlers under `(payload)/` — treat those files as generated.

---

## i18n (custom — `src/lib/lang.tsx`)

No i18n library. `LangProvider` holds `lang: 'pt' | 'en'` (default `pt`, persisted to `localStorage`
`kv_lang`). `useLang()` → `{ lang, setLang }`. `useT()` → `(pt, en) => activeString`. Client-only; needs
a `LangProvider` ancestor (present in `AppShell` and the invite layout).

---

## Booking → WhatsApp (`src/lib/booking.tsx`)

`BookingProvider`/`useBooking().open(activity?)` render the modal. On submit:

```ts
await fetch('/api/bookings', {                     // Payload REST, public create
  method: 'POST', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name, phone, activity, date, time, people }),
})                                                 // wrapped in try/catch — never blocks the user
const waNum = (settings.whatsapp || '351920268289').replace(/\D/g, '')
window.open(`https://wa.me/${waNum}?text=${encodeURIComponent(message)}`, '_blank')
```

**Rules:** digits-only number; `encodeURIComponent` the message; bilingual message; no online payment.

---

## sharp

Used by Payload for Media image resizing (registered in `payload.config.ts`). Not called directly in app
code — don't import it manually.
