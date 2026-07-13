'use client'
import { C, body } from '@/lib/styles'
import { useT } from '@/lib/lang'
import type { Settings } from '@/lib/booking'

const LOGO = 'https://www.kartodromovilareal.com/themes/kartodromo/images/assets/logo.png'

export function Footer({ settings }: { settings: Settings }) {
  const t = useT()
  const s = settings || {}
  const social = s.social || {}
  return (
    <footer style={{ background: '#080808', borderTop: `2px solid ${C.yellow}` }}>
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))',
          gap: 32,
          padding: '36px clamp(20px,4vw,48px)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <img src={LOGO} alt="Kartódromo Vila Real" style={{ height: 38, width: 'auto', alignSelf: 'flex-start' }} />
          <span style={{ font: `400 13px/1.6 ${body}`, color: '#8f8f8f' }}>
            {s.address}
            <br />
            {s.email}
          </span>
          <div style={{ display: 'flex', gap: 12, font: `600 12px/1 ${body}`, letterSpacing: '.08em' }}>
            {social.facebook && <a href={social.facebook} style={linkStyle}>FACEBOOK</a>}
            {social.instagram && <a href={social.instagram} style={linkStyle}>INSTAGRAM</a>}
            {social.youtube && <a href={social.youtube} style={linkStyle}>YOUTUBE</a>}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={col}>{t('CONTACTO', 'CONTACT')}</span>
          <span style={val}>{s.phone} (WhatsApp)</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={col}>{t('HORÁRIO', 'HOURS')}</span>
          <span style={val}>{t(s.hours, s.hoursEn)}</span>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 120,
            background: 'repeating-linear-gradient(45deg,#141414 0 12px,#181818 12px 24px)',
            border: '1px dashed rgba(255,255,255,.15)',
          }}
        >
          <span style={{ font: `12px ui-monospace, Menlo, monospace`, color: C.faint }}>google maps embed</span>
        </div>
      </div>
    </footer>
  )
}

const linkStyle: React.CSSProperties = { color: '#8f8f8f', textDecoration: 'none' }
const col: React.CSSProperties = { font: `700 12px/1 ${body}`, letterSpacing: '.2em', color: C.yellow }
const val: React.CSSProperties = { font: `600 15px/1.5 ${body}`, color: '#ddd' }
