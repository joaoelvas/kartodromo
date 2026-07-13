import type { CollectionConfig } from 'payload'

// LaserGame game modes.
export const GameModes: CollectionConfig = {
  slug: 'game-modes',
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'level', 'order'], group: 'Conteúdo' },
  access: { read: () => true },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'level',
      type: 'select',
      defaultValue: 'beginner',
      options: [
        { label: 'Iniciantes', value: 'beginner' },
        { label: 'Avançados', value: 'advanced' },
      ],
    },
    { name: 'description', type: 'textarea' },
    { name: 'descriptionEn', type: 'textarea', label: 'Description (EN)' },
    { name: 'order', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
  ],
}
