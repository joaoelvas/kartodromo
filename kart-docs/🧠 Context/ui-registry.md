# UI Registry

Living document of the components that exist. Read this before building any new component — match the
existing patterns (inline styles + tokens from `@/lib/styles`, bilingual via `useT`) before inventing
new ones. Update this file when you add or materially change a component.

All components use inline styles; there are **no CSS classes**. "Props/state" notes matter more than
class lists here.

---

## Layout & Shared (`src/app/(frontend)/components/`)

### AppShell — `components/AppShell.tsx`
`'use client'`. Wraps the whole public site: `LangProvider` → `BookingProvider settings` → `Header` →
`<main>{children}</main>` → `Footer settings`. Rendered by `(frontend)/layout.tsx` (which fetches
`site-settings` server-side and passes it in). The `(invite)` group does **not** use AppShell.

### Header — `components/Header.tsx`
`'use client'`. Sticky dark bar: logo, four nav links (KARTING/LASERGAME/GRUPOS/ANIVERSÁRIOS, active =
`C.yellow`), PT/EN segmented toggle (`useLang`), and a yellow **RESERVAR/BOOK NOW** CTA calling
`useBooking().open()`. Also **exports `BookButton`** — a client CTA usable inside server pages, with
`activity?` and `variant: 'solid' | 'outline' | 'dark'` (solid = yellow `clipL`).

### Footer — `components/Footer.tsx`
Takes `settings: Settings`. Renders contact info, hours (`hours`/`hoursEn`), and social links from
`site-settings`.

### Hero — `components/Hero.tsx`
Page hero used by the activity views (eyebrow + big italic headline + intro + CTA). Bilingual via props.

### ui.tsx — `components/ui.tsx`
`'use client'` small presentational primitives shared by views:
- `SectionTitle({ pt, en })` — italic 800 uppercase Barlow Condensed heading + yellow `dashRule`.
- `Eyebrow({ pt, en })` — `700 13px` Barlow, letter-spacing `.28em`, `C.yellow`.
- `PriceRow({ pt, en?, price, last? })` — flex row, label + yellow `800 19px` price, hairline divider
  (omitted when `last`).

---

## Page Views (`src/app/(frontend)/views/`)

All are `'use client'`, receive Payload `docs` as props from their server page, and translate with
`useT`. Match these when adding a new content section.

| View               | Rendered by             | Data props                              |
| ------------------ | ----------------------- | --------------------------------------- |
| `HomeView`         | `/page.tsx`             | activities, pricing (karting tiers)     |
| `KartingView`      | `/karting/page.tsx`     | pricing tiers, karts                    |
| `LaserView`        | `/lasergame/page.tsx`   | pricing tiers, game modes               |
| `GruposView`       | `/grupos/page.tsx`      | group-race pricing tiers                |
| `AniversariosView` | `/aniversarios/page.tsx`| packages, extras                        |

---

## Booking Modal — `src/lib/booking.tsx`
`'use client'`. `BookingProvider` exposes `useBooking().open(activity?)`. Full-screen overlay
(`rgba(0,0,0,.72)`), centered panel `max-width: 860px`, `C.panel` background with a 3px yellow top
border. Two columns:
- **Left (form):** 4 fields — Activity (2×2 toggle grid), When (`<input type=date>` + time-slot toggle
  buttons `TIMES`), How many (stepper 1–30), Contact (name + optional phone). Local helpers `Field` and
  `Stepper`, shared `inputStyle`.
- **Right (summary):** live WhatsApp message preview (green panel) + yellow **Send via WhatsApp** CTA
  (`clipL`). On submit: `POST /api/bookings` then `window.open(wa.me…)`; shows a saved confirmation.

`Settings` type (contact/whatsapp/hours/social) is defined here and threaded from `site-settings`.
Activities and time slots are hardcoded constants (`ACTS`, `TIMES`).

---

## Invite ("Track Pass") — `src/app/(invite)/`

### InviteView — `(invite)/InviteView.tsx`
`'use client'`. The shareable pass, rebuilt 1:1 from `design/design_handoff_invite/`. Card
`max-width: 520px`, surface `#141416`, checkered strips top/bottom. Sections: language toggle → yellow
header band (pulsing checkered eyebrow flag + headline) → guest name + age pill → **live countdown**
(4-cell grid, seconds in yellow, updates every 1s via `setInterval`, cleared on unmount, clamped ≥0,
zero-padded) → race-card detail rows (Date/Time/Where fixed to Kartódromo Vila Real/Aeródromo Oeste,
Party) → dashed perforation with notch circles → RSVP CTA (`wa.me` to `hostPhone`, language-aware
message) + `tel:` fallback → footer line. Exposes the `Invite` type consumed by the page.

### Invite page — `(invite)/convite/[id]/page.tsx`
Server Component. Fetches `invites` by `slug`, `notFound()` if missing, renders `InviteView`.

### not-found — `(invite)/not-found.tsx`
On-brand 404: big italic yellow "Fora de pista", bilingual line, link home.

### Invite layout — `(invite)/layout.tsx`
Minimal root layout: `<html lang="pt">`, imports `../(frontend)/globals.css`, wraps children in
`LangProvider` only (no AppShell / header / footer / BookingProvider).

### Invite share metadata + OG image — `(invite)/convite/[id]/`
`page.tsx` exports `generateMetadata` (per-invite title `"{childName} faz {age} anos! 🏁"`, description
with date/time/place, Open Graph + Twitter `summary_large_image`, `metadataBase` from `siteUrl()`).
`opengraph-image.tsx` renders a 1200×630 branded "track pass" PNG via `next/og` `ImageResponse` — yellow
header band, big child name, "FAZ {age}" pill, date line — loading Barlow Condensed ExtraBold from Google
Fonts with a graceful fallback to the built-in font. Next auto-wires this file into the invite's
`og:image`. `siteUrl()` lives in `src/lib/site.ts` (uses `NEXT_PUBLIC_SERVER_URL` / `RAILWAY_PUBLIC_DOMAIN`).

---

## Custom Admin Field — `src/components/admin/ShareUrlField.tsx`
`'use client'` Payload admin `ui` field on the `Invites` collection. Reads `slug` via
`useFormFields`, builds `${window.location.origin}/convite/{slug}`, and renders a clickable link + Copy
button (with "Copied!" feedback). Before first save (no slug yet) it prompts "Save the invite to
generate its shareable link." Registered via the field's `components.Field` path
`/components/admin/ShareUrlField#ShareUrlField` and the import map (`npm run payload generate:importmap`).

---

## Patterns to Reuse

- Need a titled content section? Use `SectionTitle` + `PriceRow`/custom rows from `ui.tsx`.
- Need a CTA? Use `BookButton` (or an inline yellow `clipL` button); never a plain rectangle.
- Need PT/EN? `const t = useT()` then `t('pt','en')`.
- Need venue contact/hours/socials? They come from `site-settings` (`Settings` type), already fetched in
  the frontend layout — thread them via props, don't refetch.
- Need a new data-backed section? Add fields to the relevant collection (with `field`/`fieldEn`), fetch
  in the server page, render in the client view.
