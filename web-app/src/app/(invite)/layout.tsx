import type { Metadata } from 'next'
import '../(frontend)/globals.css'
import { LangProvider } from '@/lib/lang'

export const metadata: Metadata = {
  title: 'Convite · Kartódromo Vila Real',
  description: 'Passe de pista — festa de aniversário no Kartódromo Vila Real.',
}

// Standalone layout for shareable invites: no site Header/Footer, just the
// language provider (the invite carries its own PT/EN toggle).
export default function InviteLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt">
      <body>
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  )
}
