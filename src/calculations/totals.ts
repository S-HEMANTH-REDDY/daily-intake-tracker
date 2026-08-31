import type { NutrientProfile } from '../nutrition/types'
import { scaleNutrition, sumNutrition } from '../nutrition/scale'
import type { Food, FoodCategory } from '../foods/types'
import { FOOD_CATEGORIES } from '../foods/types'

export interface LogLike {
  foodId: string
  quantity: number
}

export type CategoryServings = Record<FoodCategory, number>

export function emptyCategoryServings(): CategoryServings {
  return Object.fromEntries(FOOD_CATEGORIES.map((c) => [c, 0])) as CategoryServings
}

export function computeDailyTotals(
  entries: readonly LogLike[],
  foodsById: ReadonlyMap<string, Food>,
): { nutrients: NutrientProfile; categoryServings: CategoryServings } {
  const scaled: NutrientProfile[] = []
  const categoryServings = emptyCategoryServings()

  for (const entry of entries) {
    const food = foodsById.get(entry.foodId)
    if (!food || entry.quantity <= 0) continue
    scaled.push(scaleNutrition(food.nutrition, entry.quantity))
    if (food.category === 'sugary_drinks' && food.nutrition.addedSugarG <= 0) continue
    categoryServings[food.category] += entry.quantity
  }

  return {
    nutrients: sumNutrition(scaled),
    categoryServings,
  }
}
