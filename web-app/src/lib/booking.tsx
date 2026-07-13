'use client'
import { createContext, useContext, useMemo, useState } from 'react'
import { C, cond, body, clipL } from './styles'
import { useLang, useT } from './lang'

export type Settings = {
  phone?: string
  whatsapp?: string
  email?: string
  address?: string
  hours?: string
  hoursEn?: string
  social?: { facebook?: string; instagram?: string; youtube?: string }
}

type ActivityKey = 'karting' | 'lasergame' | 'grupos' | 'aniversario'

const BookingCtx = createContext<{ open: (a?: ActivityKey) => void }>({ open: () => {} })
export const useBooking = () => useContext(BookingCtx)

const ACTS: { key: ActivityKey; pt: string; en: string; sub: string; subEn: string }[] = [
  { key: 'karting', pt: 'Karting', en: 'Karting', sub: 'desde 25€ / 13 min', subEn: 'from €25 / 13 min' },
  { key: 'lasergame', pt: 'LaserGame', en: 'LaserGame', sub: '7€ por jogo', subEn: '€7 per game' },
  { key: 'grupos', pt: 'Evento de grupo', en: 'Group event', sub: 'mín. 8 pessoas', subEn: 'min. 8 people' },
  { key: 'aniversario', pt: 'Aniversário', en: 'Birthday', sub: 'packs 250€ / 350€', subEn: 'packages €250 / €350' },
]
const TIMES = ['10:30', '11:30', '14:30', '16:00', '17:30', '18:30']

