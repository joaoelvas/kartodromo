'use client'
import { useEffect, useState } from 'react'
import { useLang, useT } from '@/lib/lang'
import { C, cond, body, clipL } from '@/lib/styles'

export type Invite = {
  slug: string
  childName: string
  age: number
  eventDate: string
  dateText: string
  dateTextEn?: string | null
  timeText: string
  packText: string
  packTextEn?: string | null
  hostPhone: string
}

const checker = 'repeating-conic-gradient(#fff 0 25%,#0c0c0d 0 50%) 0 0/16px 16px'
const pad = (n: number) => (n < 10 ? '0' + n : '' + n)

export function InviteView({ invite }: { invite: Invite }) {
  const { lang, setLang } = useLang()
  const t = useT()
  const en = lang === 'en'

  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const dateText = t(invite.dateText, invite.dateTextEn) || invite.dateText
  const packText = t(invite.packText, invite.packTextEn) || invite.packText

  // Countdown (clamped at 0, zero-padded).
  let diff = Math.max(0, new Date(invite.eventDate).getTime() - now)
  const d = Math.floor(diff / 86400000)
  diff -= d * 86400000
  const h = Math.floor(diff / 3600000)
  diff -= h * 3600000
  const m = Math.floor(diff / 60000)
  diff -= m * 60000
  const s = Math.floor(diff / 1000)

  const phone = invite.hostPhone.replace(/[^0-9]/g, '')
  const msg = en
    ? `Hi! We'll be at ${invite.childName}'s birthday at Kartódromo Vila Real on ${dateText}. 🏁`
    : `Olá! Vamos ao aniversário do/a ${invite.childName} no Kartódromo Vila Real dia ${dateText}. 🏁`
  const rsvpHref = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`

  const label: React.CSSProperties = {
    font: `700 11px/1 ${body}`,
    letterSpacing: '.2em',
    color: C.faint,
    alignSelf: 'center',
  }
  const value: React.CSSProperties = {
    font: `600 16px/1.3 ${body}`,
    color: C.text,
    textAlign: 'right',
  }
  const cdCaption: React.CSSProperties = {
    font: `600 10px/1 ${body}`,
    letterSpacing: '.16em',
    color: C.faint,
    marginTop: 5,
  }

  const langBtn = (active: boolean): React.CSSProperties => ({
    cursor: 'pointer',
    font: `700 11px/1 ${body}`,
    padding: '7px 10px',
    background: active ? C.yellow : 'transparent',
    color: active ? C.ink : C.text,
    border: 'none',
  })

  const cell = (val: string, caption: string, yellow?: boolean) => (
    <div
      style={{
        background: C.ink,
        border: `1px solid rgba(255,255,255,.1)`,
        padding: '12px 4px',
        textAlign: 'center',
      }}
    >
      <div style={{ font: `italic 900 32px/1 ${cond}`, color: yellow ? C.yellow : C.text }}>{val}</div>
      <div style={cdCaption}>{caption}</div>
    </div>
  )

  return (
    <div
      style={{
        minHeight: '100vh',
        background: C.ink,
        color: C.text,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '24px 16px 56px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* diagonal track texture */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'repeating-linear-gradient(115deg,transparent 0 320px,rgba(255,210,0,.05) 320px 400px)',
          pointerEvents: 'none',
        }}
      />

      {/* lang toggle */}
      <div
        style={{
          position: 'relative',
          alignSelf: 'flex-end',
          display: 'flex',
          border: `1px solid ${C.lineStrong}`,
          borderRadius: 4,
          overflow: 'hidden',
          marginBottom: 16,
        }}
      >
        <button onClick={() => setLang('pt')} style={langBtn(!en)}>
          PT
        </button>
        <button onClick={() => setLang('en')} style={langBtn(en)}>
          EN
        </button>
      </div>

      {/* ============ THE PASS ============ */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 520,
          background: '#141416',
          border: `1px solid rgba(255,255,255,.1)`,
          boxShadow: '0 40px 80px rgba(0,0,0,.6)',
        }}
      >
        {/* top checkered strip */}
        <div style={{ height: 16, background: checker }} />

        {/* header band */}
        <div style={{ position: 'relative', padding: '26px 28px 22px', background: C.yellow, overflow: 'hidden' }}>
          <div
            style={{
              position: 'absolute',
              right: -30,
              top: -30,
              width: 140,
              height: 140,
              background: 'repeating-conic-gradient(#0c0c0d 0 25%,transparent 0 50%) 0 0/18px 18px',
              opacity: 0.12,
            }}
          />
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                width: 30,
                height: 11,
                background: 'repeating-conic-gradient(#0c0c0d 0 25%,#FFD200 0 50%) 0 0/6px 6px',
                border: '1px solid rgba(0,0,0,.4)',
                animation: 'flagpulse 1.4s ease-in-out infinite',
              }}
            />
            <span style={{ font: `700 12px/1 ${body}`, letterSpacing: '.28em', color: C.ink }}>
              {t('PASSE DE PISTA · CONVIDADO VIP', 'TRACK PASS · VIP GUEST')}
            </span>
          </div>
          <div
            style={{
              position: 'relative',
              font: `italic 900 clamp(38px,10vw,54px)/.9 ${cond}`,
              color: C.ink,
              textTransform: 'uppercase',
              marginTop: 14,
            }}
          >
            {t('Estás na grelha!', "You're on the grid!")}
          </div>
          <div style={{ position: 'relative', font: `600 15px/1.4 ${body}`, color: '#1d1d1d', marginTop: 6 }}>
            {t('Aniversário de', 'Birthday party for')}
          </div>
        </div>

        {/* name + age */}
        <div style={{ padding: '28px 28px 10px', textAlign: 'center' }}>
          <div
            style={{
              font: `italic 900 clamp(52px,15vw,84px)/.88 ${cond}`,
              color: C.text,
              textTransform: 'uppercase',
              textWrap: 'balance',
            }}
          >
            {invite.childName}
          </div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'baseline',
              gap: 10,
              marginTop: 12,
              padding: '8px 18px',
              border: '1px solid rgba(255,210,0,.4)',
              background: 'rgba(255,210,0,.06)',
            }}
          >
            <span style={{ font: `600 12px/1 ${body}`, letterSpacing: '.22em', color: C.faint }}>
              {t('FAZ', 'TURNING')}
            </span>
            <span style={{ font: `italic 900 34px/1 ${cond}`, color: C.yellow }}>{invite.age}</span>
          </div>
        </div>

        {/* countdown */}
        <div style={{ padding: '22px 28px 4px' }}>
          <div
            style={{
              font: `700 11px/1 ${body}`,
              letterSpacing: '.24em',
              color: C.faint,
              textAlign: 'center',
              marginBottom: 12,
            }}
          >
            {t('CONTAGEM PARA A LARGADA', 'COUNTDOWN TO LIGHTS OUT')}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
            {cell(pad(d), t('DIAS', 'DAYS'))}
            {cell(pad(h), t('HORAS', 'HRS'))}
            {cell(pad(m), t('MIN', 'MIN'))}
            {cell(pad(s), t('SEG', 'SEC'), true)}
          </div>
        </div>

        {/* race card details */}
        <div style={{ padding: '24px 28px 8px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 14, padding: '14px 0', borderBottom: `1px solid rgba(255,255,255,.1)` }}>
            <span style={label}>{t('DATA', 'DATE')}</span>
            <span style={value}>{dateText}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 14, padding: '14px 0', borderBottom: `1px solid rgba(255,255,255,.1)` }}>
            <span style={label}>{t('HORA', 'TIME')}</span>
            <span style={value}>{invite.timeText}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 14, padding: '14px 0', borderBottom: `1px solid rgba(255,255,255,.1)` }}>
            <span style={label}>{t('LOCAL', 'WHERE')}</span>
            <span style={value}>
              Kartódromo Vila Real
              <br />
              <span style={{ font: `400 13px/1.3 ${body}`, color: C.dim }}>Aeródromo Oeste, Vila Real</span>
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 14, padding: '14px 0' }}>
            <span style={label}>{t('FESTA', 'PARTY')}</span>
            <span style={value}>{packText}</span>
          </div>
        </div>

        {/* perforation */}
        <div style={{ position: 'relative', height: 26, margin: '8px 0' }}>
          <div style={{ position: 'absolute', left: -9, top: '50%', transform: 'translateY(-50%)', width: 18, height: 18, borderRadius: '50%', background: C.ink }} />
          <div style={{ position: 'absolute', right: -9, top: '50%', transform: 'translateY(-50%)', width: 18, height: 18, borderRadius: '50%', background: C.ink }} />
          <div style={{ position: 'absolute', left: 14, right: 14, top: '50%', borderTop: `2px dashed ${C.lineStrong}` }} />
        </div>

        {/* RSVP stub */}
        <div style={{ padding: '6px 28px 30px', textAlign: 'center' }}>
          <div style={{ font: `400 14px/1.55 ${body}`, color: C.muted, maxWidth: 400, margin: '0 auto 18px' }}>
            {t(
              'Capacete, luvas e adrenalina por nossa conta. Confirma a tua presença para garantir o lugar na grelha.',
              'Helmet, gloves and adrenaline on us. Confirm your spot on the grid.',
            )}
          </div>
          <a
            href={rsvpHref}
            target="_blank"
            rel="noopener"
            style={{
              display: 'inline-block',
              cursor: 'pointer',
              font: `800 17px/1 ${cond}`,
              letterSpacing: '.1em',
              padding: '17px 34px',
              background: C.yellow,
              color: C.ink,
              textDecoration: 'none',
              clipPath: clipL,
            }}
          >
            {t('CONFIRMAR PRESENÇA', "RSVP — I'M IN")}
          </a>
          <div style={{ font: `600 13px/1 ${body}`, color: C.faint, marginTop: 14 }}>
            {t('ou liga', 'or call')}{' '}
            <a href="tel:+351920268289" style={{ textDecoration: 'none' }}>
              920 268 289
            </a>
          </div>
        </div>

        {/* bottom checkered strip */}
        <div style={{ height: 16, background: checker }} />
      </div>

      <div style={{ position: 'relative', font: `600 12px/1.5 ${body}`, color: '#555', marginTop: 22, textAlign: 'center' }}>
        Kartódromo Vila Real ·{' '}
        {t(
          'Passe pessoal e intransmissível... a não ser que partilhes 😉',
          'Personal pass — unless you feel like sharing 😉',
        )}
      </div>
    </div>
  )
}
