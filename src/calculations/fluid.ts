import type { Food } from '../foods/types'
import type { LogEntry } from '../storage/schema'
import { quantityServingLabel } from '../foods/portions'

const FLUID_CATEGORIES = new Set<Food['category']>(['water', 'sugary_drinks', 'desserts'])

export interface FluidLine {
  entryId: string
  foodName: string
  servingLabel: string
  quantity: number
  fluidMl: number
  createdAt: string
}

export function fluidMlPerServing(food: Food): number {
  if (food.fluidMl != null && food.fluidMl > 0) return food.fluidMl
  if (!FLUID_CATEGORIES.has(food.category)) return 0
  if (food.category === 'water') return 500

  const idMl = food.id.match(/-(\d+)$/)
  if (idMl) return Number(idMl[1])

  const labelMl = food.servingLabel.match(/(\d+)\s*mL/i)
  if (labelMl) return Number(labelMl[1])

  return 0
}

export function computeDailyFluid(
  entries: readonly LogEntry[],
  foodsById: ReadonlyMap<string, Food>,
): { totalMl: number; lines: FluidLine[] } {
  const lines: FluidLine[] = []
  let totalMl = 0

  for (const entry of entries) {
    if (entry.quantity <= 0) continue
    const food = foodsById.get(entry.foodId)
    if (!food) continue
    const perServing = fluidMlPerServing(food)
    if (perServing <= 0) continue
    const fluidMl = Math.round(perServing * entry.quantity)
    if (fluidMl <= 0) continue
    totalMl += fluidMl
    lines.push({
      entryId: entry.id,
      foodName: food.name,
      servingLabel: quantityServingLabel(entry.quantity, food.servingLabel),
      quantity: entry.quantity,
      fluidMl,
      createdAt: entry.createdAt,
    })
  }

  lines.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
  return { totalMl, lines }
}

export function formatFluidMl(ml: number): string {
  if (ml >= 1000) {
    const liters = ml / 1000
    return `${liters % 1 === 0 ? liters.toFixed(0) : liters.toFixed(1)} L`
  }
  return `${ml.toLocaleString()} mL`
}
