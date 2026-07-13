'use client'
import { C, cond, body } from '@/lib/styles'
import { useT } from '@/lib/lang'
import { Hero } from '../components/Hero'
import { SectionTitle, PriceRow } from '../components/ui'

const HERO = 'https://www.kartodromovilareal.com/sites/default/files/2019-06/banner-kart-2.png'
const PISTA = 'https://www.kartodromovilareal.com/sites/default/files/2019-06/pista.png'

export function KartingView({ karts, indiv, group }: { karts: any[]; indiv: any[]; group: any[] }) {
  const t = useT()
  const imgOf = (k: any) => k.imageUrl || (k.image && typeof k.image === 'object' ? k.image.url : '')
  const races = karts.filter((k) => k.fleet === 'races')
  const experiences = karts.filter((k) => k.fleet === 'experiences')

  return (
    <>
      <Hero
        eyebrowPt="PISTA CATEGORIA 1 · KARTS TOPO DE GAMA"
        eyebrowEn="CATEGORY 1 TRACK · TOP-RANGE KARTS"
        title="Karting"
        introPt="Atividade para todos: fornecemos todo o equipamento e explicamos tudo o que precisas de saber. Crianças até aos 16 anos andam em kart bi-lugar."
        introEn="An activity for everyone: we provide all the gear and explain everything you need to know. Kids under 16 ride in 2-seater karts."
        image={HERO}
        ctaPt="RESERVAR SESSÃO"
        ctaEn="BOOK A SESSION"
        activity="karting"
      />

      {/* FLEET */}
      <div style={{ padding: '48px clamp(20px,4vw,48px)', background: C.panel }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <SectionTitle pt="Frota" en="The fleet" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 18 }}>
            {races.map((k) => (
              <KartCard key={k.id} name={k.cc || k.name} sub={k.model} img={imgOf(k)} accent />
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 18, marginTop: 18 }}>
            {experiences.map((k) => (
              <KartCard key={k.id} name={k.name} sub={k.lowSeason ? t('época baixa', 'low season') : ''} img={imgOf(k)} />
            ))}
          </div>
        </div>
      </div>

      {/* TRACK */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(340px,1fr))', borderTop: `1px solid ${C.line}` }}>
        <div style={{ padding: '44px clamp(20px,4vw,48px)', display: 'flex', flexDirection: 'column', gap: 14, justifyContent: 'center' }}>
          <h2 style={{ margin: 0, font: `italic 800 clamp(30px,4vw,42px)/1 ${cond}`, color: C.text, textTransform: 'uppercase' }}>
            {t('A pista', 'The track')}
          </h2>
          <p style={{ margin: 0, font: `400 16px/1.6 ${body}`, color: C.muted, maxWidth: 480 }}>
            {t(
              'Uma pista muito técnica com 1 km de comprimento e categoria 1 — fácil de aprender, muito difícil de aperfeiçoar. Desenhada para o espetáculo: com largura mínima de 10 metros, é fácil ultrapassar em toda a pista.',
              'A highly technical 1 km category 1 track — easy to learn, very hard to master. Designed for the show: with a minimum width of 10 metres you can overtake anywhere.',
            )}
          </p>
          <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap', marginTop: 8 }}>
            <Stat big="1 KM" pt="COMPRIMENTO" en="LENGTH" />
            <Stat big="10 M" pt="LARGURA MÍN." en="MIN. WIDTH" />
            <Stat big="CAT 1" pt="CATEGORIA" en="CATEGORY" />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'radial-gradient(closest-side,rgba(255,210,0,.1),transparent 80%)' }}>
          <img src={PISTA} alt={t('Traçado da pista', 'Track layout')} style={{ width: '100%', maxWidth: 520 }} />
        </div>
      </div>

      {/* PRICING */}
      <div style={{ padding: '48px clamp(20px,4vw,48px)', background: C.panel, borderTop: `1px solid ${C.line}` }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(340px,1fr))', gap: 40 }}>
          <div>
            <h3 style={{ margin: '0 0 6px', font: `italic 800 32px/1 ${cond}`, color: C.text }}>{t('PREÇÁRIO INDIVIDUAL', 'INDIVIDUAL PRICES')}</h3>
            <p style={{ margin: '0 0 16px', font: `400 13px/1.5 ${body}`, color: C.faint }}>{t('Preços 2026 · Basta aparecer', '2026 prices · Just show up')}</p>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {indiv.map((p, i) => (
                <PriceRow key={p.id} pt={`${p.label} · ${p.duration}`} en={`${p.labelEn || p.label} · ${p.duration}`} price={p.price} last={i === indiv.length - 1} />
              ))}
            </div>
            <p style={{ margin: '14px 0 0', font: `400 12.5px/1.6 ${body}`, color: C.faint }}>
              {t('Crianças até aos 16 anos apenas em karts bi-lugar.', 'Children under 16 in 2-seater karts only.')}
            </p>
          </div>
          <div>
            <h3 style={{ margin: '0 0 6px', font: `italic 800 32px/1 ${cond}`, color: C.text }}>{t('CORRIDAS DE GRUPO', 'GROUP RACES')}</h3>
            <p style={{ margin: '0 0 16px', font: `400 13px/1.5 ${body}`, color: C.faint }}>{t('Kart 390cc · preço por kart', '390cc kart · price per kart')}</p>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {group.map((p, i) => (
                <PriceRow key={p.id} pt={`${p.label} · ${p.duration}`} en={`${p.labelEn || p.label} · ${p.duration}`} price={p.price} last={i === group.length - 1} />
              ))}
            </div>
            <p style={{ margin: '14px 0 0', font: `400 12.5px/1.6 ${body}`, color: C.faint }}>
              {t('Mínimo 8 pilotos · Por marcação (48h) · Oferta de cerimónia de pódio, medalhas e espumante.', 'Minimum 8 drivers · Booking required (48h) · Podium ceremony, medals and sparkling wine included.')}
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

function KartCard({ name, sub, img, accent }: { name: string; sub?: string; img: string; accent?: boolean }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.line}`, padding: 20, display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
      {img && <img src={img} alt={name} style={{ maxHeight: 110, maxWidth: '100%' }} />}
      <div style={{ font: `italic 800 ${accent ? 28 : 22}px/1 ${cond}`, color: accent ? C.yellow : C.text, textTransform: 'uppercase', textAlign: 'center' }}>
        {name}
      </div>
      {sub && <div style={{ font: `400 13px/1.4 ${body}`, color: C.dim }}>{sub}</div>}
    </div>
  )
}

function Stat({ big, pt, en }: { big: string; pt: string; en: string }) {
  const t = useT()
  return (
    <div>
      <div style={{ font: `italic 900 40px/1 ${cond}`, color: C.yellow }}>{big}</div>
      <div style={{ font: `600 12px/1.4 ${body}`, letterSpacing: '.14em', color: C.faint }}>{t(pt, en)}</div>
    </div>
  )
}
