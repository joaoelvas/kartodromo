import Link from 'next/link'
import { C, cond, body } from '@/lib/styles'

export default function InviteNotFound() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: C.ink,
        color: C.text,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        padding: '24px 16px',
        textAlign: 'center',
      }}
    >
      <div style={{ font: `italic 900 clamp(48px,14vw,72px)/.9 ${cond}`, color: C.yellow, textTransform: 'uppercase' }}>
        Fora de pista
      </div>
      <div style={{ font: `400 15px/1.5 ${body}`, color: C.muted, maxWidth: 360 }}>
        Este convite não existe ou já não está disponível.
        <br />
        This invite doesn’t exist or is no longer available.
      </div>
      <Link href="/" style={{ font: `700 13px/1 ${body}`, letterSpacing: '.1em', color: C.yellow }}>
        Kartódromo Vila Real →
      </Link>
    </div>
  )
}
