import type { Metadata } from 'next'
import './globals.css'
import { getPayloadClient } from '@/lib/payload'
import { AppShell } from './components/AppShell'
import type { Settings } from '@/lib/booking'

export const metadata: Metadata = {
  title: 'Kartódromo Vila Real — Karting, LaserGame, Aniversários',
  description:
    'Pista de karting categoria 1, LaserGame indoor, festas de aniversário e eventos de grupo em Vila Real.',
}

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const payload = await getPayloadClient()
  const settings = (await payload.findGlobal({ slug: 'site-settings' })) as unknown as Settings

  return (
    <html lang="pt">
      <body>
        <AppShell settings={settings}>{children}</AppShell>
      </body>
    </html>
  )
}
