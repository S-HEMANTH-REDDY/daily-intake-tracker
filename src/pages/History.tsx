import { useMemo } from 'react'
import { HistoryChart } from '../components/HistoryChart'
import { averageOf, lastNDays, snapshotsByDate } from '../history/aggregates'
import { foodsById } from '../foods/lookup'
import { formatShortDate, roundDisplay, todayKey } from '../calculations/dates'
import { useAppStore } from '../storage/context'
import { buildCategoryGuidelines, buildNutrientTargets } from '../recommendations/personalize'
import { computeGuidelineStats } from '../statistics/derive'

export function HistoryPage() {
  const store = useAppStore()
  const logs = store.allLogs()
  const map = foodsById(store.customFoods)
  const snaps = snapshotsByDate(logs, map)
  const last14 = lastNDays(snaps, 14, todayKey())
  const last7 = lastNDays(snaps, 7, todayKey())
  const targets = buildNutrientTargets(store.activeUser)
  const guidelines = buildCategoryGuidelines(store.activeUser)
  const stats = computeGuidelineStats(snaps, targets, guidelines)

  const tableDays = useMemo(() => [...snaps].reverse(), [snaps])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl">History</h1>
        <p className="mt-1 text-ink-soft">
          Each calendar day is stored separately. Yesterday never carries into today.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Days logged" value={String(stats.daysLogged)} />
        <Stat label="Days over added-sugar guideline" value={String(stats.daysOverSugar)} />
        <Stat label="Days over sodium limit" value={String(stats.daysOverSodium)} />
        <Stat label="Days over cookie threshold" value={String(stats.daysOverCookies)} />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Stat
          label="7-day avg added sugar"
          value={`${roundDisplay(averageOf(last7, (s) => s.nutrients.addedSugarG), 1)} g`}
        />
        <Stat
          label="7-day avg calories"
          value={`${roundDisplay(averageOf(last7, (s) => s.nutrients.calories), 0)} kcal`}
        />
        <Stat
          label="7-day avg cookies"
          value={roundDisplay(averageOf(last7, (s) => s.categoryServings.cookies), 1)}
        />
      </div>

      <h2 className="font-display text-2xl">14-day trend</h2>
      <HistoryChart days={last14} />

      <h2 className="font-display text-2xl">Daily totals</h2>
      <div className="card-shadow overflow-x-auto rounded-3xl bg-card">
        <table className="min-w-full text-sm">
          <thead className="text-left text-xs tracking-wide text-ink-soft uppercase">
            <tr className="border-b border-line">
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3 text-right">Cookies</th>
              <th className="px-4 py-3 text-right">Candy</th>
              <th className="px-4 py-3 text-right">Drinks</th>
              <th className="px-4 py-3 text-right">Added sugar</th>
              <th className="px-4 py-3 text-right">Calories</th>
              <th className="px-4 py-3 text-right">Sodium</th>
            </tr>
          </thead>
          <tbody>
            {tableDays.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-ink-soft">
                  No history yet. Logged days will appear here.
                </td>
              </tr>
            ) : (
              tableDays.map((row) => (
                <tr key={row.date} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-medium">{formatShortDate(row.date)}</td>
                  <td className="px-4 py-3 text-right">{roundDisplay(row.categoryServings.cookies, 1)}</td>
                  <td className="px-4 py-3 text-right">{roundDisplay(row.categoryServings.chocolate_candy, 1)}</td>
                  <td className="px-4 py-3 text-right">{roundDisplay(row.categoryServings.sugary_drinks, 1)}</td>
                  <td className="px-4 py-3 text-right">{roundDisplay(row.nutrients.addedSugarG, 1)} g</td>
                  <td className="px-4 py-3 text-right">{roundDisplay(row.nutrients.calories, 0)}</td>
                  <td className="px-4 py-3 text-right">{roundDisplay(row.nutrients.sodiumMg, 0)} mg</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card-shadow rounded-3xl bg-card p-4">
      <p className="text-xs font-medium text-ink-soft">{label}</p>
      <p className="num mt-1 text-3xl">{value}</p>
    </div>
  )
}
