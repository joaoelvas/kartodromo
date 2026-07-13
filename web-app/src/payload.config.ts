import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Activities } from './collections/Activities'
import { Karts } from './collections/Karts'
import { PricingTiers } from './collections/PricingTiers'
import { Packages, Extras } from './collections/Packages'
import { GameModes } from './collections/GameModes'
import { Bookings } from './collections/Bookings'
import { SiteSettings } from './globals/SiteSettings'
import { seed } from './seed'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '— Kartódromo Vila Real',
    },
  },
  collections: [
    Activities,
    Karts,
    PricingTiers,
    Packages,
    Extras,
    GameModes,
    Bookings,
    Media,
    Users,
  ],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'dev-secret-change-me',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || 'file:./kartodromo.db',
    },
  }),
  sharp,
  // Seed content on first boot (no-op once the DB has data).
  onInit: async (payload) => {
    try {
      await seed(payload)
    } catch (err) {
      payload.logger.error({ err }, 'Seed failed')
    }
  },
})
