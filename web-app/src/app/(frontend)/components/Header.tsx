'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { C, cond, body, clipL } from '@/lib/styles'
import { useLang, useT } from '@/lib/lang'
import { useBooking } from '@/lib/booking'

const LOGO = 'https://www.kartodromovilareal.com/themes/kartodromo/images/assets/logo.png'

const NAV: { href: string; pt: string; en: string }[] = [
  { href: '/karting', pt: 'KARTING', en: 'KARTING' },
  { href: '/lasergame', pt: 'LASERGAME', en: 'LASERGAME' },
  { href: '/grupos', pt: 'GRUPOS', en: 'GROUPS' },
  { href: '/aniversarios', pt: 'ANIVERSÁRIOS', en: 'BIRTHDAYS' },
  { href: '/recordes', pt: 'RECORDES', en: 'RECORDS' },
]

export function Header() {
  const path = usePathname()
  const { lang, setLang } = useLang()
  const t = useT()
  const { open } = useBooking()

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        gap: 24,
        padding: '12px 32px',
        background: 'rgba(12,12,13,.97)',
        borderBottom: `1px solid ${C.line}`,
        flexWrap: 'wrap',
      }}
    >
      <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
        <img src={LOGO} alt="Kartódromo Vila Real" style={{ height: 42, width: 'auto' }} />
      </Link>
      <nav style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        {NAV.map((n) => {
          const active = path === n.href
          return (
            <Link
              key={n.href}
              href={n.href}
              style={{
                font: `600 14px/1 ${body}`,
                letterSpacing: '.12em',
                color: active ? C.yellow : '#cfcfcf',
                textDecoration: 'none',
              }}
            >
              {lang === 'en' ? n.en : n.pt}
            </Link>
          )
        })}
      </nav>
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ display: 'flex', border: `1px solid ${C.lineStrong}`, borderRadius: 4, overflow: 'hidden' }}>
          {(['pt', 'en'] as const).map((l) => {
            const on = lang === l
            return (
              <button
                key={l}
                onClick={() => setLang(l)}
                style={{
                  cursor: 'pointer',
                  font: `700 11px/1 ${body}`,
                  padding: '7px 9px',
                  background: on ? C.yellow : 'transparent',
                  color: on ? C.ink : '#9a9a9a',
                  border: 'none',
                }}
              >
                {l.toUpperCase()}
              </button>
            )
          })}
        </div>
        <button
          onClick={() => open()}
          style={{
            cursor: 'pointer',
            font: `700 13px/1 ${body}`,
            letterSpacing: '.06em',
            padding: '12px 18px',
            background: C.yellow,
            color: C.ink,
            border: 'none',
            clipPath: 'polygon(8px 0,100% 0,calc(100% - 8px) 100%,0 100%)',
          }}
        >
          {t('RESERVAR', 'BOOK NOW')}
        </button>
      </div>
    </header>
  )
}

// Yellow CTA usable inside server-rendered pages.
export function BookButton({
  activity,
  pt,
  en,
  variant = 'solid',
}: {
  activity?: 'karting' | 'lasergame' | 'grupos' | 'aniversario'
  pt: string
  en: string
  variant?: 'solid' | 'outline' | 'dark'
}) {
  const { open } = useBooking()
  const t = useT()
  const base: React.CSSProperties = {
    cursor: 'pointer',
    font: `800 16px/1 ${cond}`,
    letterSpacing: '.1em',
    padding: '16px 26px',
    textDecoration: 'none',
    border: 'none',
    alignSelf: 'flex-start',
  }
  const styles: Record<string, React.CSSProperties> = {
    solid: { ...base, background: C.yellow, color: C.ink, clipPath: clipL },
    dark: { ...base, background: C.ink, color: C.yellow },
    outline: { ...base, background: 'transparent', color: C.text, border: `2px solid ${C.lineStrong}`, padding: '15px 24px' },
  }
  return (
    <button onClick={() => open(activity)} style={styles[variant]}>
      {t(pt, en)}
    </button>
  )
}
