import { EMPTY_NUTRITION, NUTRIENT_KEYS, type NutrientKey, type NutrientProfile } from './types'

export function scaleNutrition(perServing: NutrientProfile, quantity: number): NutrientProfile {
  const scaled = { ...EMPTY_NUTRITION }
  for (const key of NUTRIENT_KEYS) {
    scaled[key] = perServing[key] * quantity
  }
  return scaled
}

export function addNutrition(a: NutrientProfile, b: NutrientProfile): NutrientProfile {
  const sum = { ...EMPTY_NUTRITION }
  for (const key of NUTRIENT_KEYS) {
    sum[key] = a[key] + b[key]
  }
  return sum
}

export function sumNutrition(items: readonly NutrientProfile[]): NutrientProfile {
  return items.reduce(addNutrition, { ...EMPTY_NUTRITION })
}

export function getNutrient(profile: NutrientProfile, key: NutrientKey): number {
  return profile[key]
}
