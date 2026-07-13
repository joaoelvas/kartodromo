import { getPayloadClient } from '@/lib/payload'
import { HomeView } from './views/HomeView'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const payload = await getPayloadClient()
  const [activities, pricing] = await Promise.all([
    payload.find({ collection: 'activities', where: { showOnHome: { equals: true } }, sort: 'order', limit: 20 }),
    payload.find({ collection: 'pricing-tiers', where: { activity: { equals: 'karting' } }, sort: 'order', limit: 20 }),
  ])
  return <HomeView activities={activities.docs} pricing={pricing.docs} />
}
