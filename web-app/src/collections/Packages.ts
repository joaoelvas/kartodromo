import type { CollectionConfig } from 'payload'

// Birthday party packages (Pack 1 / Pack 2) and their optional extras.
export const Packages: CollectionConfig = {
  slug: 'packages',
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'price', 'highlight'], group: 'Conteúdo' },
  access: { read: () => true },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'price', type: 'text', required: true, admin: { description: 'e.g. 250€' } },
    { name: 'highlight', type: 'checkbox', label: 'Destaque (mais popular)', defaultValue: false },
    { name: 'note', type: 'text' },
    { name: 'noteEn', type: 'text', label: 'Note (EN)' },
    { name: 'order', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
    {
      name: 'features',
      type: 'array',
      fields: [
        { name: 'text', type: 'text', required: true },
        { name: 'textEn', type: 'text', label: 'Text (EN)' },
      ],
    },
  ],
}

// A la carte extras list on the birthdays page.
export const Extras: CollectionConfig = {
  slug: 'extras',
  admin: { useAsTitle: 'label', defaultColumns: ['label', 'price', 'order'], group: 'Conteúdo' },
  access: { read: () => true },
  fields: [
    { name: 'label', type: 'text', required: true },
    { name: 'labelEn', type: 'text', label: 'Label (EN)' },
    { name: 'price', type: 'text', required: true },
    { name: 'order', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
  ],
}
