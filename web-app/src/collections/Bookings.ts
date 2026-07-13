import type { CollectionConfig } from 'payload'

// Booking requests submitted from the site. Editors manage status in the admin.
export const Bookings: CollectionConfig = {
  slug: 'bookings',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'activity', 'date', 'time', 'people', 'status'],
    group: 'Reservas',
  },
  access: {
    // Anyone can create a booking from the public site; only logged-in staff can read/edit.
    create: () => true,
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'phone', type: 'text' },
    { name: 'email', type: 'email' },
    {
      name: 'activity',
      type: 'select',
      required: true,
      options: [
        { label: 'Karting', value: 'karting' },
        { label: 'LaserGame', value: 'lasergame' },
        { label: 'Evento de grupo', value: 'grupos' },
        { label: 'Aniversário', value: 'aniversario' },
      ],
    },
    { name: 'date', type: 'text', required: true },
    { name: 'time', type: 'text' },
    { name: 'people', type: 'number', defaultValue: 1 },
    { name: 'message', type: 'textarea' },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      admin: { position: 'sidebar' },
      options: [
        { label: 'Nova', value: 'new' },
        { label: 'Confirmada', value: 'confirmed' },
        { label: 'Concluída', value: 'done' },
        { label: 'Cancelada', value: 'cancelled' },
      ],
    },
  ],
}
