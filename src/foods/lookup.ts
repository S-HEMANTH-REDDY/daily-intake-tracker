import { FOOD_CATALOG } from './catalog'
import type { Food } from './types'

export function searchFoods(query: string, extra: readonly Food[] = []): Food[] {
  const haystack = [...FOOD_CATALOG, ...extra]
  const q = query.trim().toLowerCase()
  if (!q) return haystack

  const scored = haystack
    .map((food) => ({ food, score: scoreFood(food, q) }))
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score || a.food.name.localeCompare(b.food.name))

  return scored.map((row) => row.food)
}

function scoreFood(food: Food, q: string): number {
  const name = food.name.toLowerCase()
  const brand = food.brand?.toLowerCase() ?? ''
  const aliases = (food.aliases ?? []).map((a) => a.toLowerCase())
  const serving = food.servingLabel.toLowerCase()
  if (name === q || aliases.includes(q)) return 100
  if (name.startsWith(q)) return 80
  if (aliases.some((a) => a.startsWith(q))) return 70
  if (name.includes(q)) return 50
  if (brand.includes(q)) return 40
  if (aliases.some((a) => a.includes(q))) return 35
  if (serving.includes(q)) return 28
  return 0
}

export function foodsById(extra: readonly Food[] = []): Map<string, Food> {
  const map = new Map<string, Food>()
  for (const food of FOOD_CATALOG) map.set(food.id, food)
  for (const food of extra) map.set(food.id, food)
  return map
}

export function getFood(id: string, extra: readonly Food[] = []): Food | undefined {
  return foodsById(extra).get(id)
}
