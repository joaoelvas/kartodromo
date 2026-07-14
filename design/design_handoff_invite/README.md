# Handoff: Electronic Birthday Invite

## Overview
A standalone, shareable electronic invite for birthday parties at Kartódromo Vila Real, styled as a **VIP "track pass"**. A parent (or staff) fills in the guest of honour's details; guests open a link, see a live countdown, and RSVP via WhatsApp. Bilingual PT/EN.

## About the design files
The files in this bundle are **design references created in HTML** — a working prototype showing the intended look and behavior, **not production code to copy directly**. The task is to **recreate this design in the target codebase's environment** (the Kartódromo app is Next.js 16 + Payload CMS + React) using its established patterns. `Convite Aniservario.dc.html` is authored as a "Design Component" and relies on `support.js` — treat it as a visual/behavioral spec, and rebuild the UI as a normal React component/route.

## Fidelity
**High-fidelity.** Final colors, typography, spacing, and interactions are all specified below and present in the prototype. Recreate the UI pixel-perfectly using the codebase's existing libraries and patterns.

## Screen: Invite ("Track Pass")

**Purpose:** guests view party details and RSVP.

**Layout (top → bottom), single centered card, max-width `520px`, on a `#0C0C0D` page:**
1. **Language toggle** — top-right, PT/EN segmented control.
2. **Card** — background `#141416`, border `1px solid rgba(255,255,255,.1)`, shadow `0 40px 80px rgba(0,0,0,.6)`.
   - **Top checkered strip** — height `16px`.
   - **Header band** — background `#FFD200`, padding `26px 28px 22px`. Eyebrow ("TRACK PASS · VIP GUEST") with a small pulsing checkered flag; big italic headline ("You're on the grid!"); sub ("Birthday party for").
   - **Name + age block** — centered. Name huge (`clamp(52px,15vw,84px)`); age in a bordered pill ("TURNING **N**").
   - **Countdown** — 4-cell grid (days / hours / min / sec), each cell `#0C0C0D` with `1px` border; seconds value in yellow.
   - **Race card details** — label/value rows: Date, Time, Where (fixed: Kartódromo Vila Real, Aeródromo Oeste), Party (pack).
   - **Perforation** — dashed divider with two `#0C0C0D` notch circles cut into the card edges.
   - **RSVP stub** — supporting line, primary CTA button, `tel:` fallback line.
   - **Bottom checkered strip** — height `16px`.
3. **Footer line** — muted, below the card.

## Components & exact styles

**Language toggle**
- Container: `border:1px solid rgba(255,255,255,.2); border-radius:4px; overflow:hidden`.
- Each option: `font:700 11px Barlow; padding:7px 10px`. Active: `background:#FFD200; color:#0C0C0D`. Inactive: `background:transparent; color:#fff`.

**Header eyebrow flag** (pulsing): `width:30px; height:11px; background:repeating-conic-gradient(#0c0c0d 0 25%, #FFD200 0 50%) 0 0/6px 6px; animation: flagpulse 1.4s ease-in-out infinite` (keyframes: opacity .5 → 1 → .5).

**Headline (header band):** `font: italic 900 clamp(38px,10vw,54px)/.9 'Barlow Condensed'; color:#0C0C0D; text-transform:uppercase`.

**Guest name:** `font: italic 900 clamp(52px,15vw,84px)/.88 'Barlow Condensed'; color:#fff; text-transform:uppercase; text-wrap:balance`.

**Age pill:** inline-flex, `padding:8px 18px; border:1px solid rgba(255,210,0,.4); background:rgba(255,210,0,.06)`. Label `font:600 12px Barlow; letter-spacing:.22em; color:#7D7D7D`; number `font: italic 900 34px 'Barlow Condensed'; color:#FFD200`.

**Countdown cell:** `background:#0C0C0D; border:1px solid rgba(255,255,255,.1); padding:12px 4px; text-align:center`. Value `font: italic 900 32px 'Barlow Condensed'` (`#fff`, seconds `#FFD200`); caption `font:600 10px Barlow; letter-spacing:.16em; color:#7D7D7D`. Values zero-padded to 2 digits.

**Detail row:** flex space-between, `padding:14px 0`, divider `1px solid rgba(255,255,255,.1)` (none on last). Label `font:700 11px Barlow; letter-spacing:.2em; color:#7D7D7D`; value `font:600 16px Barlow; color:#fff; text-align:right` (sub-line `400 13px #A5A5A5`).

**Perforation:** dashed line `border-top:2px dashed rgba(255,255,255,.2)`; two `18px` circles `border-radius:50%; background:#0C0C0D` positioned `-9px` off each side, vertically centered.

