'use client'
import { C, cond, body, dashRule } from '@/lib/styles'
import { useT } from '@/lib/lang'

// Small shared presentational bits used across page views (client — they read language).

export function SectionTitle({ pt, en }: { pt: string; en: string }) {
  const t = useT()
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 24 }}>
      <h2
        style={{
          margin: 0,
          font: `italic 800 clamp(30px,4vw,44px)/1 ${cond}`,
          color: C.text,
          textTransform: 'uppercase',
        }}
      >
        {t(pt, en)}
      </h2>
      <span style={dashRule} />
    </div>
  )
}

export function Eyebrow({ pt, en }: { pt: string; en: string }) {
  const t = useT()
  return (
    <span style={{ font: `700 13px/1 ${body}`, letterSpacing: '.28em', color: C.yellow }}>{t(pt, en)}</span>
  )
}

export function PriceRow({
  pt,
  en,
  price,
  last,
}: {
  pt: string
  en?: string
  price: string
  last?: boolean
}) {
  const t = useT()
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: 12,
        padding: '12px 0',
        borderBottom: last ? 'none' : `1px solid ${C.line}`,
      }}
    >
      <span style={{ font: `500 15px ${body}`, color: '#ddd' }}>{t(pt, en)}</span>
      <span style={{ font: `800 19px ${cond}`, color: C.yellow }}>{price}</span>
    </div>
  )
}
