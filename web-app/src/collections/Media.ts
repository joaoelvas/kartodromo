import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: { group: 'Admin' },
  access: { read: () => true },
  upload: {
    staticDir: 'media',
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
      { name: 'card', width: 768, height: 576, position: 'centre' },
      { name: 'hero', width: 1600, height: undefined },
    ],
    mimeTypes: ['image/*'],
  },
  fields: [
    { name: 'alt', type: 'text', required: true },
  ],
}
