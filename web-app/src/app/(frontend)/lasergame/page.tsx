import { getPayloadClient } from '@/lib/payload'
import { LaserView } from '../views/LaserView'

export const dynamic = 'force-dynamic'

export default async function LaserPage() {
  const payload = await getPayloadClient()
  const [modes, pricing] = await Promise.all([
    payload.find({ collection: 'game-modes', sort: 'order', limit: 50 }),
    payload.find({ collection: 'pricing-tiers', where: { activity: { equals: 'lasergame' } }, sort: 'order', limit: 50 }),
  ])
  return <LaserView modes={modes.docs} pricing={pricing.docs} />
}
