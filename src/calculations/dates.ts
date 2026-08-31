export function todayKey(now = new Date()): string {
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function parseDateKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, (m ?? 1) - 1, d ?? 1)
}

export function formatLongDate(key: string): string {
  return parseDateKey(key).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatShortDate(key: string): string {
  return parseDateKey(key).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })
}

export function shiftDateKey(key: string, days: number): string {
  const date = parseDateKey(key)
  date.setDate(date.getDate() + days)
  return todayKey(date)
}

export function roundDisplay(value: number, digits = 0): string {
  const rounded = Number(value.toFixed(digits))
  return rounded.toLocaleString(undefined, {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits > 0 && rounded % 1 !== 0 ? Math.min(digits, 1) : 0,
  })
}

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n))
}

export function formatLogTime(iso: string): string | null {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return null
  return date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function logWasUpdated(entry: { createdAt: string; updatedAt: string }): boolean {
  return new Date(entry.updatedAt).getTime() - new Date(entry.createdAt).getTime() > 60_000
}
