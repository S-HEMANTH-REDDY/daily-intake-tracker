import type { NutrientProfile } from '../nutrition/types'

export function n(
  partial: Partial<NutrientProfile> & Pick<NutrientProfile, 'calories'>,
): NutrientProfile {
  return {
    calories: partial.calories,
    totalFatG: partial.totalFatG ?? 0,
    saturatedFatG: partial.saturatedFatG ?? 0,
    transFatG: partial.transFatG ?? 0,
    cholesterolMg: partial.cholesterolMg ?? 0,
    sodiumMg: partial.sodiumMg ?? 0,
    carbsG: partial.carbsG ?? 0,
    fiberG: partial.fiberG ?? 0,
    totalSugarG: partial.totalSugarG ?? 0,
    addedSugarG: partial.addedSugarG ?? partial.totalSugarG ?? 0,
    proteinG: partial.proteinG ?? 0,
  }
}

export function scaleNutrients(base: NutrientProfile, factor: number): NutrientProfile {
  const g = (value: number) => Math.round(value * factor * 10) / 10
  return {
    calories: Math.round(base.calories * factor),
    totalFatG: g(base.totalFatG),
    saturatedFatG: g(base.saturatedFatG),
    transFatG: g(base.transFatG),
    cholesterolMg: Math.round(base.cholesterolMg * factor),
    sodiumMg: Math.round(base.sodiumMg * factor),
    carbsG: g(base.carbsG),
    fiberG: g(base.fiberG),
    totalSugarG: g(base.totalSugarG),
    addedSugarG: g(base.addedSugarG),
    proteinG: g(base.proteinG),
  }
}
