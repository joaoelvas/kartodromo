import type { Payload } from 'payload'
import { generateInviteId } from './collections/Invites'

const BASE = 'https://www.kartodromovilareal.com'

// Idempotent seed: only runs when the activities collection is empty.
export async function seed(payload: Payload): Promise<void> {
  // The demo invite is seeded independently so it appears even on already-populated DBs.
  await seedDemoInvite(payload)

  const existing = await payload.count({ collection: 'activities' })
  if (existing.totalDocs > 0) return

  payload.logger.info('🌱 Seeding Kartódromo content…')

  const activities = [
    {
      title: 'Karting', slug: 'karting', order: 1, priceFrom: '25€', showOnHome: true,
      eyebrow: 'Pista categoria 1 · karts topo de gama', eyebrowEn: 'Category 1 track · top-range karts',
      tagline: 'Pista categoria 1, karts topo de gama. Desde 25€.', taglineEn: 'Category 1 track, top-of-the-range karts. From €25.',
      intro: 'Atividade para todos: fornecemos todo o equipamento e explicamos tudo o que precisas de saber. Crianças até aos 16 anos andam em kart bi-lugar.',
      introEn: 'An activity for everyone: we provide all the gear and explain everything you need to know. Kids under 16 ride in 2-seater karts.',
      cardImageUrl: `${BASE}/sites/default/files/2019-05/kart_0.png`,
      heroImageUrl: `${BASE}/sites/default/files/2019-06/banner-kart-2.png`,
    },
    {
      title: 'LaserGame', slug: 'lasergame', order: 2, priceFrom: '7€', showOnHome: true,
      eyebrow: 'Arena indoor · até 30 jogadores', eyebrowEn: 'Indoor arena · up to 30 players',
      tagline: 'Arena indoor, até 30 jogadores. 7€ por jogo.', taglineEn: 'Indoor arena, up to 30 players. €7 per game.',
      intro: 'Como paintball, mas sem dor e numa arena indoor — ideal para crianças e adultos. Equipamento, briefing, jogo de 8 min, resultados e ranking incluídos.',
      introEn: 'Like paintball, but painless and indoors — great for kids and adults. Gear, briefing, 8-min game, results and ranking included.',
      cardImageUrl: `${BASE}/sites/default/files/2019-07/laser-girl.png`,
      heroImageUrl: `${BASE}/sites/default/files/2019-07/laser-girl.png`,
    },
    {
      title: 'Aniversários', slug: 'aniversarios', order: 3, priceFrom: '250€', showOnHome: true,
      eyebrow: 'Packs para adultos, jovens e crianças', eyebrowEn: 'Packages for adults, teens and kids',
      tagline: 'Packs 250€ / 350€, sala 2h30 com música.', taglineEn: 'Packages €250 / €350, 2h30 party room with music.',
      intro: 'Festas de 2h30 com sala, música e diversões. Os pais podem trazer o bolo e a decoração — nós tratamos do resto.',
      introEn: '2h30 parties with a room, music and games. Parents can bring the cake and decorations — we handle the rest.',
      cardImageUrl: `${BASE}/sites/default/files/2019-06/aniversario.png`,
      heroImageUrl: `${BASE}/sites/default/files/2019-06/aniversario.png`,
    },
    {
      title: 'Grupos', slug: 'grupos', order: 4, priceFrom: '45€', showOnHome: true,
      eyebrow: 'Em grupo é outra cena', eyebrowEn: "Everything's better in a group",
      tagline: 'Corridas com pódio, Sumo, eventos à medida.', taglineEn: 'Podium races, Sumo, tailor-made events.',
      intro: 'Evento de amigos, despedida de solteiro/a ou evento de empresa — além do karting e LaserGame, há SumoWrestling e Bubble Soccer. Podes alugar sala e juntar catering.',
      introEn: "Friends' meetup, stag/hen party or company event — beyond karting and LaserGame there's SumoWrestling and Bubble Soccer. Rent a room and add catering.",
      cardImageUrl: `${BASE}/sites/default/files/2019-06/sumo-wrestle_0.png`,
      heroImageUrl: `${BASE}/themes/kartodromo/images/assets/db-img/edited/asfalto2.png`,
    },
  ]
  for (const data of activities) await payload.create({ collection: 'activities', data })

  const karts = [
    { name: '390CC', cc: '390CC', model: 'EK16', fleet: 'races', order: 1, imageUrl: `${BASE}/sites/default/files/2019-06/EK16.png` },
    { name: '270CC', cc: '270CC', model: 'SODI SW270', fleet: 'races', order: 2, imageUrl: `${BASE}/sites/default/files/2019-06/270.png` },
    { name: '200CC', cc: '200CC', model: 'Dino', fleet: 'races', order: 3, imageUrl: `${BASE}/sites/default/files/2019-06/dino.png` },
    { name: 'Kart 2 lugares', fleet: 'experiences', order: 4, imageUrl: `${BASE}/sites/default/files/2019-06/SUPERBI.png` },
    { name: 'Kart criança', fleet: 'experiences', lowSeason: true, order: 5, imageUrl: `${BASE}/sites/default/files/2019-07/JUNIOR.png` },
    { name: 'Kart estudantes', fleet: 'experiences', lowSeason: true, order: 6, imageUrl: `${BASE}/sites/default/files/2019-06/dino_0.png` },
  ]
  for (const data of karts) await payload.create({ collection: 'karts', data: data as any })

  const pricing = [
    { label: 'Kart individual', labelEn: 'Single kart', activity: 'karting', duration: '13 min', price: '25€', order: 1 },
    { label: 'Kart individual', labelEn: 'Single kart', activity: 'karting', duration: '26 min', price: '45€', order: 2 },
    { label: 'Kart 2 lugares', labelEn: '2-seater kart', activity: 'karting', duration: '13 min', price: '30€', order: 3 },
    { label: 'Kart 2 lugares', labelEn: '2-seater kart', activity: 'karting', duration: '26 min', price: '55€', order: 4 },
    { label: 'Kart 390cc', activity: 'group-races', duration: '5 + 15 min', price: '45€', order: 1 },
    { label: 'Kart 390cc', activity: 'group-races', duration: '10 + 20 min', price: '55€', order: 2 },
    { label: 'Kart 390cc', activity: 'group-races', duration: '10 + 35 min', price: '75€', order: 3 },
    { label: 'Kart 390cc', activity: 'group-races', duration: '10 min + 1 hora', price: '110€', order: 4 },
    { label: 'Resistência 100 km', labelEn: '100 km endurance', activity: 'group-races', duration: '—', price: '150€', order: 5 },
    { label: '1 jogo', labelEn: '1 game', activity: 'lasergame', duration: '15–20 min · por pessoa', price: '7€', order: 1 },
    { label: 'Ilimitado 1 hora', labelEn: 'Unlimited 1 hour', activity: 'lasergame', duration: 'grupos 8–30 jogadores', price: '250€', order: 2 },
  ]
  for (const data of pricing) await payload.create({ collection: 'pricing-tiers', data: data as any })

  const modes = [
    { name: 'Deathmatch', level: 'beginner', order: 1, description: 'Todos contra todos · 1 tiro mata · balas e vidas infinitas', descriptionEn: 'Free-for-all · one-shot kills · infinite ammo and lives' },
    { name: 'Team Deathmatch', level: 'beginner', order: 2, description: 'Até 6 equipas · 2 bases · 1 tiro mata · vidas infinitas', descriptionEn: 'Up to 6 teams · 2 bases · one-shot kills · infinite lives' },
    { name: 'Gladiador', level: 'beginner', order: 3, description: 'Last man standing · 10 vidas · bases dão +5 vidas', descriptionEn: 'Last man standing · 10 lives · bases give +5 lives' },
    { name: 'Capture the Flag', level: 'advanced', order: 4, description: '5x5 · 100 pontos de vida · cura automática · 1001 pontos por bandeira', descriptionEn: '5v5 · 100 health points · auto-heal · 1001 points per flag' },
    { name: 'Rocket Match', level: 'advanced', order: 5, description: 'Todos contra todos · cada frag acelera os mísseis · 1 míssil elimina', descriptionEn: 'Free-for-all · each frag speeds up missiles · 1 missile eliminates' },
    { name: 'Space Marines', level: 'advanced', order: 6, description: 'CTF com funções: metralhadora, mísseis e médico', descriptionEn: 'CTF with roles: machine gun, missiles and medic' },
  ]
  for (const data of modes) await payload.create({ collection: 'game-modes', data: data as any })

  const packages = [
    {
      name: 'Pack 1', price: '250€', order: 1, highlight: false, note: 'Até aos 6 anos', noteEn: 'Up to 6 years old',
      features: [
        { text: 'Sala 2h30 com música', textEn: '2h30 room with music' },
        { text: 'Insufláveis, luta de sumo e trampolim', textEn: 'Inflatables, sumo wrestling and trampoline' },
        { text: 'Lanche base para 20 pessoas', textEn: 'Basic snacks for 20 people' },
        { text: 'Convites digitais', textEn: 'Digital invitations' },
      ],
    },
    {
      name: 'Pack 2', price: '350€', order: 2, highlight: true,
      features: [
        { text: 'Tudo o que está no Pack 1', textEn: 'Everything in Pack 1' },
        { text: 'LaserGame (1 hora)', textEn: 'LaserGame (1 hour)' },
        { text: 'Monitor incluído', textEn: 'Party monitor included' },
      ],
    },
  ]
  for (const data of packages) await payload.create({ collection: 'packages', data: data as any })

  const extras = [
    { label: 'Cachorros quentes', labelEn: 'Hot dogs', price: '40€', order: 1 },
    { label: 'Sortido de salgados', labelEn: 'Savoury snacks platter', price: '40€', order: 2 },
    { label: 'LaserGame +1h', price: '150€', order: 3 },
    { label: 'Kart duplo (1 hora)', labelEn: '2-seater kart (1 hour)', price: '130€', order: 4 },
    { label: 'Sala de aniversário +1h', labelEn: 'Party room +1h', price: '50€', order: 5 },
    { label: 'Sala de diversões +1h', labelEn: 'Games room +1h', price: '100€', order: 6 },
    { label: 'Monitor extra', labelEn: 'Extra monitor', price: '50€', order: 7 },
    { label: 'Lanche adultos (p/ pessoa)', labelEn: 'Adult snacks (per person)', price: '15€', order: 8 },
    { label: 'Convidado extra', labelEn: 'Extra guest', price: '5–15€', order: 9 },
  ]
  for (const data of extras) await payload.create({ collection: 'extras', data })

  await payload.updateGlobal({ slug: 'site-settings', data: {} })

  payload.logger.info('✅ Seed complete.')
}

// Demo birthday invite. Idempotent; safe to run every boot. The slug (share id)
// is auto-generated by the collection hook — we log the resulting URL.
async function seedDemoInvite(payload: Payload): Promise<void> {
  const existing = await payload.find({
    collection: 'invites',
    where: { childName: { equals: 'Tomás' } },
    limit: 1,
  })
  const doc =
    existing.docs[0] ??
    (await payload.create({
      collection: 'invites',
      data: {
        slug: generateInviteId(),
        childName: 'Tomás',
        age: 7,
        eventDate: '2026-07-18T15:00',
        dateText: 'Sábado, 18 Julho 2026',
        dateTextEn: 'Saturday, 18 July 2026',
        timeText: '15:00',
        packText: 'Pack 2 · Karting + LaserGame',
        hostPhone: '351920268289',
      },
    }))

  payload.logger.info(`🎟️  Demo invite: /convite/${doc.slug}`)
}
