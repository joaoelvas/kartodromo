import { ImageResponse } from 'next/og'
import { getPayloadClient } from '@/lib/payload'
import type { Invite } from '../../InviteView'

export const alt = 'Convite — Kartódromo Vila Real'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Brand colors (kept inline — satori doesn't read our token module at render time).
const INK = '#0c0c0d'
const YELLOW = '#FFD200'

async function loadFont(url: string): Promise<ArrayBuffer | null> {
  try {
    const res = await fetch(url)
    if (!res.ok) return null
    return await res.arrayBuffer()
  } catch {
    return null
  }
}

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'invites',
    where: { slug: { equals: id } },
    limit: 1,
  })
  const invite = res.docs[0] as Invite | undefined

  // Barlow Condensed ExtraBold for the display type; falls back to the built-in
  // font if the fetch fails so the image always renders.
  const displayFont = await loadFont(
    'https://raw.githubusercontent.com/google/fonts/main/ofl/barlowcondensed/BarlowCondensed-ExtraBold.ttf',
  )
  const fonts = displayFont
    ? [{ name: 'Barlow Condensed', data: displayFont, weight: 800 as const, style: 'normal' as const }]
    : []
  const fontFamily = displayFont ? 'Barlow Condensed' : undefined

  const childName = invite?.childName ?? 'Kartódromo Vila Real'
  const age = invite?.age
  const dateLine = invite ? `${invite.dateText} · ${invite.timeText}` : 'Passe de pista · Convidado VIP'

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          background: INK,
          fontFamily,
        }}
      >
        {/* top strip */}
        <div style={{ display: 'flex', height: 14, background: YELLOW }} />

        {/* header band */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            background: YELLOW,
            padding: '34px 56px 30px',
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: 26,
              fontWeight: 700,
              letterSpacing: 6,
              color: INK,
            }}
          >
            🏁 PASSE DE PISTA · CONVIDADO VIP
          </div>
          <div
            style={{
              display: 'flex',
              marginTop: 10,
              fontSize: 68,
              fontWeight: 800,
              color: INK,
              textTransform: 'uppercase',
            }}
          >
            Estás na grelha!
          </div>
        </div>

        {/* body */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            alignItems: 'center',
            justifyContent: 'center',
            padding: '30px 56px',
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: 150,
              fontWeight: 800,
              color: '#fff',
              textTransform: 'uppercase',
              lineHeight: 1,
              textAlign: 'center',
            }}
          >
            {childName}
          </div>

          {age != null && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                marginTop: 24,
                padding: '10px 28px',
                border: `2px solid rgba(255,210,0,.5)`,
                borderRadius: 8,
                fontSize: 40,
              }}
            >
              <span style={{ color: '#7d7d7d', letterSpacing: 4 }}>FAZ</span>
              <span style={{ color: YELLOW, fontWeight: 800 }}>{age}</span>
            </div>
          )}

          <div style={{ display: 'flex', marginTop: 26, fontSize: 38, color: '#b9b9b9' }}>
            {dateLine}
          </div>
        </div>

        {/* footer strip */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '22px 56px 30px',
            borderTop: `1px solid rgba(255,255,255,.12)`,
            fontSize: 24,
            letterSpacing: 4,
            color: '#7d7d7d',
          }}
        >
          KARTÓDROMO VILA REAL · AERÓDROMO OESTE
        </div>
      </div>
    ),
    { ...size, fonts },
  )
}
