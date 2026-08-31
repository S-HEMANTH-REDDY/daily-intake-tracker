import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { CATEGORY_META, FOOD_CATALOG } from '../foods/catalog'
import { searchFoods } from '../foods/lookup'
import type { Food } from '../foods/types'
import { FoodCard } from './FoodCard'

export function FoodSearch({
  extraFoods,
  onSelect,
}: {
  extraFoods: Food[]
  onSelect: (food: Food) => void
}) {
  const [query, setQuery] = useState('')
  const results = useMemo(() => searchFoods(query, extraFoods), [query, extraFoods])

  const grouped = useMemo(() => {
    const map = new Map<string, Food[]>()
    for (const food of results) {
      const list = map.get(food.category) ?? []
      list.push(food)
      map.set(food.category, list)
    }
    return map
  }, [results])

  const showGrouped = query.trim().length === 0

  return (
    <div>
      <label className="block">
        <span className="text-sm font-medium text-ink-soft">What did you eat?</span>
        <div className="relative mt-2">
          <Search className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-ink-soft" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search food..."
            className="w-full rounded-2xl border border-line bg-card py-3.5 pr-4 pl-12 text-base outline-none ring-sage/0 transition focus:ring-2 focus:ring-sage/30"
          />
        </div>
      </label>

      <div className="mt-5 space-y-6">
        {showGrouped
          ? [...grouped.entries()].map(([category, foods]) => {
              const meta = CATEGORY_META[category as Food['category']]
              return (
                <section key={category}>
                  <h3 className="mb-3 text-sm font-semibold tracking-wide text-ink-soft uppercase">
                    {meta.emoji} {meta.label}
                  </h3>
                  <div className="space-y-3">
                    {foods.map((food) => (
                      <FoodCard key={food.id} food={food} onSelect={() => onSelect(food)} />
                    ))}
                  </div>
                </section>
              )
            })
          : results.map((food) => (
              <FoodCard key={food.id} food={food} onSelect={() => onSelect(food)} />
            ))}
        {results.length === 0 ? (
          <p className="rounded-2xl bg-card p-6 text-center text-ink-soft">
            No matches in the {FOOD_CATALOG.length}+ built-in foods. Add a custom food instead.
          </p>
        ) : null}
      </div>
    </div>
  )
}
