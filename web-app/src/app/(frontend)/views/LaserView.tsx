'use client'
import { C, cond, body } from '@/lib/styles'
import { useT } from '@/lib/lang'
import { Hero } from '../components/Hero'
import { SectionTitle, PriceRow } from '../components/ui'

const HERO = 'https://www.kartodromovilareal.com/sites/default/files/2019-07/laser-girl.png'

const HOW = [
  { pt: 'Joga-se com armadura e arma. Vivo = luzes ligadas; eliminado = luzes desligadas.', en: 'Play with a vest and a gun. Alive = lights on; hit = lights off.' },
  { pt: 'Acerta no peito, ombros, costas ou arma do adversário para marcar pontos.', en: "Hit your opponent's chest, shoulders, back or gun to score points." },
  { pt: 'Cada eliminação dá pontos especiais (SPs) que ativam poderes: metralhadora, míssil, invencibilidade, bomba atómica…', en: 'Each frag earns special points (SPs) that unlock powers: machine gun, missile, invincibility, atomic bomb…' },
  { pt: 'Destrói a base adversária para 1001 pontos — mas defende a tua. Até 6 equipas em simultâneo.', en: 'Destroy the enemy base for 1001 points — but defend yours. Up to 6 teams at once.' },
]

export function LaserView({ modes, pricing }: { modes: any[]; pricing: any[] }) {
  const t = useT()
  return (
    <>
      <Hero
        eyebrowPt="ARENA INDOOR · ATÉ 30 JOGADORES"
        eyebrowEn="INDOOR ARENA · UP TO 30 PLAYERS"
        title="LaserGame"
        introPt="Como paintball, mas sem dor e numa arena indoor — ideal para crianças e adultos. Equipamento, briefing, jogo de 8 min, resultados e ranking incluídos."
        introEn="Like paintball, but painless and indoors — great for kids and adults. Gear, briefing, 8-min game, results and ranking included."
        image={HERO}
        imageMax={420}
        ctaPt="RESERVAR JOGO"
        ctaEn="BOOK A GAME"
        activity="lasergame"
      />

      {/* HOW TO PLAY */}
      <div style={{ padding: '48px clamp(20px,4vw,48px)', background: C.panel }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <SectionTitle pt="Como jogar" en="How to play" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(250px,1fr))', gap: 18 }}>
            {HOW.map((h, i) => (
              <div key={i} style={{ background: C.card, border: `1px solid ${C.line}`, padding: 20 }}>
                <div style={{ font: `italic 900 30px/1 ${cond}`, color: C.yellow, marginBottom: 8 }}>{String(i + 1).padStart(2, '0')}</div>
                <div style={{ font: `400 14px/1.6 ${body}`, color: '#c9c9c9' }}>{t(h.pt, h.en)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* GAME MODES */}
      <div style={{ padding: '48px clamp(20px,4vw,48px)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <SectionTitle pt="Jogos" en="Game modes" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(250px,1fr))', gap: 18 }}>
            {modes.map((m) => {
              const adv = m.level === 'advanced'
              return (
                <div key={m.id} style={{ background: C.card, border: `1px solid ${C.line}`, borderTop: `2px solid ${adv ? '#fff' : C.yellow}`, padding: 20 }}>
                  <div style={{ font: `600 10.5px/1 ${body}`, letterSpacing: '.2em', color: C.faint, marginBottom: 8 }}>
                    {adv ? t('AVANÇADOS', 'ADVANCED') : t('INICIANTES', 'BEGINNERS')}
                  </div>
                  <div style={{ font: `italic 800 26px/1 ${cond}`, color: C.text, textTransform: 'uppercase' }}>{m.name}</div>
                  <div style={{ font: `400 13px/1.7 ${body}`, color: C.dim, marginTop: 8 }}>{t(m.description, m.descriptionEn)}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* PRICING */}
      <div style={{ padding: '48px clamp(20px,4vw,48px)', background: C.panel, borderTop: `1px solid ${C.line}` }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h3 style={{ margin: '0 0 6px', font: `italic 800 32px/1 ${cond}`, color: C.text }}>{t('PREÇÁRIO LASERGAME', 'LASERGAME PRICES')}</h3>
          <p style={{ margin: '0 0 16px', font: `400 13px/1.5 ${body}`, color: C.faint }}>
            {t('Experiência total 20–30 min: equipamento, briefing, jogo de 8 min, resultados e foto de equipa', 'Full 20–30 min experience: gear, briefing, 8-min game, results and team photo')}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {pricing.map((p, i) => (
              <PriceRow key={p.id} pt={`${p.label} · ${p.duration}`} en={`${p.labelEn || p.label} · ${p.duration}`} price={p.price} last={i === pricing.length - 1} />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
