import { useMemo } from 'react'
import { computeDailyTotals } from '../calculations/totals'
import { foodsById } from '../foods/lookup'
import { FOOD_CATALOG } from '../foods/catalog'
import { buildCategoryGuidelines, buildNutrientTargets } from '../recommendations/personalize'
import { useAppStore } from '../storage/context'

export function useDayData(date: string) {
  const store = useAppStore()
  const entries = store.logsForDate(date)
  const map = foodsById(store.customFoods)

  const totals = useMemo(
    () => computeDailyTotals(entries, map),
    [entries, store.customFoods],
  )

  const targets = useMemo(
    () => buildNutrientTargets(store.activeUser),
    [store.activeUser],
  )

  const guidelines = useMemo(
    () => buildCategoryGuidelines(store.activeUser),
    [store.activeUser],
  )

  return {
    entries,
    totals,
    targets,
    guidelines,
    foodsById: map,
    catalog: [...FOOD_CATALOG, ...store.customFoods],
  }
}
