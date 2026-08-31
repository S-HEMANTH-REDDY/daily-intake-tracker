import type { DaySnapshot } from '../history/aggregates'
import type { CategoryGuideline, NutrientTarget } from '../calculations/status'

export interface GuidelineStats {
  daysLogged: number
  daysOverSugar: number
  daysOverSodium: number
  daysOverCalories: number
  daysOverCookies: number
}

export function computeGuidelineStats(
  snapshots: DaySnapshot[],
  targets: NutrientTarget[],
  guidelines: CategoryGuideline[],
): GuidelineStats {
  const sugar = targets.find((t) => t.id === 'addedSugar')?.value ?? 0
  const sodium = targets.find((t) => t.id === 'sodium')?.value ?? 0
  const calories = targets.find((t) => t.id === 'calories')?.value ?? 0
  const cookies = guidelines.find((g) => g.category === 'cookies')?.value ?? 0
  const logged = snapshots.filter((s) => s.entryCount > 0)

  return {
    daysLogged: logged.length,
    daysOverSugar: logged.filter((s) => s.nutrients.addedSugarG > sugar).length,
    daysOverSodium: logged.filter((s) => s.nutrients.sodiumMg > sodium).length,
    daysOverCalories: logged.filter((s) => s.nutrients.calories > calories).length,
    daysOverCookies: logged.filter((s) => s.categoryServings.cookies > cookies).length,
  }
}