export function BookingProvider({
  settings,
  children,
}: {
  settings: Settings
  children: React.ReactNode
}) {
  const [openState, setOpen] = useState(false)
  const [act, setAct] = useState<ActivityKey>('karting')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [people, setPeople] = useState(4)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [sent, setSent] = useState(false)

  const { lang } = useLang()
  const t = useT()

  const open = (a?: ActivityKey) => {
    if (a) setAct(a)
    setSent(false)
    setOpenState(true)
  }
  function setOpenState(v: boolean) {
    setOpen(v)
  }

  const actLabel = useMemo(() => {
    const a = ACTS.find((x) => x.key === act) || ACTS[0]
    return lang === 'en' ? a.en : a.pt
  }, [act, lang])

  const d = date || (lang === 'en' ? '(date)' : '(data)')
  const tm = time || (lang === 'en' ? '(time)' : '(hora)')
  const nm = name || (lang === 'en' ? '(name)' : '(nome)')

  const waMsg =
    lang === 'en'
      ? `Hi! I would like to book ${actLabel} for ${people} people on ${d} at ${tm}.\nName: ${nm}${phone ? `\nPhone: ${phone}` : ''}`
      : `Olá! Queria reservar ${actLabel} para ${people} pessoas no dia ${d} às ${tm}.\nNome: ${nm}${phone ? `\nTelefone: ${phone}` : ''}`

  const waNum = (settings.whatsapp || '351920268289').replace(/\D/g, '')
  const waHref = `https://wa.me/${waNum}?text=${encodeURIComponent(waMsg)}`

  async function submit() {
    // Persist the booking request to Payload, then open WhatsApp.
    try {
      await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, activity: act, date, time, people }),
      })
    } catch {}
    setSent(true)
    window.open(waHref, '_blank')
  }

  return (
    <BookingCtx.Provider value={{ open }}>
      {children}
      {openState && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: 'rgba(0,0,0,.72)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            overflow: 'auto',
            padding: '4vh 16px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: 860,
              background: C.panel,
              border: `1px solid ${C.lineStrong}`,
              borderTop: `3px solid ${C.yellow}`,
              marginBottom: '6vh',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '20px 28px',
                borderBottom: `1px solid ${C.line}`,
              }}
            >
              <h2 style={{ margin: 0, font: `italic 900 34px/1 ${cond}`, color: C.text, textTransform: 'uppercase' }}>
                {t('Reservar', 'Book now')}
              </h2>
              <button
                onClick={() => setOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', font: `700 14px/1 ${body}`, color: C.faint, padding: 8 }}
              >
                ✕ {t('Fechar', 'Close')}
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))' }}>
              {/* left: form */}
              <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>
                <Field label={t('1 · Atividade', '1 · Activity')}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    {ACTS.map((a) => {
                      const on = act === a.key
                      return (
                        <button
                          key={a.key}
                          onClick={() => setAct(a.key)}
                          style={{
                            textAlign: 'left',
                            cursor: 'pointer',
                            padding: '12px 14px',
                            background: C.card,
                            border: `1px solid ${on ? C.yellow : C.line}`,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                          }}
                        >
                          <span style={{ font: `800 17px ${cond}`, color: on ? C.yellow : C.text }}>
                            {lang === 'en' ? a.en : a.pt}
                          </span>
                          <span style={{ font: `400 11.5px ${body}`, color: C.faint }}>
                            {lang === 'en' ? a.subEn : a.sub}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </Field>

                <Field label={t('2 · Quando', '2 · When')}>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    style={{ ...inputStyle, colorScheme: 'dark' }}
                  />
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
                    {TIMES.map((x) => {
                      const on = time === x
                      return (
                        <button
                          key={x}
                          onClick={() => setTime(x)}
                          style={{
                            cursor: 'pointer',
                            font: `700 14px/1 ${body}`,
                            padding: '10px 14px',
                            background: on ? C.yellow : C.card,
                            color: on ? C.ink : C.text,
                            border: `1px solid ${on ? C.yellow : C.lineStrong}`,
                          }}
                        >
                          {x}
                        </button>
                      )
                    })}
                  </div>
                </Field>

                <Field label={t('3 · Quantos', '3 · How many')}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <Stepper onClick={() => setPeople((p) => Math.max(1, p - 1))}>−</Stepper>
                    <span style={{ font: `italic 900 36px ${cond}`, color: C.text, minWidth: 52, textAlign: 'center' }}>
                      {people}
                    </span>
                    <Stepper onClick={() => setPeople((p) => Math.min(30, p + 1))}>+</Stepper>
                    <span style={{ font: `400 13px ${body}`, color: C.faint }}>{t('pessoas', 'people')}</span>
                  </div>
                </Field>

                <Field label={t('4 · Contacto', '4 · Contact')}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t('O teu nome', 'Your name')}
                      style={inputStyle}
                    />
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={t('O teu telefone (opcional)', 'Your phone (optional)')}
                      style={inputStyle}
                    />
                  </div>
                </Field>
              </div>

              {/* right: summary */}
              <div
                style={{
                  padding: '24px 28px',
                  background: C.ink,
                  borderLeft: `1px solid ${C.line}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                }}
              >
                <div style={{ font: `700 12px/1 ${body}`, letterSpacing: '.18em', color: C.faint }}>
                  {t('Resumo — mensagem WhatsApp', 'Summary — WhatsApp message')}
                </div>
                <div
                  style={{
                    background: '#132a1e',
                    border: '1px solid rgba(80,200,120,.25)',
                    borderRadius: 10,
                    padding: '16px 18px',
                    font: `400 14.5px/1.6 ${body}`,
                    color: '#d8efe2',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {waMsg}
                </div>
                <button
                  onClick={submit}
                  style={{
                    cursor: 'pointer',
                    font: `800 18px/1 ${cond}`,
                    letterSpacing: '.08em',
                    padding: '18px 20px',
                    background: C.yellow,
                    color: C.ink,
                    border: 'none',
                    clipPath: clipL,
                  }}
                >
                  {t('Enviar por WhatsApp →', 'Send via WhatsApp →')}
                </button>
                {sent && (
                  <div style={{ font: `600 13px/1.5 ${body}`, color: '#7fdca6' }}>
                    {t('Pedido registado! Confirma no WhatsApp.', 'Request saved! Confirm on WhatsApp.')}
                  </div>
                )}
                <div style={{ font: `400 12px/1.6 ${body}`, color: C.faint }}>
                  {t(
                    'Abre o WhatsApp com a mensagem pré-preenchida. Sem pagamento online — a reserva é confirmada por mensagem.',
                    'Opens WhatsApp with the message pre-filled. No online payment — bookings are confirmed by message.',
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </BookingCtx.Provider>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '12px 14px',
  background: C.card,
  border: `1px solid ${C.lineStrong}`,
  color: C.text,
  font: `500 15px ${body}`,
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ font: `700 12px/1 ${body}`, letterSpacing: '.18em', color: C.yellow, marginBottom: 10 }}>
        {label}
      </div>
      {children}
    </div>
  )
}

function Stepper({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        cursor: 'pointer',
        width: 44,
        height: 44,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: C.card,
        border: `1px solid ${C.lineStrong}`,
        color: C.text,
        font: `700 22px ${body}`,
      }}
    >
      {children}
    </button>
  )
}
