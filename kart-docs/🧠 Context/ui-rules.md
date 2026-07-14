# UI Rules

Concise rules for building Kartódromo Vila Real UI. The brand is dark + racing-yellow with a motorsport
"track pass" motif. `design/DESIGN_GUIDELINES.md` and the `design/design_handoff_invite/` bundle are the
visual source of truth. Tokens live in `src/lib/styles.ts` (see ui-tokens.md).

---

## Styling Approach

- **Inline styles only**, driven by tokens from `@/lib/styles` (`C`, `cond`, `body`, `clipL`, `dashRule`,
  `stripes`). No Tailwind, no CSS modules, no styled-components.
- The only global CSS is `src/app/(frontend)/globals.css` (font `@import`, resets, `flagpulse` keyframe,
  base `a`/`button` styles). Add a keyframe there if an animation needs one; otherwise keep styles inline.
- Reuse `C.*` tokens; don't re-type hexes that already exist.

---

## Server vs Client Components

- Pages (`app/(frontend)/*/page.tsx`) are **Server Components**: fetch via `getPayloadClient()`, then
  render a client **View**. Keep `export const dynamic = 'force-dynamic'`.
- Anything that reads language (`useT`/`useLang`), holds state, uses effects, or handles events must be
  `'use client'`. All `views/*`, `components/Header|Footer`, `ui.tsx`, `booking.tsx`, and `InviteView`
  are client components.
- `Hero` and server pages can still render the `BookButton` (client) — it's a client leaf inside server
  markup.

---

## Bilingual (PT / EN)

- Every user-facing string is bilingual. In components use `const t = useT()` then `t('Português',
  'English')`. For CMS content, render `t(doc.label, doc.labelEn)`.
- Default language is Portuguese; the toggle persists to `localStorage` (`kv_lang`). Never hardcode a
  single-language label in the UI.

---

## Layout

- Dark page (`C.ink`) throughout. Content sits in a centered column, **max width `1280px`**.
- Section padding: horizontal `clamp(20px,4vw,48px)`, vertical `44–56px`.
- Responsive grids are **mobile-first with no media queries**: `repeat(auto-fit, minmax(230–340px, 1fr))`
  with `gap: 18–24px`.
- Spacing scale: multiples of 4px (6, 8, 12, 14, 18, 22, 28…).
- Header is **sticky**, full width, `padding: 12px 32px`, `background: rgba(12,12,13,.97)`, bottom
  hairline `C.line`. It wraps on small screens (`flexWrap: 'wrap'`).
- Optional diagonal background texture: the `stripes` token
  (`repeating-linear-gradient(115deg, transparent 0 340px, rgba(255,210,0,.05) 340px 420px)`).
- Use fluid `clamp()` type so headings scale down to ~320px. The invite card caps at `max-width: 520px`;
  the booking modal at `860px`.
- Touch targets ≥ 44px; body text ≥ 15px, nothing below 12px.

---

## Header

`src/app/(frontend)/components/Header.tsx`. Logo (left) → nav links → right cluster (PT/EN toggle +
yellow RESERVAR/BOOK NOW CTA that calls `useBooking().open()`).

- Nav link: `600 14px 'Barlow'`, letter-spacing `.12em`, color `#cfcfcf`; **active** (path match) →
  `C.yellow`. No underline.

---

## Section Titles & Eyebrows

Use the shared primitives in `components/ui.tsx` — don't re-invent them:

- `<SectionTitle pt="…" en="…" />` — italic 800 uppercase Barlow Condensed heading + `dashRule`.
- `<Eyebrow pt="…" en="…" />` — `700 13px 'Barlow'`, letter-spacing `.28em`, `C.yellow`.
- `<PriceRow pt en price last />` — label + yellow price, hairline divider (omit on last).

---

## Buttons

**Primary CTA (yellow, clipped):**
```
font: 800 16–17px 'Barlow Condensed'; letter-spacing: .1em
padding: 16px 26px; background: C.yellow; color: C.ink; border: none
clip-path: clipL   (header CTA uses tighter polygon(8px 0,...))
```
Prefer the shared `BookButton` (`components/Header.tsx`) with `variant='solid' | 'outline' | 'dark'`.

**Never** ship a plain rectangular primary button — the angled yellow clip is the brand signature.

---

## Cards & Surfaces

```
background: C.card (small) / C.panel (large surfaces & modal)
border: 1px solid C.line   (C.lineStrong for emphasis / inputs)
corners: square (radius 0)
```
The invite pass is the exception: surface `#141416`, `box-shadow: 0 40px 80px rgba(0,0,0,.6)`, with
checkered strips top and bottom.

---

## Forms (booking modal)

`src/lib/booking.tsx`. Fields use `C.card` background, `1px solid C.lineStrong` border, `500 15px
'Barlow'`. Field group labels are yellow, uppercase-ish, letter-spaced. Time slots and the activity
picker are toggle buttons that turn yellow when active. The right column shows a **live WhatsApp message
preview** in a green panel. Submit posts to `/api/bookings` and opens `wa.me`.

---

## Language Toggle

Segmented control, container `1px solid C.lineStrong; border-radius: 4px; overflow: hidden`. Each option
`700 11px 'Barlow'`, `padding: 7px 9–10px`; active = `C.yellow`/`C.ink`, inactive = transparent/grey.
The header has one for the site; the invite has its own standalone one.

---

## Racing Motifs

Keep these consistent — they define the brand:
- Checkered strips (`repeating-conic-gradient`) on the invite pass.
- Angled clip (`clipL`) on primary CTAs.
- Yellow dashed `dashRule` beside section titles.
- Faint diagonal `stripes` texture behind sections.
- Pulsing checkered eyebrow flag (`flagpulse`) and dashed perforation on the invite.

---

## Empty / Not-Found States

The invite group has an on-brand `not-found.tsx` (big italic yellow "Fora de pista", bilingual line, link
home). Match that tone for any new empty/404 state — dark, italic Barlow Condensed, one yellow accent.

---

## Do Nots

- Never add Tailwind, CSS modules, or a `className`-based system — inline styles + tokens only.
- Never hardcode a single-language string in the UI — always `useT(pt, en)` or `field`/`fieldEn`.
- Never call `getPayloadClient()` or import Payload from a client component — fetch in the server page.
- Never give the `/convite/[id]` page the site header/footer — it is standalone by design.
- Never use upright, regular-weight Barlow Condensed for display — headings are italic 800–900 uppercase.
- Never build a rectangular yellow primary button — use the `clipL` angled edge (or `BookButton`).
- Never build a wa.me link without stripping non-digits from the number first.
- Never overuse yellow — CTAs, prices, numbers, and one highlight per section only; never yellow-on-yellow.
- Provide a direct `tel:` link alongside WhatsApp CTAs (the invite already does this).
