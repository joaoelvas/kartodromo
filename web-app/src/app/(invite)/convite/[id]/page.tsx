import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload'
import { siteUrl } from '@/lib/site'
import { InviteView, type Invite } from '../../InviteView'

export const dynamic = 'force-dynamic'

async function findInvite(id: string): Promise<Invite | undefined> {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'invites',
    where: { slug: { equals: id } },
    limit: 1,
  })
  return res.docs[0] as Invite | undefined
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const invite = await findInvite(id)

  const base = new URL(siteUrl())
  if (!invite) {
    return { metadataBase: base, title: 'Convite · Kartódromo Vila Real' }
  }

  const title = `${invite.childName} faz ${invite.age} anos! 🏁`
  const description = `${invite.dateText} · ${invite.timeText} · Kartódromo Vila Real. Confirma a tua presença na grelha!`

  return {
    metadataBase: base,
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'pt_PT',
      siteName: 'Kartódromo Vila Real',
      url: `/convite/${invite.slug}`,
    },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default async function InvitePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const invite = await findInvite(id)
  if (!invite) notFound()

  return <InviteView invite={invite} />
}
