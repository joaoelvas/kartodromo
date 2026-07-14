'use client'
import { useState } from 'react'
import Link from 'next/link'
import { C, cond, body, stripes } from '@/lib/styles'
import { useLang, useT } from '@/lib/lang'
import { fmtLap, rankColor, rankEntries, type LapEntry, type Segment } from '@/lib/records'

export type PeriodData = { entries: LapEntry[]; rangePt: string; rangeEn: string }
type Period = 'year' | 'month' | 'week'

const PERIODS: { key: Period; pt: string; en: string }[] = [
  { key: 'year', pt: 'ANO', en: 'YEAR' },
  { key: 'month', pt: 'MÊS', en: 'MONTH' },
  { key: 'week', pt: 'SEMANA', en: 'WEEK' },
]

const SEGMENTS: { key: Segment; pt: string; en: string }[] = [
  { key: 'overall', pt: 'Geral', en: 'Overall' },
  { key: '270', pt: '270cc', en: '270cc' },
  { key: '390', pt: '390cc', en: '390cc' },
  { key: 'adult', pt: 'Adultos', en: 'Adults' },
  { key: 'junior', pt: 'Júnior', en: 'Junior' },
]

const GRID = '56px 1fr 130px 110px 100px 70px'

export function RecordsView({ year, month, week }: { year: PeriodData; month: PeriodData; week: PeriodData }) {
  const t = useT()
  const { lang } = useLang()
  const en = lang === 'en'
  const [period, setPeriod] = useState<Period>('month')
  const [seg, setSeg] = useState<Segment>('overall')

  const data = { year, month, week }[period]
  const rows = rankEntries(data.entries, seg)
  const podium = rows.slice(0, 3)
  const podiumTags = ['P1', 'P2', 'P3']

  const catLabel = (cat: LapEntry['cat']) =>
    cat === 'junior' ? t('Júnior', 'Junior') : t('Adulto', 'Adult')

  return (
    <div>
      {/* hero band */}
      <div style={{ position: 'relative', overflow: 'hidden', borderBottom: `1px solid ${C.line}` }}>
        <div style={stripes} />
        <div style={{ position: 'relative', maxWidth: 1180, margin: '0 auto', padding: '44px clamp(20px,4vw,48px) 34px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <span style={{ width: 34, height: 12, background: 'repeating-conic-gradient(#fff 0 25%,#0c0c0d 0 50%) 0 0/6px 6px', border: '1px solid rgba(255,255,255,.3)' }} />
            <span style={{ font: `700 13px/1 ${body}`, letterSpacing: '.28em', color: C.yellow }}>
              {t('TEMPOS OFICIAIS · PISTA 1 KM', 'OFFICIAL TIMES · 1 KM TRACK')}
            </span>
          </div>
          <h1 style={{ margin: 0, font: `italic 900 clamp(48px,7vw,84px)/.9 ${cond}`, color: C.text, textTransform: 'uppercase' }}>
            {t('Tabela de recordes', 'Track records')}
          </h1>
          <p style={{ margin: '12px 0 0', maxWidth: 520, font: `400 16px/1.55 ${body}`, color: C.muted }}>
            {t(
              'As voltas mais rápidas registadas pelo sistema de cronometragem. Atualizado a cada sessão.',
              'The fastest laps recorded by our timing system. Updated after every session.',
            )}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '26px clamp(20px,4vw,48px) 60px' }}>
        {/* period toggle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 18 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {PERIODS.map((p) => {
              const on = period === p.key
              return (
                <button
                  key={p.key}
                  onClick={() => setPeriod(p.key)}
                  style={{
                    cursor: 'pointer',
                    font: `800 14px/1 ${cond}`,
                    letterSpacing: '.12em',
                    textTransform: 'uppercase',
                    padding: '11px 20px',
                    background: on ? C.yellow : 'transparent',
                    color: on ? C.ink : '#cfcfcf',
                    border: `1px solid ${on ? C.yellow : C.lineStrong}`,
                  }}
                >
                  {t(p.pt, p.en)}
                </button>
              )
            })}
          </div>
          <div style={{ font: `700 12px/1 ${body}`, letterSpacing: '.16em', color: C.faint }}>
            {en ? data.rangeEn : data.rangePt}
          </div>
        </div>

        {/* segment toggle */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
          {SEGMENTS.map((s) => {
            const on = seg === s.key
            return (
              <button
                key={s.key}
                onClick={() => setSeg(s.key)}
                style={{
                  cursor: 'pointer',
                  font: `600 12px/1 ${body}`,
                  letterSpacing: '.06em',
                  padding: '9px 15px',
                  borderRadius: 999,
                  background: on ? '#fff' : 'transparent',
                  color: on ? C.ink : '#9a9a9a',
                  border: `1px solid ${on ? '#fff' : 'rgba(255,255,255,.18)'}`,
                }}
              >
                {t(s.pt, s.en)}
              </button>
            )
          })}
        </div>

        {rows.length === 0 ? (
          <div style={{ background: C.panel, border: `1px solid ${C.line}`, padding: '48px 26px', textAlign: 'center' }}>
            <div style={{ font: `italic 800 clamp(24px,3vw,32px)/1 ${cond}`, color: C.text, textTransform: 'uppercase' }}>
              {t('Sem tempos para este filtro', 'No times for this filter')}
            </div>
            <p style={{ margin: '10px 0 0', font: `400 15px/1.5 ${body}`, color: C.muted }}>
              {t('Experimenta outro período ou categoria.', 'Try another period or category.')}
            </p>
          </div>
        ) : (
          <>
            {/* podium */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 14, marginBottom: 22 }}>
              {podium.map((r, i) => {
                const accent = rankColor(i)
                return (
                  <div key={r.name} style={{ position: 'relative', background: C.card, border: `1px solid ${C.line}`, borderTop: `3px solid ${accent}`, padding: '20px 22px', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', right: -6, top: -18, font: `italic 900 96px/1 ${cond}`, color: 'rgba(255,255,255,.05)' }}>{r.rank}</div>
                    <div style={{ position: 'relative', font: `700 11px/1 ${body}`, letterSpacing: '.2em', color: accent }}>{podiumTags[i]}</div>
                    <div style={{ position: 'relative', font: `italic 800 26px/1 ${cond}`, color: C.text, marginTop: 10 }}>{r.name}</div>
                    <div style={{ position: 'relative', font: `italic 900 40px/1 ${cond}`, color: C.yellow, marginTop: 8 }}>
                      {fmtLap(r.ms)}<span style={{ fontSize: 20, color: '#9a9a9a' }}>s</span>
                    </div>
                    <div style={{ position: 'relative', font: `500 13px/1.4 ${body}`, color: C.dim, marginTop: 8 }}>
                      {r.cls}cc · {catLabel(r.cat)} · {en ? r.dateEn : r.date}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* full table */}
            <div style={{ background: C.panel, border: `1px solid ${C.line}` }}>
              <div style={{ display: 'grid', gridTemplateColumns: GRID, gap: 8, padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,.1)', font: `700 11px/1 ${body}`, letterSpacing: '.16em', color: C.faint }}>
                <span>POS</span>
                <span>{t('PILOTO', 'DRIVER')}</span>
                <span>{t('MELHOR VOLTA', 'BEST LAP')}</span>
                <span>KART</span>
                <span>GAP</span>
                <span style={{ textAlign: 'right' }}>{t('VOLTAS', 'LAPS')}</span>
              </div>
              {rows.map((r, i) => (
                <div key={r.name} style={{ display: 'grid', gridTemplateColumns: GRID, gap: 8, alignItems: 'center', padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,.06)', background: r.isLeader ? 'rgba(255,210,0,.05)' : 'transparent' }}>
                  <span style={{ font: `italic 900 22px/1 ${cond}`, color: rankColor(i) }}>{r.rank}</span>
                  <span style={{ font: `600 16px/1.2 ${body}`, color: C.text }}>
                    {r.name}{' '}
                    {r.cat === 'junior' && <span style={{ font: `500 12px ${body}`, color: C.faint }}>JR</span>}
                  </span>
                  <span style={{ font: `800 20px/1 ${cond}`, color: C.yellow }}>
                    {fmtLap(r.ms)}<span style={{ fontSize: 13, color: '#8a8a8a' }}>s</span>
                  </span>
                  <span style={{ font: `600 13px/1 ${body}`, color: '#c9c9c9' }}>{r.cls}cc</span>
                  <span style={{ font: `600 14px/1 ${cond}`, color: '#9a9a9a' }}>{r.gap}</span>
                  <span style={{ font: `600 15px/1 ${body}`, color: '#c9c9c9', textAlign: 'right' }}>{r.laps}</span>
                </div>
              ))}
              <div style={{ padding: '14px 20px', font: `400 12px/1.5 ${body}`, color: C.faint }}>
                {t(
                  'Cronometragem oficial Kartódromo Vila Real. Tempos sujeitos a verificação.',
                  'Official Kartódromo Vila Real timing. Times subject to verification.',
                )}
              </div>
            </div>

            {/* CTA band */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginTop: 22, background: C.yellow, padding: '22px 26px' }}>
              <div style={{ font: `italic 900 clamp(24px,3vw,34px)/1 ${cond}`, color: C.ink, textTransform: 'uppercase' }}>
                {t('Queres o teu nome aqui?', 'Want your name up here?')}
              </div>
              <Link href="/portal/registo" style={{ font: `800 15px/1 ${cond}`, letterSpacing: '.1em', padding: '15px 24px', background: C.ink, color: C.yellow, textDecoration: 'none', whiteSpace: 'nowrap' }}>
                {t('CRIAR PERFIL DE PILOTO', 'CREATE A DRIVER PROFILE')}
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
