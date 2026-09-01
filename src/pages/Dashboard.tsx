import type { NutrientProfile } from '../nutrition/types'
import { Link } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { CategoryCard } from '../components/CategoryCard'
import { DailySummary } from '../components/DailySummary'
import { Disclaimer } from '../components/Disclaimer'
import { FoodLog } from '../components/FoodLog'
import { NutrientCard } from '../components/NutrientCard'
import { shiftDateKey, todayKey } from '../calculations/dates'
import { statusForGoal, statusForLimit } from '../calculations/status'
import { useDayData } from '../daily-log/useDayData'
import { useLogPermissions } from '../hooks/useLogPermissions'
import { useAdminViewingOther } from '../hooks/useAdminViewingOther'
import { useAppStore } from '../storage/context'

function nutrientIntake(id: string, nutrients: NutrientProfile) {
  if (id === 'calories') return nutrients.calories
  if (id === 'addedSugar') return nutrients.addedSugarG
  if (id === 'saturatedFat') return nutrients.saturatedFatG
  if (id === 'sodium') return nutrients.sodiumMg
  if (id === 'protein') return nutrients.proteinG
  if (id === 'fiber') return nutrients.fiberG
  return 0
}

export function DashboardPage() {
  const store = useAppStore()
  const adminViewingOther = useAdminViewingOther()
  const { readOnly } = useLogPermissions()
  const [date, setDate] = useState(todayKey)
  const { entries, totals, targets, guidelines } = useDayData(date)
  const isToday = date === todayKey()

  const categoryRows = useMemo(
    () =>
      guidelines.map((guideline) => {
        const intake = totals.categoryServings[guideline.category as keyof typeof totals.categoryServings] ?? 0
        const status =
          guideline.role === 'goal'
            ? statusForGoal(intake, guideline.value, guideline.unit)
            : statusForLimit(intake, guideline.value, guideline.unit, guideline.label)
        return { guideline, intake, status }
      }),
    [guidelines, totals],
  )

  const waterRows = categoryRows.filter((row) => row.guideline.category === 'water')
  const junkRows = categoryRows.filter((row) => row.guideline.category !== 'water')

  const nutrientRows = useMemo(
    () =>
      targets.map((target) => {
        const intake = nutrientIntake(target.id, totals.nutrients)
        const status =
          target.role === 'goal'
            ? statusForGoal(intake, target.value, target.unit)
            : statusForLimit(intake, target.value, target.unit, target.label)
        return { target, intake, status }
      }),
    [targets, totals],
  )

  const featuredNutrients = nutrientRows.filter((r) =>
    ['calories', 'addedSugar', 'sodium', 'saturatedFat'].includes(r.target.id),
  )

  const overallRatio =
    featuredNutrients.reduce((sum, row) => sum + Math.min(row.status.ratio, 1.25), 0) /
    Math.max(featuredNutrients.length, 1)

  const warnings = [
    ...junkRows.filter((r) => r.status.tone === 'exceeded' || r.status.tone === 'approaching'),
    ...nutrientRows.filter(
      (r) =>
        r.target.role !== 'goal' &&
        (r.status.tone === 'exceeded' || r.status.tone === 'approaching'),
    ),
  ]

  return (
    <div className="space-y-6">
      <DailySummary
        date={date}
        onPrev={() => setDate(shiftDateKey(date, -1))}
        onNext={() => setDate(shiftDateKey(date, 1))}
        canNext={!isToday}
        overallRatio={overallRatio}
        categories={categoryRows}
        nutrients={featuredNutrients}
      />

      {warnings.length > 0 ? (
        <section className="rounded-3xl bg-amber-soft/70 p-5">
          <h2 className="font-display text-xl">Notices</h2>
          <ul className="mt-2 space-y-1.5 text-sm text-ink">
            {warnings.map((row) =>
              'guideline' in row ? (
                <li key={row.guideline.category}>
                  {row.guideline.emoji} {row.guideline.label}: {row.status.message}
                </li>
              ) : (
                <li key={row.target.id}>
                  {row.target.emoji} {row.target.label}: {row.status.message}
                </li>
              ),
            )}
          </ul>
        </section>
      ) : (
        <section className="rounded-3xl bg-sage-soft p-5 text-sage">
          <p className="font-medium">No guideline notices for this day.</p>
          <p className="mt-1 text-sm opacity-80">Logged foods are within the tracking thresholds shown below.</p>
        </section>
      )}

      <div className="flex items-end justify-between">
        <h2 className="font-display text-2xl">Today's water</h2>
        {readOnly ? null : (
          <Link to="/log" className="text-sm font-semibold text-sage">
            Log water
          </Link>
        )}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {waterRows.map((row) => (
          <CategoryCard
            key={row.guideline.category}
            emoji={row.guideline.emoji}
            label={row.guideline.label}
            intake={row.intake}
            limit={row.guideline.value}
            unit={row.guideline.unit}
            status={row.status}
            derivation={row.guideline.derivation}
            mode="goal"
          />
        ))}
      </div>

      <div className="flex items-end justify-between">
        <h2 className="font-display text-2xl">Today's junk food</h2>
        {readOnly ? null : (
          <Link to="/log" className="text-sm font-semibold text-sage">
            Log food
          </Link>
        )}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {junkRows.map((row) => (
          <CategoryCard
            key={row.guideline.category}
            emoji={row.guideline.emoji}
            label={row.guideline.label}
            intake={row.intake}
            limit={row.guideline.value}
            unit={row.guideline.unit}
            status={row.status}
            derivation={row.guideline.derivation}
            mode={row.guideline.role === 'goal' ? 'goal' : 'limit'}
          />
        ))}
      </div>

      <h2 className="font-display text-2xl">Today's nutrition</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {nutrientRows.map((row) => (
          <NutrientCard
            key={row.target.id}
            emoji={row.target.emoji}
            label={row.target.label}
            intake={row.intake}
            limit={row.target.value}
            unit={row.target.unit}
            status={row.status}
            kindNote={`${row.target.role === 'goal' ? 'Goal' : row.target.role === 'upper_limit' ? 'Upper limit' : 'Daily target'} · ${row.target.kind.replace('_', ' ')}. ${row.target.sourceSummary}`}
          />
        ))}
      </div>

      <h2 className="font-display text-2xl">What {store.activeUser.displayName} ate</h2>
      <p className="text-sm text-ink-soft">
        {readOnly
          ? 'Read-only — logged times shown in your local time.'
          : adminViewingOther
            ? 'Admin view — each item shows when it was logged (your local time).'
            : 'Each item shows when it was logged (your local time).'}
      </p>
      <FoodLog
        entries={entries}
        extraFoods={store.customFoods}
        showTimestamps
        readOnly={readOnly}
        onQuantity={(id, quantity) => store.updateLog(id, { quantity })}
        onRemove={store.removeLog}
      />

      <Disclaimer />
    </div>
  )
}
