import type { CollectionConfig } from 'payload'
import crypto from 'crypto'

// URL-safe, unguessable id for the shareable link (e.g. "k3Fq9mZ2pX").
const ID_ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
export const generateInviteId = (len = 10): string => {
  const bytes = crypto.randomBytes(len)
  let out = ''
  for (let i = 0; i < len; i++) out += ID_ALPHABET[bytes[i] % ID_ALPHABET.length]
  return out
}

// Digital birthday invites ("track pass"). Each doc is one party's shareable link
// at /convite/{slug}. Guests load it unauthenticated; staff manage them in the admin.
export const Invites: CollectionConfig = {
  slug: 'invites',
  admin: {
    useAsTitle: 'childName',
    defaultColumns: ['childName', 'age', 'eventDate', 'packText', 'slug'],
    group: 'Reservas',
  },
  access: {
    // Public can read (guests open the invite); only logged-in staff can manage.
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'Auto-generated id. Drives the share URL: /convite/{slug}',
      },
      // Auto-fill an unguessable id on create (runs before the required validation).
      hooks: {
        beforeValidate: [({ value }) => value || generateInviteId()],
      },
    },
    {
      // Virtual field: renders the full /convite/{slug} URL with a copy button.
      name: 'shareUrl',
      type: 'ui',
      admin: {
        position: 'sidebar',
        components: {
          Field: '/components/admin/ShareUrlField#ShareUrlField',
        },
      },
    },
    { name: 'childName', type: 'text', required: true, admin: { description: 'Guest of honour.' } },
    { name: 'age', type: 'number', required: true, min: 1, max: 99 },
    {
      name: 'eventDate',
      type: 'text',
      required: true,
      admin: { description: 'ISO datetime that drives the countdown, e.g. 2026-07-25T15:00' },
    },
    {
      name: 'dateText',
      type: 'text',
      required: true,
      admin: { description: 'Human-readable date, e.g. Sábado, 25 Julho 2026' },
    },
    { name: 'dateTextEn', type: 'text', admin: { description: 'English date label (optional).' } },
    { name: 'timeText', type: 'text', required: true, admin: { description: 'e.g. 15:00' } },
    {
      name: 'packText',
      type: 'text',
      required: true,
      admin: { description: 'e.g. Pack 2 · Karting + LaserGame' },
    },
    { name: 'packTextEn', type: 'text', admin: { description: 'English pack label (optional).' } },
    {
      name: 'hostPhone',
      type: 'text',
      required: true,
      admin: { description: 'RSVP WhatsApp target, digits only, e.g. 351920268289' },
    },
  ],
}
