// Shared design tokens + inline style helpers (no hooks — safe in server or client components).
export const C = {
  yellow: '#FFD200',
  yellowSoft: '#ffdf4d',
  ink: '#0c0c0d',
  panel: '#131314',
  card: '#1b1b1d',
  line: 'rgba(255,255,255,.08)',
  lineStrong: 'rgba(255,255,255,.2)',
  text: '#fff',
  muted: '#b9b9b9',
  dim: '#a5a5a5',
  faint: '#7d7d7d',
}

export const cond = "'Barlow Condensed', system-ui, sans-serif"
export const body = "'Barlow', system-ui, sans-serif"

export const clipL = 'polygon(10px 0,100% 0,calc(100% - 10px) 100%,0 100%)'

export const dashRule: React.CSSProperties = {
  flex: 1,
  height: 2,
  background: `repeating-linear-gradient(90deg, ${C.yellow} 0 24px, transparent 24px 36px)`,
}

export const stripes: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  background: 'repeating-linear-gradient(115deg,transparent 0 340px,rgba(255,210,0,.05) 340px 420px)',
}
