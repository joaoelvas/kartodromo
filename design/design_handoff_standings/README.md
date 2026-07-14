# Handoff: Public Track Records / Standings

## Overview
A public **track records** page for Kartódromo Vila Real — the fastest lap times recorded by the timing system, ranked and filterable. Anyone can view it; it drives sign-ups to the driver portal. Bilingual PT/EN.

## About the design files
The file in this bundle is a **design reference created in HTML** — a working prototype of look and behavior, **not production code to copy directly**. Recreate it in the target codebase (the Kartódromo app is **Next.js 16 + Payload CMS + React**) using its existing patterns and data. The prototype is authored as a "Design Component" and needs `support.js` only to run standalone — treat it as a visual/behavioral spec.

> The records page and the driver portal live in the **same** prototype file (`Kartodromo Records e Portal.dc.html`); this bundle is scoped to the **public standings**. The portal has its own handoff.

## Fidelity
**High-fidelity.** Final colors, type, spacing, and interactions are specified below and present in the prototype.

## Screen: Track Records (`/recordes`)

**Purpose:** browse the fastest laps; filter by time period and class/category.

**Layout (max-width 1180px, centered, on `#0C0C0D`):**
1. **Hero band** — checkered-flag eyebrow, big italic headline ("Tabela de recordes" / "Track records"), one-line subtitle. Diagonal track texture overlay.
2. **Period toggle** (left) + **period range label** (right, e.g. "Julho 2026").
3. **Segment toggle** — pill row.
4. **Podium** — top 3 as cards (gold/silver/bronze top border, huge ghost rank number behind).
5. **Full leaderboard table**.
6. **Yellow CTA band** → "Create a driver profile" (links to portal register).

## Controls & behavior

**Period toggle** — three options: **ANO / MÊS / SEMANA** (Year / Month / Week). Rectangular buttons; active = filled yellow `#FFD200` on `#0C0C0D`, inactive = transparent with `rgba(255,255,255,.2)` border, text `#cfcfcf`. Selecting one swaps the dataset and re-ranks.

**Segment toggle** — five pills (rounded `999px`): **Geral / 270cc / 390cc / Adultos / Júnior** (Overall / 270cc / 390cc / Adults / Junior). Active = filled white `#fff` on `#0C0C0D`; inactive = transparent, text `#9a9a9a`, border `rgba(255,255,255,.18)`. Filters the current period's list, then re-ranks and recomputes gaps.

Both toggles compose: e.g. *Month × 390cc* shows the fastest 390cc laps this month.

## Components & exact styles

**Podium card:** `background:#1B1B1D; border:1px solid rgba(255,255,255,.08); border-top:3px solid {accent}` where accent = `#FFD200` (P1) / `#cfcfcf` (P2) / `#c8853c` (P3). Ghost rank digit behind: `Barlow Condensed italic 900 96px`, color `rgba(255,255,255,.05)`. Tag ("P1") in accent; name `italic 800 26px 'Barlow Condensed'`; time `italic 900 40px 'Barlow Condensed' #FFD200` with a smaller grey "s"; meta line `500 13px Barlow #a5a5a5`.

**Leaderboard table** (`background:#131314; border:1px solid rgba(255,255,255,.08)`):
- Column grid: `56px 1fr 130px 110px 100px 70px` = POS / DRIVER / BEST LAP / KART / GAP / LAPS.
- Header row: `700 11px Barlow`, letter-spacing `.16em`, color `#7D7D7D`, bottom border `rgba(255,255,255,.1)`.
- Body rows: `padding:14px 20px`, bottom border `rgba(255,255,255,.06)`. **Leader row** tinted `rgba(255,210,0,.05)`.
- Rank: `italic 900 22px 'Barlow Condensed'`; color `#FFD200`/`#cfcfcf`/`#c8853c` for top 3, else `#5a5a5a`.
- Driver: `600 16px Barlow #fff`, with a small grey "JR" tag for juniors.
- Best lap: `800 20px 'Barlow Condensed' #FFD200` + small grey "s".
- Kart: `600 13px Barlow #c9c9c9` (e.g. "390cc"). Gap: `600 14px 'Barlow Condensed' #9a9a9a` (e.g. "+0.421", leader shows "—"). Laps: right-aligned `600 15px Barlow #c9c9c9`.

## Data model (records)
Each lap record entry:
| Field | Type | Example |
|---|---|---|
| `name` | string | `"Rui Machado"` |
| `ms` | number (ms) | `43987` |
| `cls` | `"270" \| "390"` | `"390"` |
| `cat` | `"Adult" \| "Junior"` | `"Adult"` |
| `laps` | number | `22` |
| `date` | string | `"12 Mar"` |

**Derivations (done at render):**
- **Filter** by segment (overall = all; `270`/`390` by `cls`; `adult`/`junior` by `cat`).
- **Sort** ascending by `ms`; assign rank = index + 1.
- **Gap** = `(ms - leaderMs) / 1000`, formatted `+0.000`; leader = "—".
- **Lap format**: `ms → "SS.mmm"` (e.g. `43987 → "43.987"`), displayed with a trailing "s".

**Backing:** compute Year/Month/Week from the timing/lap records in Payload — a single laps collection filtered by date window, best lap per driver. The prototype hardcodes three sample arrays (10 / 8 / 6 entries) with realistic Portuguese names and 43.5–46.8s times as a stand-in.

## Design tokens
**Colors:** `#0C0C0D` base · `#131314` table/section · `#1B1B1D` cards · `#FFD200` accent/time (hover `#ffdf4d`) · podium `#cfcfcf` / `#c8853c` · text `#fff` / `#b9b9b9` / `#9a9a9a` / `#7D7D7D` · hairlines `rgba(255,255,255,.06–.1)`.

**Typography (Google Fonts):** `Barlow Condensed` (ital 600–900) for display/numbers, always italic + UPPERCASE; `Barlow` (400–700) for body/labels.
```
https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,600;0,700;0,800;1,700;1,800;1,900&family=Barlow:wght@400;500;600;700&display=swap
```

**i18n:** every static string is duplicated in `<span lang="pt">` / `<span lang="en">`, toggled by `data-lang` on the root:
```css
[data-lang="en"] [lang="pt"]{display:none}
[data-lang="pt"] [lang="en"]{display:none}
```

## Assets
No external images beyond the site logo (`https://www.kartodromovilareal.com/themes/kartodromo/images/assets/logo.png`) and Google Fonts. All flag/checker/texture graphics are pure CSS.

## Files in this bundle
- `Kartodromo Records e Portal.dc.html` — the prototype (records + portal). Open in a browser to explore.
- `support.js` — runtime for the prototype only; not needed in production.
- `screenshots/records-overall.png` — Month × Overall.
- `screenshots/records-filtered.png` — Year × Junior (shows filtering + re-ranking).
- `../DESIGN_GUIDELINES.md` — the full brand system this follows.
