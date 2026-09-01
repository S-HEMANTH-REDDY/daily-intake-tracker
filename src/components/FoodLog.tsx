import { Clock, Trash2 } from 'lucide-react'
import { getFood } from '../foods/lookup'
import type { Food } from '../foods/types'
import { scaleNutrition } from '../nutrition/scale'
import { formatLogTime, logWasUpdated, roundDisplay } from '../calculations/dates'
import { quantityServingLabel, supportsFractionalPortions } from '../foods/portions'
import type { LogEntry } from '../storage/schema'
import { IntakeCounter } from './IntakeCounter'
import { PortionPicker } from './PortionPicker'

function LogTimestamp({ entry }: { entry: LogEntry }) {
  const loggedAt = formatLogTime(entry.createdAt)
  if (!loggedAt) return null
  const edited = logWasUpdated(entry)
  const editedAt = edited ? formatLogTime(entry.updatedAt) : null

  return (
    <p className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-ink">
      <Clock size={13} className="shrink-0 text-sage" aria-hidden />
      <span>
        Logged {loggedAt}
        {editedAt ? <span className="font-normal text-ink-soft"> · edited {editedAt}</span> : null}
      </span>
    </p>
  )
}

export function FoodLog({
  entries,
  extraFoods,
  onQuantity,
  onRemove,
  showTimestamps = false,
}: {
  entries: LogEntry[]
  extraFoods: Food[]
  onQuantity: (id: string, quantity: number) => void
  onRemove: (id: string) => void
  showTimestamps?: boolean
}) {
  if (entries.length === 0) {
    return (
      <p className="rounded-3xl bg-card p-6 text-center text-ink-soft">
        Nothing logged yet today. Search a food to add it.
      </p>
    )
  }

  const visible = showTimestamps
    ? [...entries].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      )
    : entries

  return (
    <div className="overflow-hidden rounded-3xl bg-card card-shadow">
      <div className="hidden grid-cols-[1fr_auto_auto] gap-3 border-b border-line px-5 py-3 text-xs font-semibold tracking-wide text-ink-soft uppercase sm:grid">
        <span>Food</span>
        <span className="text-right">Quantity</span>
        <span />
      </div>
      <ul>
        {visible.map((entry) => {
          const food = getFood(entry.foodId, extraFoods)
          if (!food) return null
          const n = scaleNutrition(food.nutrition, entry.quantity)
          return (
            <li
              key={entry.id}
              className="flex flex-col gap-3 border-b border-line px-5 py-4 last:border-b-0"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{food.name}</p>
                  <p className="text-sm text-ink-soft">
                    {quantityServingLabel(entry.quantity, food.servingLabel)} · {roundDisplay(n.calories, 0)}{' '}
                    kcal · {roundDisplay(n.addedSugarG, 1)} g added sugar
                  </p>
                  {showTimestamps ? <LogTimestamp entry={entry} /> : null}
                </div>
                <button
                  type="button"
                  aria-label={`Remove ${food.name}`}
                  className="shrink-0 rounded-full p-2 text-ink-soft hover:bg-coral-soft hover:text-coral"
                  onClick={() => onRemove(entry.id)}
                >
                  <Trash2 size={18} />
                </button>
              </div>
              {supportsFractionalPortions(food) ? (
                <PortionPicker value={entry.quantity} onChange={(q) => onQuantity(entry.id, q)} />
              ) : (
                <div className="flex justify-end">
                  <IntakeCounter
                    value={entry.quantity}
                    increment={food.increment}
                    onChange={(q) => onQuantity(entry.id, q)}
                  />
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
