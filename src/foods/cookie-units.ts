import type { Food } from './types'

/** Added sugar in one regular packaged sandwich cookie (e.g. one Nabisco Oreo). */
export const TYPICAL_COOKIE_SUGAR_G = 5

/**
 * Cookie category count is size-weighted: mini ≈ 0.4, regular ≈ 1, large bakery ≈ 3+.
 * Based on each food's added sugar vs a ~5 g regular cookie.
 */
export function cookieCategoryUnits(food: Food, quantity: number): number {
  const sugarPerServing = food.nutrition.addedSugarG
  if (sugarPerServing <= 0) return quantity
  return (quantity * sugarPerServing) / TYPICAL_COOKIE_SUGAR_G
}

export function cookieUnitsLabel(units: number): string {
  if (units < 1) return `~${units.toFixed(1)} small-cookie units`
  if (units > 1.25) return `~${units.toFixed(1)} regular-cookie units`
  return `~${units.toFixed(1)} cookie unit`
}
