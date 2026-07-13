import type { CollectionConfig } from 'payload'

export const Karts: CollectionConfig = {
  slug: 'karts',
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'cc', 'fleet', 'order'], group: 'Conteúdo' },
  access: { read: () => true },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'cc', type: 'text', admin: { description: 'e.g. 390CC' } },
    { name: 'model', type: 'text', admin: { description: 'e.g. EK16, SODI SW270' } },
    {
      name: 'fleet',
      type: 'select',
      defaultValue: 'races',
      options: [
        { label: 'Frota (provas de grupo)', value: 'races' },
        { label: 'Experiências (para todos)', value: 'experiences' },
      ],
    },
    { name: 'lowSeason', type: 'checkbox', label: 'Só época baixa', defaultValue: false },
    { name: 'order', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'imageUrl', type: 'text' },
  ],
}
