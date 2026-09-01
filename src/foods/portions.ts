import type { Food } from './types'

/** Common partial servings — eighths through a full portion. */
export const FRACTION_PORTIONS = [0.125, 0.25, 0.5, 0.75, 1] as const

const FRACTION_LABELS: Record<number, string> = {
  0.125: '⅛',
  0.25: '¼',
  0.5: '½',
  0.75: '¾',
  1: '1',
}

export function supportsFractionalPortions(food: Food): boolean {
  return food.fractionalPortions === true
}

export function formatPortion(quantity: number): string {
  const rounded = Number(quantity.toFixed(3))
  if (FRACTION_LABELS[rounded]) return FRACTION_LABELS[rounded]
  if (Number.isInteger(rounded)) return String(rounded)
  return quantity.toFixed(2).replace(/\.?0+$/, '')
}

export function quantityServingLabel(quantity: number, servingLabel: string): string {
  const unit = servingLabel.replace(/^1\s+/, '')
  if (quantity === 1) return servingLabel
  return `${formatPortion(quantity)} ${unit}`
}

export function defaultPortionQuantity(food: Food): number {
  return supportsFractionalPortions(food) ? 0.25 : food.increment < 1 ? food.increment : 1
}
