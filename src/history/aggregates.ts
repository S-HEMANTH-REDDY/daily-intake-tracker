import type { LogEntry } from '../storage/schema'
import type { NutrientProfile } from '../nutrition/types'
import { computeDailyTotals, type CategoryServings } from '../calculations/totals'
import type { Food } from '../foods/types'

export interface DaySnapshot {
  date: string
  nutrients: NutrientProfile
  categoryServings: CategoryServings
  entryCount: number
}

export function snapshotsByDate(
  logs: readonly LogEntry[],
  foods: ReadonlyMap<string, Food>,
): DaySnapshot[] {
  const dates = [...new Set(logs.map((l) => l.date))].sort()
  return dates.map((date) => {
    const dayLogs = logs.filter((l) => l.date === date)
    const totals = computeDailyTotals(dayLogs, foods)
    return {
      date,
      nutrients: totals.nutrients,
      categoryServings: totals.categoryServings,
      entryCount: dayLogs.length,
    }
  })
}

export function lastNDays(snapshots: DaySnapshot[], n: number, throughDate: string): DaySnapshot[] {
  const map = new Map(snapshots.map((s) => [s.date, s]))
  const result: DaySnapshot[] = []
  const [y, m, d] = throughDate.split('-').map(Number)
  const cursor = new Date(y, m - 1, d)
  for (let i = n - 1; i >= 0; i--) {
    const dt = new Date(cursor)
    dt.setDate(cursor.getDate() - i)
    const key = [
      dt.getFullYear(),
      String(dt.getMonth() + 1).padStart(2, '0'),
      String(dt.getDate()).padStart(2, '0'),
    ].join('-')
    const existing = map.get(key)
    result.push(
      existing ?? {
        date: key,
        nutrients: {
          calories: 0,
          totalFatG: 0,
          saturatedFatG: 0,
          transFatG: 0,
          cholesterolMg: 0,
          sodiumMg: 0,
          carbsG: 0,
          fiberG: 0,
          totalSugarG: 0,
          addedSugarG: 0,
          proteinG: 0,
        },
        categoryServings: {
          cookies: 0,
          chocolate_candy: 0,
          fast_food: 0,
          sugary_drinks: 0,
          desserts: 0,
          snacks: 0,
          other: 0,
        },
        entryCount: 0,
      },
    )
  }
  return result
}

export function averageOf(snapshots: DaySnapshot[], pick: (s: DaySnapshot) => number): number {
  if (snapshots.length === 0) return 0
  return snapshots.reduce((sum, s) => sum + pick(s), 0) / snapshots.length
}