**RSVP CTA (primary button):**
```css
font: 800 17px/1 'Barlow Condensed'; letter-spacing:.1em;
padding: 17px 34px; background:#FFD200; color:#0C0C0D; text-decoration:none;
clip-path: polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%);
```
`tel:` fallback below: `font:600 13px Barlow; color:#7D7D7D`, link `#FFD200`.

**Checkered strips:** `height:16px; background: repeating-conic-gradient(#fff 0 25%, #0c0c0d 0 50%) 0 0 / 16px 16px`.

## Interactions & behavior
- **Countdown:** compute `eventDate - now`; update every 1s (`setInterval`, clear on unmount). Clamp to 0 (no negatives). Split into days/hours/min/sec, zero-pad each to 2 digits.
- **RSVP:** opens `https://wa.me/{hostPhone}?text={encoded message}` in a new tab. Message is language-aware and includes childName + dateText. `hostPhone` is digits only (strip non-numerics).
- **Language toggle:** switches all PT/EN copy live (see Design Tokens → i18n).
- **Responsive:** single column, fluid `clamp()` type; works down to ~320px. Card caps at 520px.

## State
- `lang`: `'pt' | 'en'` (default `'pt'`).
- `now`: timestamp, ticked every 1s for the countdown.
- Party data comes in as props/route data (see below) — not internal state.

## Props / data (make these the invite's inputs)
| Field | Type | Example | Notes |
|---|---|---|---|
| `childName` | string | `"Martim"` | Guest of honour |
| `age` | number | `8` | |
| `eventDate` | string (ISO) | `"2026-07-25T15:00"` | Drives countdown |
| `dateText` | string | `"Sábado, 25 Julho 2026"` | Human-readable label |
| `timeText` | string | `"15:00"` | |
| `packText` | string | `"Pack 2 · Karting + LaserGame"` | |
| `hostPhone` | string (digits) | `"351920268289"` | RSVP WhatsApp target |

**Recommended route:** `/convite/[id]` — pull `childName`, `eventDate`, `dateText`, `packText` from the party's booking record in Payload so each party has its own shareable link automatically.

## Design tokens
**Colors:** `#0C0C0D` base · `#141416` card · `#FFD200` accent/CTA · `#1B1B1D` surface · `#B9B9B9` soft text · `#A5A5A5` sub-text · `#7D7D7D` faint/labels · hairlines `rgba(255,255,255,.1)` / `rgba(255,255,255,.2)`. Link hover `#ffdf4d`.

**Typography (Google Fonts):**
`Barlow Condensed` (ital 600–900) — display, always italic + UPPERCASE. `Barlow` (400–700) — body/UI.
```
https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,600;0,700;0,800;1,700;1,800;1,900&family=Barlow:wght@400;500;600;700&display=swap
```

**Spacing:** multiples of 4px. Card inner padding `24–28px`. Radius: card square (0); pill/toggle small (`4px`); notch circles `50%`.

**i18n copy (PT / EN):**
- Eyebrow: `PASSE DE PISTA · CONVIDADO VIP` / `TRACK PASS · VIP GUEST`
- Headline: `Estás na grelha!` / `You're on the grid!`
- Sub: `Aniversário de` / `Birthday party for`
- Age: `FAZ` / `TURNING`
- Countdown captions: `DIAS·HORAS·MIN·SEG` / `DAYS·HRS·MIN·SEC`
- Countdown title: `CONTAGEM PARA A LARGADA` / `COUNTDOWN TO LIGHTS OUT`
- Row labels: `DATA / HORA / LOCAL / FESTA` — `DATE / TIME / WHERE / PARTY`
- RSVP body: `Capacete, luvas e adrenalina por nossa conta. Confirma a tua presença para garantir o lugar na grelha.` / `Helmet, gloves and adrenaline on us. Confirm your spot on the grid.`
- CTA: `CONFIRMAR PRESENÇA` / `RSVP — I'M IN`
- Fallback: `ou liga` / `or call` + `920 268 289`

## Assets
None external beyond Google Fonts. All graphics (checkered flags, halo, perforation) are pure CSS. Logo (if you add one) lives at `https://www.kartodromovilareal.com/themes/kartodromo/images/assets/logo.png`.

## Screenshots
- `screenshots/invite-pt.png` — Portuguese state
- `screenshots/invite-en.png` — English state

## Files in this bundle
- `Convite Aniversario.dc.html` — the invite prototype (design reference). Open in a browser to see it live.
- `support.js` — runtime for the prototype only; **not** needed in production.
- `screenshots/` — reference renders (PT + EN).
- `DESIGN_GUIDELINES.md` (project root) — full brand system this invite follows.
