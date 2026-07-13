'use client'
import { C, cond, body } from '@/lib/styles'
import { useT } from '@/lib/lang'
import { Hero } from '../components/Hero'
import { SectionTitle } from '../components/ui'

const HERO = 'https://www.kartodromovilareal.com/sites/default/files/2019-06/aniversario.png'

export function AniversariosView({ packages, extras }: { packages: any[]; extras: any[] }) {
  const t = useT()
  return (
    <>
      <Hero
        eyebrowPt="PACKS PARA ADULTOS, JOVENS E CRIANÇAS"
        eyebrowEn="PACKAGES FOR ADULTS, TEENS AND KIDS"
        title={t('Aniversários', 'Birthdays')}
        introPt="Festas de 2h30 com sala, música e diversões. Os pais podem trazer o bolo e a decoração — nós tratamos do resto."
        introEn="2h30 parties with a room, music and games. Parents can bring the cake and decorations — we handle the rest."
        image={HERO}
        imageMax={440}
        ctaPt="MARCAR FESTA"
        ctaEn="BOOK A PARTY"
        activity="aniversario"
      />

      {/* PACKAGES */}
      <div style={{ padding: '48px clamp(20px,4vw,48px)', background: C.panel }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <SectionTitle pt="Escolhe o teu pack" en="Pick your package" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 18 }}>
            {packages.map((p) => (
              <div
                key={p.id}
                style={{
                  position: 'relative',
                  background: C.card,
                  border: `1px solid ${p.highlight ? C.yellow : C.line}`,
                  padding: 28,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14,
                }}
              >
                {p.highlight && (
                  <div style={{ position: 'absolute', top: 0, right: 0, font: `700 10px/1 ${body}`, letterSpacing: '.14em', padding: '6px 10px', background: C.yellow, color: C.ink }}>
                    {t('MAIS POPULAR', 'MOST POPULAR')}
                  </div>
                )}
                <div style={{ font: `600 12px/1 ${body}`, letterSpacing: '.24em', color: C.faint }}>{p.name.toUpperCase()}</div>
                <div style={{ font: `italic 900 56px/1 ${cond}`, color: C.yellow }}>{p.price}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, font: `400 15px/1.5 ${body}`, color: '#c9c9c9' }}>
                  {(p.features || []).map((f: any, i: number) => (
                    <div key={i} style={{ display: 'flex', gap: 10 }}>
                      <span style={{ color: C.yellow }}>▸</span>
                      <span>{t(f.text, f.textEn)}</span>
                    </div>
                  ))}
                </div>
                {p.note && (
                  <div style={{ font: `400 12.5px/1.5 ${body}`, color: C.faint, marginTop: 'auto' }}>{t(p.note, p.noteEn)}</div>
                )}
              </div>
            ))}
          </div>
          <p style={{ margin: '16px 0 0', font: `400 12.5px/1.6 ${body}`, color: C.faint }}>
            {t(
              'Festas com duração de 2h30 · 20 pessoas incluídas · Lanche base: água, sumos, batatas fritas, pipocas, guloseimas e triângulos mistos.',
              '2h30 parties · 20 guests included · Basic snacks: water, juice, crisps, popcorn, sweets and mixed sandwiches.',
            )}
          </p>
        </div>
      </div>

      {/* EXTRAS */}
      <div style={{ padding: '48px clamp(20px,4vw,48px)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <SectionTitle pt="Extras" en="Extras" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '6px 40px' }}>
            {extras.map((e) => (
              <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '10px 0', borderBottom: `1px solid ${C.line}` }}>
                <span style={{ font: `500 15px ${body}`, color: '#ddd' }}>{t(e.label, e.labelEn)}</span>
                <span style={{ font: `800 17px ${cond}`, color: C.yellow }}>{e.price}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
