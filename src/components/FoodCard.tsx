import { scaleNutrition } from '../nutrition/scale'
import { roundDisplay } from '../calculations/dates'
import type { Food } from '../foods/types'
import { CATEGORY_META } from '../foods/catalog'

export function FoodCard({
  food,
  quantity = 1,
  onSelect,
}: {
  food: Food
  quantity?: number
  onSelect?: () => void
}) {
  const n = scaleNutrition(food.nutrition, quantity)
  const meta = CATEGORY_META[food.category]

  return (
    <button
      type="button"
      onClick={onSelect}
      className="card-shadow flex w-full items-start gap-4 rounded-3xl bg-card p-4 text-left transition hover:-translate-y-0.5 hover:ring-2 hover:ring-sage/20"
    >
      <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-parchment text-2xl">
        {meta.emoji}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold">{food.name}</p>
        <p className="truncate text-sm text-ink-soft">
          {food.brand ? `${food.brand} · ` : ''}
          {food.servingLabel}
          {food.isCustom ? ' · Custom' : ''}
        </p>
        <p className="mt-2 text-xs text-ink-soft">
          {roundDisplay(n.calories, 0)} kcal · {roundDisplay(n.addedSugarG, 1)} g added sugar ·{' '}
          {roundDisplay(n.saturatedFatG, 1)} g sat. fat · {roundDisplay(n.sodiumMg, 0)} mg sodium
        </p>
      </div>
    </button>
  )
}
