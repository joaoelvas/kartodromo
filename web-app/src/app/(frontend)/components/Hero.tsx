'use client'
import { C, cond, body, stripes } from '@/lib/styles'
import { useT } from '@/lib/lang'
import { Eyebrow } from './ui'
import { BookButton } from './Header'

export function Hero({
  eyebrowPt,
  eyebrowEn,
  title,
  introPt,
  introEn,
  image,
  imageMax = 560,
  ctaPt,
  ctaEn,
  activity,
}: {
  eyebrowPt: string
  eyebrowEn: string
  title: string
  introPt: string
  introEn: string
  image: string
  imageMax?: number
  ctaPt: string
  ctaEn: string
  activity?: 'karting' | 'lasergame' | 'grupos' | 'aniversario'
}) {
  const t = useT()
  return (
    <div style={{ position: 'relative', overflow: 'hidden', borderBottom: `1px solid ${C.line}` }}>
      <div style={stripes} />
      <div
        style={{
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))',
          gap: 24,
          alignItems: 'center',
          padding: 'clamp(28px,4vw,48px) clamp(20px,4vw,48px)',
          maxWidth: 1280,
          margin: '0 auto',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Eyebrow pt={eyebrowPt} en={eyebrowEn} />
          <h1 style={{ margin: 0, font: `italic 900 clamp(56px,7vw,84px)/.92 ${cond}`, color: C.text, textTransform: 'uppercase' }}>
            {title}
          </h1>
          <p style={{ margin: 0, maxWidth: 480, font: `400 16px/1.55 ${body}`, color: C.muted }}>{t(introPt, introEn)}</p>
          <BookButton pt={ctaPt} en={ctaEn} activity={activity} />
        </div>
        <img
          src={image}
          alt={title}
          style={{ width: '100%', maxWidth: imageMax, justifySelf: 'center', filter: 'drop-shadow(0 24px 32px rgba(0,0,0,.5))' }}
        />
      </div>
    </div>
  )
}
