# Progress Tracker

Update this file after every completed feature. Any AI agent reading this should immediately know what is
done, what is in progress, and what is next.

---

## Current Status

**Phase:** Phase 6 — post-launch iterations
**Last completed:** Digital birthday invite ("track pass") + admin share URL (commit `b8cd002`)
**Next:** No active task. Likely candidates in `build-plan.md` Phase 6 (booking management, invite
generation from bookings, media-backed imagery).

---

## Progress

### Phase 1 — Foundation
- [x] 01 Payload + Next.js scaffold (SQLite, `getPayloadClient`, aliases)
- [x] 02 Design system (`lib/styles.ts` tokens, Barlow fonts, inline-style convention)
- [x] 03 Bilingual layer (`lib/lang.tsx` — LangProvider / useLang / useT)
- [x] 04 Content schema (Activities, Karts, PricingTiers, Packages+Extras, GameModes, Media, Users, SiteSettings) + seed

### Phase 2 — Public Site
- [x] 05 AppShell + frontend layout (fetches site-settings)
- [x] 06 Header / Footer / Hero / ui primitives + BookButton
- [x] 07 Activity pages: `/`, `/karting`, `/lasergame`, `/grupos`, `/aniversarios` (server → client view)

### Phase 3 — Booking
- [x] 08 WhatsApp booking modal (`lib/booking.tsx`) + `Bookings` collection (public create, staff triage)

### Phase 4 — Deploy hardening
- [x] 09 Migrations run on deploy (`npm start` = `payload migrate && next start`); REST options fix

### Phase 5 — Digital Birthday Invite
- [x] 10 `Invites` collection with auto-generated unguessable slug (read-only) + public read
- [x] 11 `(invite)` route group: standalone layout, `convite/[id]`, `InviteView` (countdown + WhatsApp RSVP), not-found
- [x] 12 `ShareUrlField` custom admin field (copy-ready share URL) + import map

### Phase 6 — Post-launch (not started)
- [ ] Booking management / staff notifications
- [ ] Generate an invite from the birthday booking flow
- [ ] Media-backed imagery (replace `*ImageUrl` fallbacks where useful)
- [ ] SEO / per-page metadata / invite Open Graph

---

## Key Decisions Made During Build

- **Styling:** inline styles + tokens in `src/lib/styles.ts` — deliberately no Tailwind / CSS modules.
  Brand is dark (`C.ink`) + racing-yellow (`C.yellow`) with checkered/clipped "track pass" motifs.
- **i18n:** custom, no library. `useT(pt, en)` + `field`/`fieldEn` on CMS content. Default PT, persisted
  to `localStorage` `kv_lang`.
- **Data access:** Server Components fetch via `getPayloadClient()` and pass docs to client Views; client
  components never touch Payload. Public pages are `dynamic = 'force-dynamic'`.
- **No online payment:** bookings open a pre-filled WhatsApp message and also `POST /api/bookings`. The
  DB write is best-effort (try/catch) and never blocks opening WhatsApp.
- **Invite share id:** `Invites.slug` is an auto-generated base62 id (unguessable), filled via a
  `beforeValidate` hook and read-only in admin — chosen over human-readable slugs so links can't be
  enumerated. `useAsTitle` is `childName` for admin readability.
- **Invite is standalone:** lives in its own `(invite)` route group with no site header/footer, its own
  `LangProvider`, and its own PT/EN toggle — per the design handoff.
- **Deploy:** SQLite with committed migrations; `payload migrate` runs before `next start`. Dev relies on
  Payload's auto schema-push.
- **Turbopack root** pinned in `next.config.mjs` to silence the multi-lockfile workspace-root warning
  (a stray empty `package-lock.json` sits at the repo root; the real one is in `web-app/`).

---

## Notes / Gotchas

- **Never hand-edit `src/payload-types.ts`** — regenerate with `npm run generate:types`.
- **Any schema change needs a committed migration** (`npm run payload migrate:create <name>`) or an empty
  production DB will be out of sync. Dev won't warn you because it auto-pushes schema.
- Running `payload migrate` against a schema-pushed dev DB prompts about data loss; for a clean local
  reseed, move `web-app/kartodromo.db` aside and let `onInit` reseed instead of forcing a migrate.
- After adding/renaming a custom admin component, run `npm run payload generate:importmap` and commit
  `src/app/(payload)/admin/importMap.js`.
- The demo invite is seeded every boot (only if missing) and its generated URL is logged as
  `🎟️ Demo invite: /convite/{slug}` — check the dev log to find it (the slug is random).
- WhatsApp numbers must be digits only before building a `wa.me` link. Canonical number lives in
  `site-settings.whatsapp` (fallback `351920268289`).
- Git history so far: `c807309` initial · `b7c4ec0` REST options build fix · `a0a9785` migrations on
  deploy · `b8cd002` digital invite.
