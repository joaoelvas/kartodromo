# UI Tokens

Design tokens for Kartódromo Vila Real. The brand is **dark + racing-yellow** with a motorsport "track
pass" motif (checkered flags, clipped/angled buttons, dashed perforations). All tokens live in
**`web-app/src/lib/styles.ts`** and are applied via **inline styles** — this project does **not** use
Tailwind, CSS modules, or a `tailwind.config`. See also `design/DESIGN_GUIDELINES.md` at the repo root.

---

## How to Use

Import tokens and spread them into `style={{ … }}`:

```tsx
import { C, cond, body, clipL } from '@/lib/styles'

// Correct — token-driven inline styles
<div style={{ background: C.ink, color: C.text, font: `800 17px ${cond}` }} />

// Correct — a yellow clipped CTA
<button style={{ background: C.yellow, color: C.ink, clipPath: clipL }}>RESERVAR</button>

// Never — hardcode a hex that already exists as a token
<div style={{ color: '#FFD200' }} />        // use C.yellow

// Never — introduce Tailwind classes or a className-based design system
<div className="bg-yellow-400" />
```

The invite feature also uses a raw hex `#141416` for the pass card surface (slightly different from
`C.card`) — that is the one intentional exception, taken verbatim from the design handoff.

---

## `src/lib/styles.ts` — Complete Token Definition

```ts
export const C = {
  yellow: '#FFD200',              // primary accent / CTAs / active states
  yellowSoft: '#ffdf4d',          // link hover
  ink: '#0c0c0d',                 // page background / dark surfaces / text-on-yellow
  panel: '#131314',               // section / modal background
  card: '#1b1b1d',                // card / input background
  line: 'rgba(255,255,255,.08)',  // hairline border
  lineStrong: 'rgba(255,255,255,.2)', // stronger border / input border
  text: '#fff',                   // primary text
  muted: '#b9b9b9',               // supporting text
  dim: '#a5a5a5',                 // sub-text
  faint: '#7d7d7d',               // labels / captions / placeholders
}

export const cond = "'Barlow Condensed', system-ui, sans-serif"  // display — always italic + UPPERCASE
export const body = "'Barlow', system-ui, sans-serif"            // body / UI

// Angled CTA edge — the signature "race pass" button shape
export const clipL = 'polygon(10px 0,100% 0,calc(100% - 10px) 100%,0 100%)'

// Yellow dashed rule used next to section titles
export const dashRule: React.CSSProperties = {
  flex: 1, height: 2,
  background: `repeating-linear-gradient(90deg, ${C.yellow} 0 24px, transparent 24px 36px)`,
}

// Faint diagonal "track" texture overlay for section/page backgrounds
export const stripes: React.CSSProperties = {
  position: 'absolute', inset: 0,
  background: 'repeating-linear-gradient(115deg,transparent 0 340px,rgba(255,210,0,.05) 340px 420px)',
}
```

---

## Fonts

Loaded via Google Fonts `@import` at the top of `src/app/(frontend)/globals.css` (imported by both the
`(frontend)` and `(invite)` layouts):

```css
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,600;0,700;0,800;1,700;1,800;1,900&family=Barlow:wght@400;500;600;700&display=swap');
```

- **`Barlow Condensed`** (`cond`) — headlines, section titles, prices, numbers, CTAs. **Always italic,
  weight 800–900, UPPERCASE** for display (e.g. `italic 900 clamp(52px,15vw,84px)/.88 'Barlow Condensed'`).
- **`Barlow`** (`body`) — everything else: body copy, labels, nav, form fields.

`body` element defaults to Barlow with `background:#0c0c0d; color:#fff` in `globals.css`.

---

## Typography Scale (as used in the codebase)

