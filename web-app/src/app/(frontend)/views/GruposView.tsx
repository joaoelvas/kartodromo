'use client'
import { C, cond, body } from '@/lib/styles'
import { useT } from '@/lib/lang'
import { Hero } from '../components/Hero'
import { SectionTitle, PriceRow } from '../components/ui'
import { BookButton } from '../components/Header'

const HERO = 'https://www.kartodromovilareal.com/themes/kartodromo/images/assets/db-img/edited/asfalto2.png'
const SUMO = 'https://www.kartodromovilareal.com/sites/default/files/2019-06/sumo-wrestle_0.png'
const CASTELO = 'https://www.kartodromovilareal.com/sites/default/files/2019-06/castelo.png'
const BUBBLE = 'https://www.kartodromovilareal.com/sites/default/files/2019-06/destaque-bubble-soccer.png'

export function GruposView({ group }: { group: any[] }) {
  const t = useT()
  return (
    <>
      <Hero
        eyebrowPt="EM GRUPO É OUTRA CENA"
        eyebrowEn="EVERYTHING'S BETTER IN A GROUP"
        title={t('Grupos & Empresas', 'Groups & Companies')}
        introPt="Evento de amigos, despedida de solteiro/a ou evento de empresa — além do karting e LaserGame, há SumoWrestling e Bubble Soccer. Podes alugar sala e juntar catering. Liga-nos e montamos um evento à medida."
        introEn="Friends' meetup, stag/hen party or company event — beyond karting and LaserGame there's SumoWrestling and Bubble Soccer. Rent a room and add catering. Call us and we'll build a custom event."
        image={HERO}
        ctaPt="PEDIR PROPOSTA"
        ctaEn="GET A QUOTE"
        activity="grupos"
      />

      {/* MORE ACTIVITIES */}
      <div style={{ padding: '48px clamp(20px,4vw,48px)', background: C.panel }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <SectionTitle pt="Mais atividades" en="More activities" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 18 }}>
            <ActCard img={SUMO} title="SUMO WRESTLING" descPt="Fatos para adultos e crianças." descEn="Suits for adults and kids." />
            <ActCard img={CASTELO} title={t('CASTELO INSUFLÁVEL', 'BOUNCY CASTLE')} descPt="Saltitão e escorrega, perfeito para os mais pequenos." descEn="Bounce and slide, perfect for the little ones." />
            <ActCard img={BUBBLE} title="BUBBLE SOCCER" badge={t('BREVEMENTE', 'COMING SOON')} descPt="Futebol dentro de bolhas gigantes." descEn="Football inside giant bubbles." />
          </div>
        </div>
      </div>

      {/* PRICING + LASER GROUP CTA */}
      <div style={{ padding: '48px clamp(20px,4vw,48px)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(340px,1fr))', gap: 40 }}>
          <div>
            <h3 style={{ margin: '0 0 6px', font: `italic 800 32px/1 ${cond}`, color: C.text }}>{t('CORRIDAS DE GRUPO', 'GROUP RACES')}</h3>
            <p style={{ margin: '0 0 16px', font: `400 13px/1.5 ${body}`, color: C.faint }}>{t('Qualificação + corrida, kart 390cc, preço por kart · mínimo 8 pilotos', 'Qualifying + race, 390cc kart, price per kart · minimum 8 drivers')}</p>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {group.map((p, i) => (
                <PriceRow key={p.id} pt={`${p.label} · ${p.duration}`} en={`${p.labelEn || p.label} · ${p.duration}`} price={p.price} last={i === group.length - 1} />
              ))}
            </div>
          </div>
          <div style={{ position: 'relative', overflow: 'hidden', background: C.yellow, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 14, padding: '40px clamp(20px,3vw,40px)' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 14, background: 'repeating-conic-gradient(#0c0c0d 0 25%,transparent 0 50%) 0 0/14px 14px' }} />
            <h3 style={{ margin: 0, font: `italic 900 38px/1 ${cond}`, color: C.ink, textTransform: 'uppercase' }}>{t('LaserGame para grupos', 'LaserGame for groups')}</h3>
            <p style={{ margin: 0, font: `500 16px/1.5 ${body}`, color: '#1d1d1d', maxWidth: 420 }}>
              {t('1 hora ilimitada para 8 a 30 jogadores por 250€. Junta sala, jolas e croquetes — nós tratamos do resto.', '1 unlimited hour for 8–30 players for €250. Add a room, beers and snacks — we handle the rest.')}
            </p>
            <BookButton pt="MONTAR O MEU EVENTO" en="BUILD MY EVENT" activity="grupos" variant="dark" />
          </div>
        </div>
      </div>
    </>
  )
}

function ActCard({ img, title, descPt, descEn, badge }: { img: string; title: string; descPt: string; descEn: string; badge?: string }) {
  const t = useT()
  return (
    <div style={{ background: C.card, border: `1px solid ${C.line}`, display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(closest-side,rgba(255,210,0,.14),transparent 75%)' }}>
        <img src={img} alt={title} style={{ maxHeight: 130, maxWidth: '88%' }} />
      </div>
      <div style={{ padding: '16px 18px 20px', borderTop: `2px solid ${C.yellow}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span style={{ font: `italic 800 24px/1 ${cond}`, color: C.text }}>{title}</span>
          {badge && (
            <span style={{ font: `700 10px/1 ${body}`, letterSpacing: '.12em', padding: '4px 7px', background: 'rgba(255,210,0,.15)', color: C.yellow }}>{badge}</span>
          )}
        </div>
        <div style={{ font: `400 13px/1.5 ${body}`, color: C.dim, marginTop: 6 }}>{t(descPt, descEn)}</div>
      </div>
    </div>
  )
}
