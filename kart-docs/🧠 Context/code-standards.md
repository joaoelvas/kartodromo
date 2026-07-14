# Code Standards

Implementation rules for the Kartódromo Vila Real codebase (`web-app/`). Follow these every session to
prevent pattern drift. Read `architecture.md` and `ui-rules.md` before implementing.

---

## Engineering Mindset

- **Read context files first** — verify against `architecture.md`, `ui-rules.md`, `ui-tokens.md` before
  writing code.
- **Reuse before adding** — the site already has tokens (`lib/styles.ts`), i18n (`lib/lang.tsx`), a
  Payload client (`lib/payload.ts`), shared UI (`components/ui.tsx`, `BookButton`), and the booking modal.
  Prefer them over new code.
- **Scope is sacred** — build only what the task needs.
- **Clean over clever** — simple readable code beats abstractions.
- **Bilingual by default** — every user-facing string is PT + EN.

---

## TypeScript

- `strict` is on. Avoid `any`; prefer `unknown` + narrowing, or the generated Payload types.
- Payload doc types come from `src/payload-types.ts` (generated). Import from there rather than
  re-declaring shapes. **Never hand-edit that file** — run `npm run generate:types`.
- Existing code casts Payload globals where convenient (e.g. `as unknown as Settings`); keep such casts
  narrow and only where the generated types are awkward.
- `const` by default; `let` only when reassigning.

---

## Next.js 16 / React 19 Conventions

- App Router only. Three route groups: `(frontend)` (public site), `(invite)` (standalone invite),
  `(payload)` (admin + API, mostly generated — don't hand-edit generated files there).
- **Server Components by default.** Add `'use client'` only when the component needs state, effects,
  events, browser APIs, or the i18n hooks (`useT`/`useLang`).
- **Data fetching happens in Server Components** via `getPayloadClient()` — never fetch Payload from a
  client component. Pass `docs` down as props to a client View.
- Every public page sets `export const dynamic = 'force-dynamic'` (content is CMS-driven, uncached).
- Don't add `middleware.ts`/auth to the public site — there is no public login.
- Turbopack root is pinned in `next.config.mjs` (`turbopack.root`) to avoid the multi-lockfile
  workspace-root warning — leave it in place.

---

## Payload Conventions

- **One collection per file** in `src/collections/` (exception: `Packages.ts` exports both `Packages`
  and `Extras`). Register every collection in `src/payload.config.ts` `collections[]`; globals in
  `globals[]`.
- **Access control on every collection.** Content is public read, staff write:
  ```ts
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  }
  ```
  `bookings` overrides `create: () => true` (public submissions). `invites` keeps `read: () => true`
  (guests). Never open a write to the public without a reason.
- **Bilingual fields** use the `field` / `fieldEn` convention (`label`+`labelEn`, `note`+`noteEn`,
  `intro`+`introEn`, array items `{ text, textEn }`). Do not add a localization plugin — this is the
  project's chosen pattern.
- **Admin ergonomics:** set `admin.useAsTitle`, `admin.defaultColumns`, `admin.group` (Conteúdo /
  Reservas / Admin), and a Portuguese `admin.description` on non-obvious fields. Auto-generated or
  system fields use `admin.readOnly` + `admin.position: 'sidebar'` (see `Invites.slug`).
- **Ordering:** list content has an `order` number field; pages fetch with `sort: 'order'`.

---

## Migrations (required on schema change)

Deploy runs `payload migrate` before `next start` (`package.json` `start`). Dev uses auto schema-push, so
locally you may not notice a missing migration — but **every collection/global/field change needs a
committed migration** or production will run against an out-of-date schema.

```
npm run payload migrate:create <name>   # generates src/migrations/<ts>_<name>.{ts,json} + updates index.ts
# commit all generated files
```

Never hand-write migration SQL; generate it. Don't run destructive `payload migrate` against a dev DB
that has data you want (it prompts about data loss).

---

## Custom Admin Components

- Live in `src/components/admin/`, `'use client'`, use Payload UI hooks (`useFormFields`, etc.).
- Reference from a field as `components: { Field: '/components/admin/Name#Export' }` (path relative to
  `admin.importMap.baseDir`, which is `src`).
- After adding/renaming one, run `npm run payload generate:importmap` and commit the updated
  `src/app/(payload)/admin/importMap.js`.

---

## File & Folder Naming

- Route folders: kebab-case (`aniversarios`, `convite`). Route groups in parens: `(frontend)`, `(invite)`.
- Collections/components: PascalCase files (`Invites.ts`, `ShareUrlField.tsx`, `AniversariosView.tsx`).
- lib helpers: lowercase (`payload.ts`, `lang.tsx`, `styles.ts`, `booking.tsx`).
- Views end in `View` and live in `views/`. Page files are always `page.tsx`; layouts `layout.tsx`.

---

## Styling

- Inline styles + tokens from `@/lib/styles` (`C`, `cond`, `body`, `clipL`, `dashRule`, `stripes`). No
  Tailwind / CSS modules. See ui-tokens.md.
- Add global CSS only to `src/app/(frontend)/globals.css` (e.g. a keyframe); keep everything else inline.

---

## i18n

- `const t = useT()` then `t('Português', 'English')` in components; `t(doc.field, doc.fieldEn)` for CMS
  content. Default language PT, persisted to `localStorage` `kv_lang` via `LangProvider`.
- The `useT`/`useLang` hooks require a `LangProvider` ancestor — present in AppShell and the invite
  layout. Client-only.

---

## WhatsApp Links

- Numbers are digits only: `number.replace(/\D/g, '')` before building `https://wa.me/{n}?text=…`.
- Encode the message with `encodeURIComponent`. Keep messages bilingual (branch on `lang`).
- Default fallback number is `351920268289`; the canonical value lives in `site-settings.whatsapp`.

---

## Error Handling

- Booking `POST` is wrapped in try/catch and still opens WhatsApp even if the save fails — never block the
  user's booking on a DB write.
- Payload `onInit` seed is wrapped so a seed failure is logged, not fatal.

---

## Environment Variables

Only two are read in code (`src/payload.config.ts`), both with safe dev fallbacks:

| Variable         | Purpose                                  | Dev fallback              |
| ---------------- | ---------------------------------------- | ------------------------- |
| `PAYLOAD_SECRET` | Payload auth/session secret              | `'dev-secret-change-me'`  |
| `DATABASE_URI`   | SQLite/libSQL connection string          | `file:./kartodromo.db`    |

Set real values in production. Never hardcode secrets elsewhere.

---

## Dependencies

Keep the surface small. Current runtime deps: `next`, `react`, `react-dom`, `payload`,
`@payloadcms/db-sqlite`, `@payloadcms/next`, `@payloadcms/richtext-lexical`, `@payloadcms/ui`, `sharp`,
`graphql`, `cross-env`. Before adding a package, check whether Payload or Next already covers it. There is
intentionally **no** UI library, i18n library, or state manager — don't introduce one without updating
these docs.

---

## Scripts

```
npm run dev              # next dev (Turbopack)
npm run build            # next build
npm start                # payload migrate && next start   (deploy)
npm run generate:types   # regenerate src/payload-types.ts
npm run payload <cmd>    # payload CLI: migrate, migrate:create, generate:importmap, …
```

---

## Commit / Git

- Commit or push only when asked. Branch off `main` for feature work.
- End commit messages with the required `Co-Authored-By` trailer.
- Commit generated migration files and `importMap.js` together with the code that requires them.
