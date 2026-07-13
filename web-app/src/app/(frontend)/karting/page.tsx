import { getPayloadClient } from '@/lib/payload'
import { KartingView } from '../views/KartingView'

export const dynamic = 'force-dynamic'

export default async function KartingPage() {
  const payload = await getPayloadClient()
  const [karts, indiv, group] = await Promise.all([
    payload.find({ collection: 'karts', sort: 'order', limit: 50 }),
    payload.find({ collection: 'pricing-tiers', where: { activity: { equals: 'karting' } }, sort: 'order', limit: 50 }),
    payload.find({ collection: 'pricing-tiers', where: { activity: { equals: 'group-races' } }, sort: 'order', limit: 50 }),
  ])
  return <KartingView karts={karts.docs} indiv={indiv.docs} group={group.docs} />
}
