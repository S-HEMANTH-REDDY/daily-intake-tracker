export interface NutrientProfile {
  calories: number
  totalFatG: number
  saturatedFatG: number
  transFatG: number
  cholesterolMg: number
  sodiumMg: number
  carbsG: number
  fiberG: number
  totalSugarG: number
  addedSugarG: number
  proteinG: number
}

export const NUTRIENT_KEYS = [
  'calories',
  'totalFatG',
  'saturatedFatG',
  'transFatG',
  'cholesterolMg',
  'sodiumMg',
  'carbsG',
  'fiberG',
  'totalSugarG',
  'addedSugarG',
  'proteinG',
] as const

export type NutrientKey = (typeof NUTRIENT_KEYS)[number]

export const EMPTY_NUTRITION: NutrientProfile = {
  calories: 0,
  totalFatG: 0,
  saturatedFatG: 0,
  transFatG: 0,
  cholesterolMg: 0,
  sodiumMg: 0,
  carbsG: 0,
  fiberG: 0,
  totalSugarG: 0,
  addedSugarG: 0,
  proteinG: 0,
}
