import { getPayloadClient } from '@/lib/payload'
import { GruposView } from '../views/GruposView'

export const dynamic = 'force-dynamic'

export default async function GruposPage() {
  const payload = await getPayloadClient()
  const group = await payload.find({
    collection: 'pricing-tiers',
    where: { activity: { equals: 'group-races' } },
    sort: 'order',
    limit: 50,
  })
  return <GruposView group={group.docs} />
}
