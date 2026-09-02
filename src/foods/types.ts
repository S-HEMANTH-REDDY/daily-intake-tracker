import type { NutrientProfile } from '../nutrition/types'

export const FOOD_CATEGORIES = [
  'water',
  'cookies',
  'chocolate_candy',
  'fast_food',
  'sugary_drinks',
  'desserts',
  'snacks',
  'supplements',
  'other',
] as const

export type FoodCategory = (typeof FOOD_CATEGORIES)[number]

export interface FoodSource {
  name: string
  url?: string
  notes?: string
}

export interface Food {
  id: string
  name: string
  brand?: string
  category: FoodCategory
  servingLabel: string
  increment: number
  nutrition: NutrientProfile
  source: FoodSource
  isCustom?: boolean
  ownerUserId?: string
  aliases?: string[]
  /** Milliliters of fluid per serving toward daily hydration (water, soda, shakes, etc.). */
  fluidMl?: number
  /** Show ⅛–1 portion picker (milkshakes, shared desserts, etc.). */
  fractionalPortions?: boolean
}
