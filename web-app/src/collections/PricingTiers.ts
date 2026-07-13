import type { CollectionConfig } from 'payload'

// Individual price rows shown on each activity's pricing table.
export const PricingTiers: CollectionConfig = {
  slug: 'pricing-tiers',
  admin: { useAsTitle: 'label', defaultColumns: ['label', 'activity', 'duration', 'price'], group: 'Conteúdo' },
  access: { read: () => true },
  fields: [
    { name: 'label', type: 'text', required: true },
    { name: 'labelEn', type: 'text', label: 'Label (EN)' },
    {
      name: 'activity',
      type: 'select',
      required: true,
      options: [
        { label: 'Karting individual', value: 'karting' },
        { label: 'Corridas de grupo', value: 'group-races' },
        { label: 'LaserGame', value: 'lasergame' },
      ],
    },
    { name: 'duration', type: 'text', admin: { description: 'e.g. 13 min, 5 + 15 min' } },
    { name: 'price', type: 'text', required: true, admin: { description: 'e.g. 25€' } },
    { name: 'note', type: 'text' },
    { name: 'order', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
  ],
}
