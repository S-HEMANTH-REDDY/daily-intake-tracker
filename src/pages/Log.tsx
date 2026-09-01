import { useState } from 'react'
import { Link } from 'react-router-dom'
import { X } from 'lucide-react'
import { FoodSearch } from '../components/FoodSearch'
import { FoodLog } from '../components/FoodLog'
import { IntakeCounter } from '../components/IntakeCounter'
import { PortionPicker } from '../components/PortionPicker'
import { todayKey, roundDisplay } from '../calculations/dates'
import { scaleNutrition } from '../nutrition/scale'
import type { Food } from '../foods/types'
import { CATEGORY_META } from '../foods/catalog'
import { defaultPortionQuantity, quantityServingLabel, supportsFractionalPortions } from '../foods/portions'
import { useAppStore } from '../storage/context'
import { useDayData } from '../daily-log/useDayData'
import { useLogPermissions } from '../hooks/useLogPermissions'

export function LogPage() {
  const store = useAppStore()
  const { readOnly, isMemberViewingAdmin } = useLogPermissions()
  const date = todayKey()
  const { entries } = useDayData(date)
  const [selected, setSelected] = useState<Food | null>(null)
  const [qty, setQty] = useState(1)
  const [justAdded, setJustAdded] = useState<string | null>(null)

  function choose(food: Food) {
    setSelected(food)
    setQty(defaultPortionQuantity(food))
  }

  function add() {
    if (!selected) return
    void store.addLog({ foodId: selected.id, quantity: qty, date })
    setJustAdded(quantityServingLabel(qty, selected.servingLabel))
    setSelected(null)
  }

  const preview = selected ? scaleNutrition(selected.nutrition, qty) : null

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl">{readOnly ? `${store.activeUser.displayName}'s log` : 'Log food'}</h1>
          <p className="mt-1 text-ink-soft">
            {readOnly
              ? `Read-only view of ${store.activeUser.displayName}'s food log. Switch back to your name in the header to log your own food.`
              : 'Search water bottles, Chick-fil-A milkshakes, Coke, Diet Coke, Subway cookies, Hershey’s, and more.'}
          </p>
        </div>
        {readOnly ? null : (
          <Link to="/custom" className="rounded-full bg-sage px-4 py-2 text-sm font-semibold text-white">
            Custom food
          </Link>
        )}
      </div>

      {justAdded ? (
        <p className="rounded-2xl bg-sage-soft px-4 py-3 text-sm font-medium text-sage">
          Added {justAdded} to today's log.
        </p>
      ) : null}

      {readOnly ? null : <FoodSearch extraFoods={store.customFoods} onSelect={choose} />}

      <h2 className="font-display text-2xl">{isMemberViewingAdmin ? `${store.activeUser.displayName}'s log today` : "Today's log"}</h2>
      <p className="text-sm text-ink-soft">Logged times shown — oldest first.</p>
      <FoodLog
        entries={entries}
        extraFoods={store.customFoods}
        showTimestamps
        readOnly={readOnly}
        onQuantity={(id, quantity) => store.updateLog(id, { quantity })}
        onRemove={store.removeLog}
      />

      {selected && preview ? (
        <div className="fixed inset-0 z-30 grid place-items-end bg-ink/40 p-0 sm:place-items-center sm:p-6">
          <div className="w-full max-w-lg rounded-t-3xl bg-card p-5 sm:rounded-3xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-ink-soft">
                  {CATEGORY_META[selected.category].emoji} {CATEGORY_META[selected.category].label}
                </p>
                <h2 className="font-display text-2xl">{selected.name}</h2>
                <p className="text-sm text-ink-soft">{selected.servingLabel}</p>
              </div>
              <button type="button" className="rounded-full p-2 hover:bg-parchment" onClick={() => setSelected(null)}>
                <X />
              </button>
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-2 text-sm">
              <Fact label="Calories" value={`${roundDisplay(preview.calories, 0)} kcal`} />
              <Fact label="Added sugar" value={`${roundDisplay(preview.addedSugarG, 1)} g`} />
              <Fact label="Total sugar" value={`${roundDisplay(preview.totalSugarG, 1)} g`} />
              <Fact label="Saturated fat" value={`${roundDisplay(preview.saturatedFatG, 1)} g`} />
              <Fact label="Sodium" value={`${roundDisplay(preview.sodiumMg, 0)} mg`} />
              <Fact label="Protein" value={`${roundDisplay(preview.proteinG, 1)} g`} />
            </dl>

            <div className="mt-5 flex flex-col items-center gap-4">
              {supportsFractionalPortions(selected) ? (
                <PortionPicker value={qty} onChange={setQty} />
              ) : (
                <IntakeCounter value={qty} increment={selected.increment} min={selected.increment} onChange={setQty} />
              )}
              <button
                type="button"
                onClick={add}
                className="w-full rounded-full bg-sage py-3.5 font-semibold text-white"
              >
                Add to today's log
              </button>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-ink-soft">{selected.source.notes ?? selected.source.name}</p>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-parchment px-3 py-2">
      <dt className="text-xs text-ink-soft">{label}</dt>
      <dd className="font-semibold">{value}</dd>
    </div>
  )
}
