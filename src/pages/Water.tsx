import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Droplets } from 'lucide-react'
import { computeDailyFluid, formatFluidMl } from '../calculations/fluid'
import { formatLogTime, shiftDateKey, todayKey } from '../calculations/dates'
import { statusForGoal } from '../calculations/status'
import { foodsById } from '../foods/lookup'
import { useDayData } from '../daily-log/useDayData'
import { useLogPermissions } from '../hooks/useLogPermissions'
import { waterGoalDerivation, waterGoalMl } from '../recommendations/personalize'
import { useAppStore } from '../storage/context'
import { WarningBadge } from '../components/WarningBadge'

const WATER_BOTTLE_ID = 'water-500ml-bottle'

export function WaterPage() {
  const store = useAppStore()
  const { readOnly } = useLogPermissions()
  const [date, setDate] = useState(todayKey)
  const { entries } = useDayData(date)
  const isToday = date === todayKey()
  const goalMl = waterGoalMl(store.activeUser)
  const derivation = waterGoalDerivation(store.activeUser)

  const foodMap = useMemo(() => foodsById(store.customFoods), [store.customFoods])
  const { totalMl, lines } = useMemo(
    () => computeDailyFluid(entries, foodMap),
    [entries, foodMap],
  )
  const status = statusForGoal(totalMl, goalMl, 'mL')

  async function logBottle() {
    await store.addLog({ foodId: WATER_BOTTLE_ID, quantity: 1, date })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl">Water</h1>
          <p className="mt-1 text-ink-soft">
            Combined fluid from plain water and everything you log to drink (Diet Coke, Coke, milkshakes, etc.).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setDate(shiftDateKey(date, -1))}
            className="rounded-full bg-card px-3 py-2 text-sm font-semibold"
          >
            ←
          </button>
          <span className="text-sm font-medium text-ink-soft">{date === todayKey() ? 'Today' : date}</span>
          <button
            type="button"
            disabled={isToday}
            onClick={() => setDate(shiftDateKey(date, 1))}
            className="rounded-full bg-card px-3 py-2 text-sm font-semibold disabled:opacity-40"
          >
            →
          </button>
        </div>
      </div>

      <section className="overflow-hidden rounded-[2rem] bg-sage text-white shadow-lg">
        <div className="px-6 pt-6 pb-2">
          <p className="flex items-center gap-2 text-sm text-white/70">
            <Droplets size={18} />
            {store.activeUser.displayName}&apos;s hydration
          </p>
          <p className="num mt-2 text-5xl leading-none">
            {formatFluidMl(totalMl)}
            <span className="mx-2 text-3xl font-medium text-white/60">/</span>
            {formatFluidMl(goalMl)}
          </p>
          <p className="mt-2 text-sm text-white/80">
            {totalMl.toLocaleString()} mL of {goalMl.toLocaleString()} mL daily goal
          </p>
        </div>
        <div className="mx-6 mt-4 h-2 overflow-hidden rounded-full bg-white/20">
          <div
            className="h-full rounded-full bg-white transition-all"
            style={{ width: `${Math.min(100, status.ratio * 100)}%` }}
          />
        </div>
        <div className="flex items-center justify-between gap-3 px-6 py-5">
          <p className="text-sm text-white/90">{status.message}</p>
          <WarningBadge tone={status.tone} />
        </div>
      </section>

      {readOnly ? (
        <p className="rounded-2xl bg-sage-soft px-4 py-3 text-sm text-ink">
          Read-only view — you can see {store.activeUser.displayName}&apos;s fluid total but cannot log for them.
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void logBottle()}
            className="rounded-full bg-sage px-5 py-3 text-sm font-semibold text-white"
          >
            + 500 mL water bottle
          </button>
          <Link to="/log" className="rounded-full bg-card px-5 py-3 text-sm font-semibold text-ink">
            Log a drink (soda, shake…)
          </Link>
        </div>
      )}

      <section className="card-shadow rounded-3xl bg-card p-5">
        <h2 className="font-display text-2xl">Where it came from</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Each logged drink adds its volume in mL. A 355 mL Diet Coke counts as 355 mL toward hydration.
        </p>
        {lines.length === 0 ? (
          <p className="mt-4 text-sm text-ink-soft">Nothing with fluid logged for this day yet.</p>
        ) : (
          <ul className="mt-4 divide-y divide-line">
            {lines.map((line) => {
              const time = formatLogTime(line.createdAt)
              return (
                <li key={line.entryId} className="flex items-center justify-between gap-3 py-3 text-sm">
                  <div className="min-w-0">
                    <p className="font-semibold">{line.foodName}</p>
                    <p className="text-ink-soft">
                      {line.servingLabel}
                      {time ? ` · ${time}` : ''}
                    </p>
                  </div>
                  <p className="num shrink-0 text-lg font-semibold text-sage">{line.fluidMl.toLocaleString()} mL</p>
                </li>
              )
            })}
          </ul>
        )}
        <p className="mt-4 border-t border-line pt-4 text-right text-sm font-semibold">
          Total: <span className="num text-lg text-sage">{totalMl.toLocaleString()} mL</span>
        </p>
      </section>

      <section className="rounded-3xl bg-parchment p-5 text-sm leading-relaxed text-ink-soft">
        {derivation}
      </section>
    </div>
  )
}
