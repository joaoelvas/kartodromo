import type { CollectionConfig } from 'payload'

// Top-level activities shown on the home grid: Karting, LaserGame, Birthdays, Groups.
export const Activities: CollectionConfig = {
  slug: 'activities',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'order'],
    group: 'Conteúdo',
  },
  access: { read: () => true },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { description: 'karting, lasergame, aniversarios, grupos' },
    },
    { name: 'order', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
    { name: 'eyebrow', type: 'text', admin: { description: 'Small label above the title' } },
    { name: 'eyebrowEn', type: 'text', label: 'Eyebrow (EN)' },
    { name: 'tagline', type: 'text', admin: { description: 'Short line on the home card' } },
    { name: 'taglineEn', type: 'text', label: 'Tagline (EN)' },
    { name: 'intro', type: 'textarea', label: 'Intro paragraph' },
    { name: 'introEn', type: 'textarea', label: 'Intro paragraph (EN)' },
    { name: 'priceFrom', type: 'text', admin: { description: 'e.g. 25€ or 7€' } },
    { name: 'cardImage', type: 'upload', relationTo: 'media' },
    {
      name: 'cardImageUrl',
      type: 'text',
      admin: { description: 'Optional external image URL (used if no upload)' },
    },
    { name: 'heroImage', type: 'upload', relationTo: 'media' },
    { name: 'heroImageUrl', type: 'text' },
    { name: 'showOnHome', type: 'checkbox', defaultValue: true },
  ],
}
