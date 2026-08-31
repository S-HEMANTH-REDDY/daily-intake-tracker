import { Trash2 } from 'lucide-react'
import { getFood } from '../foods/lookup'
import type { Food } from '../foods/types'
import { scaleNutrition } from '../nutrition/scale'
import { roundDisplay } from '../calculations/dates'
import type { LogEntry } from '../storage/schema'
import { IntakeCounter } from './IntakeCounter'

export function FoodLog({
  entries,
  extraFoods,
  onQuantity,
  onRemove,
}: {
  entries: LogEntry[]
  extraFoods: Food[]
  onQuantity: (id: string, quantity: number) => void
  onRemove: (id: string) => void
}) {
  if (entries.length === 0) {
    return (
      <p className="rounded-3xl bg-card p-6 text-center text-ink-soft">
        Nothing logged yet today. Search a food to add it.
      </p>
    )
  }

  return (
    <div className="overflow-hidden rounded-3xl bg-card card-shadow">
      <div className="hidden grid-cols-[1fr_auto_auto] gap-3 border-b border-line px-5 py-3 text-xs font-semibold tracking-wide text-ink-soft uppercase sm:grid">
        <span>Food</span>
        <span className="text-right">Quantity</span>
        <span />
      </div>
      <ul>
        {entries.map((entry) => {
          const food = getFood(entry.foodId, extraFoods)
          if (!food) return null
          const n = scaleNutrition(food.nutrition, entry.quantity)
          return (
            <li
              key={entry.id}
              className="flex flex-col gap-3 border-b border-line px-5 py-4 last:border-b-0 sm:grid sm:grid-cols-[1fr_auto_auto] sm:items-center"
            >
              <div>
                <p className="font-semibold">{food.name}</p>
                <p className="text-sm text-ink-soft">
                  {roundDisplay(entry.quantity, 1)} × {food.servingLabel} · {roundDisplay(n.calories, 0)}{' '}
                  kcal · {roundDisplay(n.addedSugarG, 1)} g added sugar
                </p>
              </div>
              <IntakeCounter
                value={entry.quantity}
                increment={food.increment}
                onChange={(q) => onQuantity(entry.id, q)}
              />
              <button
                type="button"
                aria-label={`Remove ${food.name}`}
                className="self-end rounded-full p-2 text-ink-soft hover:bg-coral-soft hover:text-coral sm:self-center"
                onClick={() => onRemove(entry.id)}
              >
                <Trash2 size={18} />
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
