import { getPayloadClient } from '@/lib/payload'
import type { LapRecord } from '@/payload-types'
import type { LapEntry } from '@/lib/records'
import { RecordsView, type PeriodData } from '../views/RecordsView'

export const dynamic = 'force-dynamic'

const MONTHS_PT = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
const MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const MONTHS_FULL_PT = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
const MONTHS_FULL_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const pad2 = (n: number) => String(n).padStart(2, '0')

// Best (fastest) lap per driver within a set of records, mapped to the view's LapEntry shape.
function bestPerDriver(records: LapRecord[]): LapEntry[] {
  const best = new Map<string, LapRecord>()
  for (const r of records) {
    const current = best.get(r.driverName)
    if (!current || r.timeMs < current.timeMs) best.set(r.driverName, r)
  }
  return Array.from(best.values()).map((r) => {
    const d = new Date(r.recordedAt)
    return {
      name: r.driverName,
      ms: r.timeMs,
      cls: r.kartClass,
      cat: r.category,
      laps: r.laps ?? 0,
      date: `${pad2(d.getDate())} ${MONTHS_PT[d.getMonth()]}`,
      dateEn: `${pad2(d.getDate())} ${MONTHS_EN[d.getMonth()]}`,
    }
  })
}

// Most recent Monday at 00:00 (start of the current week).
function startOfWeek(now: Date): Date {
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const day = (d.getDay() + 6) % 7 // Mon=0 … Sun=6
  d.setDate(d.getDate() - day)
  return d
}

function weekLabel(start: Date, end: Date, en: boolean): string {
  const months = en ? MONTHS_EN : MONTHS_PT
  const y = end.getFullYear()
  if (start.getMonth() === end.getMonth()) {
    return `${start.getDate()}–${end.getDate()} ${months[end.getMonth()]} ${y}`
  }
  return `${start.getDate()} ${months[start.getMonth()]} – ${end.getDate()} ${months[end.getMonth()]} ${y}`
}

export default async function RecordsPage() {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({ collection: 'lap-records', limit: 500 })

  const now = new Date()
  const yearStart = new Date(now.getFullYear(), 0, 1)
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const weekStart = startOfWeek(now)

  const inWindow = (from: Date) => docs.filter((r) => new Date(r.recordedAt) >= from && new Date(r.recordedAt) <= now)

  const year: PeriodData = {
    entries: bestPerDriver(inWindow(yearStart)),
    rangePt: `${pad2(yearStart.getDate())} ${MONTHS_PT[0]} – ${pad2(now.getDate())} ${MONTHS_PT[now.getMonth()]} ${now.getFullYear()}`,
    rangeEn: `${pad2(yearStart.getDate())} ${MONTHS_EN[0]} – ${pad2(now.getDate())} ${MONTHS_EN[now.getMonth()]} ${now.getFullYear()}`,
  }
  const month: PeriodData = {
    entries: bestPerDriver(inWindow(monthStart)),
    rangePt: `${MONTHS_FULL_PT[now.getMonth()]} ${now.getFullYear()}`,
    rangeEn: `${MONTHS_FULL_EN[now.getMonth()]} ${now.getFullYear()}`,
  }
  const week: PeriodData = {
    entries: bestPerDriver(inWindow(weekStart)),
    rangePt: weekLabel(weekStart, now, false),
    rangeEn: weekLabel(weekStart, now, true),
  }

  return <RecordsView year={year} month={month} week={week} />
}
