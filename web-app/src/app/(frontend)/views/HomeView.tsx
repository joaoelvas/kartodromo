'use client'
import Link from 'next/link'
import { C, cond, body, clipL, stripes } from '@/lib/styles'
import { useLang, useT } from '@/lib/lang'
import { BookButton } from '../components/Header'
import { PriceRow } from '../components/ui'

const KART = 'https://www.kartodromovilareal.com/sites/default/files/2019-05/kart_0.png'

const HREF: Record<string, string> = {
  karting: '/karting',
  lasergame: '/lasergame',
  aniversarios: '/aniversarios',
  grupos: '/grupos',
}

export function HomeView({ activities, pricing }: { activities: any[]; pricing: any[] }) {
  const { lang } = useLang()
  const t = useT()

  const imgOf = (a: any) =>
    a.cardImageUrl || (a.cardImage && typeof a.cardImage === 'object' ? a.cardImage.url : '') || KART

  return (
    <>
      {/* HERO */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={stripes} />
        <div
          style={{
            position: 'relative',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(340px,1fr))',
            gap: 24,
            alignItems: 'center',
            padding: 'clamp(28px,5vw,56px) clamp(20px,4vw,48px) 48px',
            maxWidth: 1280,
            margin: '0 auto',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span
                style={{
                  width: 34,
                  height: 12,
                  background: 'repeating-conic-gradient(#fff 0 25%,#0c0c0d 0 50%) 0 0/6px 6px',
                  border: '1px solid rgba(255,255,255,.3)',
                }}
              />
              <span style={{ font: `700 13px/1 ${body}`, letterSpacing: '.28em', color: C.yellow }}>
                {t('PISTA CATEGORIA 1 · VILA REAL', 'CATEGORY 1 TRACK · VILA REAL')}
              </span>
            </div>
            <h1
              style={{
                margin: 0,
                font: `italic 900 clamp(52px,7.5vw,92px)/.92 ${cond}`,
                color: C.text,
                textTransform: 'uppercase',
              }}
            >
              {lang === 'en' ? (
                <>
                  Full throttle.
                  <br />
                  <span style={{ color: C.yellow }}>The track</span> is waiting.
                </>
              ) : (
                <>
                  Acelera.
                  <br />
                  <span style={{ color: C.yellow }}>A pista</span> espera por ti.
                </>
              )}
            </h1>
            <p style={{ margin: 0, maxWidth: 440, font: `400 17px/1.55 ${body}`, color: C.muted }}>
              {t(
                '1 km de pista técnica, 10 m de largura, nova frota SODI 270cc e 390cc. Equipamento incluído — basta aparecer.',
                '1 km technical track, 10 m wide, new SODI 270cc and 390cc fleet. All gear included — just show up.',
              )}
            </p>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
              <BookButton pt="RESERVA JÁ — 920 268 289" en="BOOK NOW — 920 268 289" />
              <Link href="/karting" style={{ textDecoration: 'none' }}>
                <span
                  style={{
                    font: `800 16px/1 ${cond}`,
                    letterSpacing: '.1em',
                    padding: '15px 24px',
                    border: `2px solid ${C.lineStrong}`,
                    color: C.text,
                    display: 'inline-block',
                  }}
                >
                  {t('VER PREÇÁRIO', 'SEE PRICES')}
                </span>
              </Link>
            </div>
          </div>
          <div style={{ position: 'relative', minHeight: 300 }}>
            <div
              style={{
                position: 'absolute',
                inset: '8% 0 0 6%',
                background: 'radial-gradient(closest-side,rgba(255,210,0,.22),transparent 70%)',
              }}
            />
            <img
              src={KART}
              alt="Kart"
              style={{ position: 'relative', width: '100%', maxWidth: 520, filter: 'drop-shadow(0 30px 40px rgba(0,0,0,.6))' }}
            />
          </div>
        </div>

        {/* info strip */}
        <div
          style={{
            position: 'relative',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))',
            borderTop: `1px solid ${C.line}`,
          }}
        >
          <InfoCell label={t('HORÁRIO', 'HOURS')} value={t('Qua–Dom · 10:00–12:30 / 14:00–19:30', 'Wed–Sun · 10:00–12:30 / 14:00–19:30')} border />
          <InfoCell label={t('ONDE', 'WHERE')} value="Aeródromo Oeste, Vila Real" border />
          <InfoCell label={t('DESDE', 'FROM')} value={t('Karting 25€ · LaserGame 7€', 'Karting €25 · LaserGame €7')} />
        </div>
      </div>

      {/* ACTIVITIES */}
      <div style={{ padding: '52px clamp(20px,4vw,48px)', background: C.panel }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 26 }}>
            <h2 style={{ margin: 0, font: `italic 800 clamp(32px,4vw,44px)/1 ${cond}`, color: C.text, textTransform: 'uppercase' }}>
              {t('Escolhe o teu vício', 'Pick your vice')}
            </h2>
            <span style={{ flex: 1, height: 2, background: `repeating-linear-gradient(90deg, ${C.yellow} 0 24px, transparent 24px 36px)` }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))', gap: 18 }}>
            {activities.map((a) => (
              <Link
                key={a.id}
                href={HREF[a.slug] || '/'}
                style={{ textDecoration: 'none', background: C.card, border: `1px solid ${C.line}`, display: 'flex', flexDirection: 'column' }}
              >
                <div
                  style={{
                    height: 150,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'radial-gradient(closest-side,rgba(255,210,0,.14),transparent 75%)',
                  }}
                >
                  <img src={imgOf(a)} alt={a.title} style={{ maxHeight: 130, maxWidth: '88%' }} />
                </div>
                <div style={{ padding: '16px 18px 20px', borderTop: `2px solid ${C.yellow}` }}>
                  <div style={{ font: `italic 800 24px/1 ${cond}`, color: C.text, textTransform: 'uppercase' }}>{a.title}</div>
                  <div style={{ font: `400 13px/1.5 ${body}`, color: C.dim, marginTop: 6 }}>{t(a.tagline, a.taglineEn)}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* PRICING TEASER */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(340px,1fr))', borderTop: `1px solid ${C.line}` }}>
        <div style={{ padding: '44px clamp(20px,4vw,48px)' }}>
          <h3 style={{ margin: '0 0 18px', font: `italic 800 34px/1 ${cond}`, color: C.text }}>
            {t('PREÇÁRIO KARTING', 'KARTING PRICES')}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {pricing.map((p, i) => (
              <PriceRow key={p.id} pt={`${p.label} · ${p.duration}`} en={`${p.labelEn || p.label} · ${p.duration}`} price={p.price} last={i === pricing.length - 1} />
            ))}
          </div>
        </div>
        <div
          style={{
            position: 'relative',
            overflow: 'hidden',
            background: C.yellow,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 14,
            padding: '44px clamp(20px,4vw,48px)',
          }}
        >
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 14, background: 'repeating-conic-gradient(#0c0c0d 0 25%,transparent 0 50%) 0 0/14px 14px' }} />
          <h3 style={{ margin: 0, font: `italic 900 40px/1 ${cond}`, color: C.ink, textTransform: 'uppercase' }}>
            {t('Corridas de grupo', 'Group races')}
          </h3>
          <p style={{ margin: 0, font: `500 16px/1.5 ${body}`, color: '#1d1d1d', maxWidth: 400 }}>
            {t(
              'Qualificação, grelha de partida, cerimónia de pódio com medalhas e espumante. Mínimo 8 pilotos, desde 45€/kart.',
              'Qualifying, starting grid, podium ceremony with medals and sparkling wine. Minimum 8 drivers, from €45/kart.',
            )}
          </p>
          <Link href="/grupos" style={{ textDecoration: 'none' }}>
            <span style={{ font: `800 16px/1 ${cond}`, letterSpacing: '.1em', padding: '15px 24px', background: C.ink, color: C.yellow, display: 'inline-block' }}>
              {t('MARCAR CORRIDA', 'BOOK A RACE')}
            </span>
          </Link>
        </div>
      </div>
    </>
  )
}

function InfoCell({ label, value, border }: { label: string; value: string; border?: boolean }) {
  return (
    <div style={{ padding: '18px clamp(20px,4vw,48px)', borderRight: border ? `1px solid ${C.line}` : 'none' }}>
      <div style={{ font: `700 12px/1 ${body}`, letterSpacing: '.2em', color: C.faint }}>{label}</div>
      <div style={{ font: `600 16px/1.4 ${body}`, color: C.text, marginTop: 6 }}>{value}</div>
    </div>
  )
}
