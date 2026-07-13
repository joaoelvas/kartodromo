import { getPayloadClient } from '@/lib/payload'
import { AniversariosView } from '../views/AniversariosView'

export const dynamic = 'force-dynamic'

export default async function AniversariosPage() {
  const payload = await getPayloadClient()
  const [packages, extras] = await Promise.all([
    payload.find({ collection: 'packages', sort: 'order', limit: 20 }),
    payload.find({ collection: 'extras', sort: 'order', limit: 50 }),
  ])
  return <AniversariosView packages={packages.docs} extras={extras.docs} />
}
