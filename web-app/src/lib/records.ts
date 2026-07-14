// Pure derivation helpers for the public track-records board (/recordes).
// Kept framework-free so the logic is easy to reason about and reuse.

export type Segment = 'overall' | '270' | '390' | 'adult' | 'junior'

// A single lap entry as consumed by the records view (already serialized on the server).
export type LapEntry = {
  name: string
  ms: number
  cls: '270' | '390'
  cat: 'adult' | 'junior'
  laps: number
  date: string // short label, e.g. "12 Mar"
  dateEn: string // short label, e.g. "12 Mar" (EN month abbrev)
}

// A ranked row ready to render.
export type RankedRow = LapEntry & {
  rank: number
  gap: string // "—" for the leader, else "+0.421"
  isLeader: boolean
}

// Podium/rank accent colors for P1/P2/P3 (gold / silver / bronze); grey otherwise.
export const RANK_COLORS = ['#FFD200', '#cfcfcf', '#c8853c'] as const
export const RANK_FALLBACK = '#5a5a5a'

// ms → "SS.mmm" (e.g. 43987 → "43.987"). Displayed with a trailing "s" in the UI.
export function fmtLap(ms: number): string {
  const s = Math.floor(ms / 1000)
  const m = String(ms % 1000).padStart(3, '0')
  return `${s}.${m}`
}

export function rankColor(index: number): string {
  return index < 3 ? RANK_COLORS[index] : RANK_FALLBACK
}

function matchesSegment(e: LapEntry, seg: Segment): boolean {
  if (seg === 'overall') return true
  if (seg === 'adult') return e.cat === 'adult'
  if (seg === 'junior') return e.cat === 'junior'
  return e.cls === seg
}

// Filter by segment, sort ascending by lap time, assign ranks and gaps to the leader.
export function rankEntries(entries: LapEntry[], seg: Segment): RankedRow[] {
  const sorted = entries.filter((e) => matchesSegment(e, seg)).slice().sort((a, b) => a.ms - b.ms)
  const leaderMs = sorted.length ? sorted[0].ms : 0
  return sorted.map((e, i) => ({
    ...e,
    rank: i + 1,
    gap: i === 0 ? '—' : `+${((e.ms - leaderMs) / 1000).toFixed(3)}`,
    isLeader: i === 0,
  }))
}
