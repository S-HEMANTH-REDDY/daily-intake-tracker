import type { NutrientProfile } from '../nutrition/types'

export const FOOD_CATEGORIES = [
  'water',
  'cookies',
  'chocolate_candy',
  'fast_food',
  'sugary_drinks',
  'desserts',
  'snacks',
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
  /** Show ⅛–1 portion picker (milkshakes, shared desserts, etc.). */
  fractionalPortions?: boolean
}
