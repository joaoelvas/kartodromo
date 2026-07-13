import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  admin: { group: 'Conteúdo' },
  access: { read: () => true },
  fields: [
    { name: 'phone', type: 'text', defaultValue: '920 268 289' },
    { name: 'whatsapp', type: 'text', defaultValue: '351920268289', admin: { description: 'Full international number, digits only (e.g. 351920268289)' } },
    { name: 'email', type: 'email', defaultValue: 'kartodromovilareal@gmail.com' },
    { name: 'address', type: 'text', defaultValue: 'Aeródromo Oeste, 5000-102 Vila Real' },
    { name: 'hours', type: 'text', defaultValue: 'Qua–Dom · 10:00–12:30 / 14:00–19:30' },
    { name: 'hoursEn', type: 'text', defaultValue: 'Wed–Sun · 10:00–12:30 / 14:00–19:30' },
    {
      name: 'social',
      type: 'group',
      fields: [
        { name: 'facebook', type: 'text', defaultValue: 'https://www.facebook.com/kartodromovilareal' },
        { name: 'instagram', type: 'text', defaultValue: 'https://www.instagram.com/explore/locations/252212759/kartodromo-vila-real' },
        { name: 'youtube', type: 'text', defaultValue: 'https://www.youtube.com/channel/UCH1hAP3JOgiUpLNMJaA8pGQ' },
      ],
    },
  ],
}
