import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload'
import { InviteView, type Invite } from '../../InviteView'

export const dynamic = 'force-dynamic'

export default async function InvitePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'invites',
    where: { slug: { equals: id } },
    limit: 1,
  })

  const invite = res.docs[0] as Invite | undefined
  if (!invite) notFound()

  return <InviteView invite={invite} />
}
