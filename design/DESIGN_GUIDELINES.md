# Kartódromo Vila Real — Design Guidelines

> Brand & component reference for the website and marketing materials.
> Direction: **Racing-Bold (System 1a)**. Version 1.0 · July 2026.
> Source files: `Kartodromo Site.dc.html`, `Convite Aniservario.dc.html`.

---

## 1. Foundation

The identity is **racing-bold**: carbon black, vivid yellow, condensed italic display type, and checkered-flag accents. Tone is energetic and direct — *"full throttle, the track is waiting."* Everything sits on a dark background with yellow reserved strictly for action and emphasis.

**Principles**
- **Bold** — large, high-contrast headlines. No timidity.
- **Fast** — cut shapes (`clip-path`), diagonals, a sense of motion.
- **Direct** — one clear action per screen. Yellow means "click here."

---

## 2. Color

| Token | Hex | Role |
|---|---|---|
| Carbon Black | `#0C0C0D` | Base background |
| Track Yellow | `#FFD200` | Action, highlight, prices, numbers |
| Charcoal | `#131314` | Alternate section background |
| Surface | `#1B1B1D` | Cards |
| Soft Text | `#B9B9B9` | Body paragraphs |
| Faint Text | `#7D7D7D` | Labels, eyebrows, meta |

**Supporting hairlines:** `rgba(255,255,255,.08)` (card borders), `rgba(255,255,255,.1)` (dividers).

**Golden rule:** yellow is rare by design. Use it only for CTAs, prices, numbers, and one highlight per section. Never yellow-on-yellow. Text on yellow is always `#0C0C0D`. Link color `#FFD200`, hover `#ffdf4d`.

---

## 3. Typography

Both families from Google Fonts:
```
https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,600;0,700;0,800;1,700;1,800;1,900&family=Barlow:wght@400;500;600;700&display=swap
```

- **Barlow Condensed** — display / headings. Always `italic`, weight `800–900`, UPPERCASE.
- **Barlow** — body, UI, labels. Weights `400 / 500 / 600 / 700`.

| Style | Font | Spec |
|---|---|---|
| H1 | Barlow Condensed | `italic 900`, `52–92px` (`clamp(52px,7.5vw,92px)`), line-height `.92` |
| H2 (section) | Barlow Condensed | `italic 800`, `32–44px` (`clamp(32px,4vw,44px)`) |
| Body | Barlow | `400–500`, `15–17px`, line-height `1.55` |
| Label / eyebrow | Barlow | `700`, `11–13px`, letter-spacing `.2–.28em`, UPPERCASE |

Minimum body size on web: 15px. Never below 12px anywhere.

---

## 4. Components

### Buttons

**Primary** — the signature diagonal cut:
```css
font: 800 16px/1 'Barlow Condensed', sans-serif;
letter-spacing: .1em;
padding: 16px 26px;
background: #FFD200;
color: #0C0C0D;
clip-path: polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%);
```

**Secondary (outline):** `border: 2px solid rgba(255,255,255,.35); color:#fff;` no clip-path.

**Inverse (on yellow blocks):** `background:#0C0C0D; color:#FFD200;`.

All CTAs: `:hover` lightens yellow to `#ffdf4d`. Touch targets ≥ `44px`.

### Highlight card
- Background `#1B1B1D`, border `1px solid rgba(255,255,255,.08)`.
- **2px yellow top border** on the content block (`border-top:2px solid #FFD200`).
- Image sits on a radial yellow halo: `radial-gradient(closest-side, rgba(255,210,0,.14), transparent 75%)`.
- Hover: border → `#FFD200`.

### Price row
Flex row, `justify-content:space-between`. Label in Barlow `500 16px #ddd`; price in `Barlow Condensed italic 800 20px #FFD200`. Divider `1px solid rgba(255,255,255,.1)` between rows, none on the last.

### Flag accents
- **Checkered:** `repeating-conic-gradient(#fff 0 25%, #0c0c0d 0 50%) 0 0 / 16px 16px`.
- **Dashed yellow separator:** `repeating-linear-gradient(90deg, #FFD200 0 24px, transparent 24px 36px)` at `height:2–3px`.
- Use as section caps and header trim only — never over-decorate.

---

## 5. Layout & spacing

- Max content width: `1280px`, centered.
- Section padding: horizontal `clamp(20px,4vw,48px)`; vertical `44–56px`.
- Responsive grids: `repeat(auto-fit, minmax(230–340px, 1fr))` with `gap:18–24px` — mobile-first with no media queries.
- Spacing scale: multiples of `4px` (6, 8, 12, 14, 18, 22, 28…).
- Header: `sticky`, `padding:12px 32px`, background `rgba(12,12,13,.97)`, bottom border `1px`.
- Optional diagonal background texture: `repeating-linear-gradient(115deg, transparent 0 340px, rgba(255,210,0,.05) 340px 420px)`.

---

## 6. Language & behavior

- **PT / EN** across the whole site. Language state at top level; content duplicated per language:
  ```css
  [data-lang="en"] [lang="pt"] { display:none }
  [data-lang="pt"] [lang="en"] { display:none }
  ```
- **Bookings via WhatsApp** to `920 268 289`, pre-filled with activity, date, time and party size:
  ```
  https://wa.me/351920268289?text={pre-filled message}
  ```
- Provide a direct `tel:` link alongside WhatsApp CTAs.

---

## 7. Electronic invite (`Convite Aniversario.dc.html`)

Standalone **"VIP track pass"** page. Card max-width `520px`, checkered strips top/bottom, yellow header band, live countdown, and an RSVP stub separated by a dashed perforation (with notch circles cut into the sides).

**Editable fields (component props)**
- `childName` (string) — guest of honour
- `age` (int)
- `eventDate` (string, ISO e.g. `2026-07-25T15:00`) — drives the countdown
- `dateText` (string) — human-readable date label
- `timeText` (string)
- `packText` (string) — party pack
- `hostPhone` (string, digits only, e.g. `351920268289`) — RSVP target

**Behavior**
- Countdown updates every 1s (days / hours / min / sec).
- RSVP button opens pre-filled WhatsApp; `tel:` link below.
- PT/EN toggle. Location fixed to Kartódromo Vila Real, Aeródromo Oeste.

**Integration suggestion:** serve each invite at `/convite/[id]`, pulling `childName`, `eventDate`, `dateText` and `packText` from the booking record in Payload, so every party generates its own link automatically.

---

*Kartódromo Vila Real · Design Guidelines v1.0*
