import type { CollectionConfig } from 'payload'

// Fastest lap times shown on the public /recordes board.
// NOTE: when the driver portal ships (adds a `drivers` auth collection), add an optional
// `driver` relationship field here (relationTo: 'drivers') so a lap can be tied to a
// registered account. `driverName` stays as the denormalized public label either way, so
// the addition is additive/non-breaking.
export const LapRecords: CollectionConfig = {
  slug: 'lap-records',
  admin: {
    useAsTitle: 'driverName',
    defaultColumns: ['driverName', 'timeMs', 'kartClass', 'category', 'recordedAt'],
    group: 'Conteúdo',
  },
  access: { read: () => true },
  fields: [
    { name: 'driverName', type: 'text', required: true, label: 'Piloto' },
    {
      name: 'timeMs',
      type: 'number',
      required: true,
      label: 'Melhor volta (ms)',
      admin: { description: 'Melhor volta em milissegundos, ex. 43987 = 43.987s' },
    },
    {
      name: 'kartClass',
      type: 'select',
      required: true,
      defaultValue: '390',
      label: 'Classe',
      options: [
        { label: '270cc', value: '270' },
        { label: '390cc', value: '390' },
      ],
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      defaultValue: 'adult',
      label: 'Categoria',
      options: [
        { label: 'Adulto', value: 'adult' },
        { label: 'Júnior', value: 'junior' },
      ],
    },
    { name: 'laps', type: 'number', defaultValue: 0, label: 'Voltas' },
    {
      name: 'recordedAt',
      type: 'date',
      required: true,
      label: 'Data',
      admin: { description: 'Quando a volta foi registada (define os períodos Ano/Mês/Semana).' },
    },
    { name: 'order', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
  ],
}
