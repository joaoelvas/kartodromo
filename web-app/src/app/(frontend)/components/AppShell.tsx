'use client'
import { LangProvider } from '@/lib/lang'
import { BookingProvider, type Settings } from '@/lib/booking'
import { Header } from './Header'
import { Footer } from './Footer'

export function AppShell({ settings, children }: { settings: Settings; children: React.ReactNode }) {
  return (
    <LangProvider>
      <BookingProvider settings={settings}>
        <Header />
        <main>{children}</main>
        <Footer settings={settings} />
      </BookingProvider>
    </LangProvider>
  )
}