| Element                | Font   | Style (font shorthand)                                   | Color        |
| ---------------------- | ------ | -------------------------------------------------------- | ------------ |
| Hero / invite name     | `cond` | `italic 900 clamp(52px,15vw,84px)/.88`                   | `C.text`     |
| Big headline           | `cond` | `italic 900 clamp(38px,10vw,54px)/.9`                    | `C.ink` / `C.text` |
| Section title          | `cond` | `italic 800 clamp(30px,4vw,44px)/1`, UPPERCASE           | `C.text`     |
| Modal title            | `cond` | `italic 900 34px/1`, UPPERCASE                           | `C.text`     |
| Price value            | `cond` | `800 19px`                                               | `C.yellow`   |
| CTA button label       | `cond` | `800 16–17px`, letter-spacing `.1em`                    | `C.ink`      |
| Eyebrow                | `body` | `700 12–13px`, letter-spacing `.28em`                   | `C.yellow` / `C.ink` |
| Nav link               | `body` | `600 14px`, letter-spacing `.12em`                      | `#cfcfcf` / active `C.yellow` |
| Body copy              | `body` | `400 14–15px/1.5`                                        | `C.muted`    |
| Detail value           | `body` | `600 16px`                                               | `C.text`     |
| Label / caption        | `body` | `600–700 10–12px`, letter-spacing `.16–.24em`           | `C.faint`    |

Display type is italic + uppercase; body labels lean on wide `letter-spacing`.

---

## Signature Motifs (racing theme)

- **Checkered strip** — `height:16px; background: repeating-conic-gradient(#fff 0 25%,#0c0c0d 0 50%) 0 0/16px 16px`. Used top/bottom of the invite pass.
- **Clipped CTA** — yellow button with `clipPath: clipL` (or the header's tighter `8px` variant). The primary call to action across the app.
- **Angled section rule** — `dashRule` yellow dashes beside `SectionTitle`.
- **Diagonal track texture** — `stripes` faint yellow diagonal band behind sections.
- **Pulsing checkered flag** — small eyebrow flag on the invite: `repeating-conic-gradient(...)` with
  `animation: flagpulse 1.4s ease-in-out infinite` (keyframes in `globals.css`, opacity .5↔1).
- **Perforation** — dashed divider + two `C.ink` notch circles cut into the invite card edges.

---

## Component Tokens

### Card / panel
```
background: C.card (or C.panel for larger surfaces)
border: 1px solid C.line   (use C.lineStrong for emphasis / inputs)
```

### Primary button (CTA)
```
font: 800 16–17px 'Barlow Condensed'; letter-spacing: .1em
padding: 16px 26px            (invite CTA: 17px 34px)
background: C.yellow; color: C.ink; border: none
clip-path: clipL              (header CTA uses a tighter 8px polygon)
```

### Segmented PT/EN toggle
```
container: 1px solid C.lineStrong; border-radius: 4px; overflow: hidden
option:    700 11px 'Barlow'; padding: 7px 9–10px
active:    background C.yellow; color C.ink
inactive:  background transparent; color #9a9a9a / C.text
```

### Input field (booking modal)
```
padding: 12px 14px
background: C.card; border: 1px solid C.lineStrong; color: C.text
font: 500 15px 'Barlow'
date inputs add colorScheme: 'dark'
```

### Detail row (invite / lists)
```
flex space-between; padding: 12–14px 0; border-bottom: 1px solid C.line (none on last)
label: 700 11px 'Barlow'; letter-spacing .2em; color C.faint
value: 600 16px 'Barlow'; color C.text; text-align right (sub-line 400 13px C.dim)
```

### Radius
Corners are mostly **square (0)**. Small radius (`4px`) only on the language toggle and pills; notch
circles use `50%`. Avoid rounded cards.

---

## Invariants

- Style with **inline styles + tokens from `src/lib/styles.ts`** — never add Tailwind, CSS modules, or a
  `className`-based design system.
- Reuse `C.*` tokens instead of re-typing hex values. The only sanctioned raw hexes are the invite pass
  surface `#141416` and the checkered/gradient literals, taken from the design handoff.
- Display text (`cond`) is **italic, uppercase, weight 800–900** — never regular-weight upright Barlow
  Condensed for headings.
- Primary CTAs are **yellow (`C.yellow`) on ink (`C.ink`) with the `clipL` angled edge** — don't ship a
  plain rectangular primary button.
- Both fonts come from the `globals.css` `@import`; keep that link's weight/italic axes in sync if you
  add a new weight.
- Keep the racing motifs (checkered strips, dashed rules, angled clips) consistent — they are the brand.
