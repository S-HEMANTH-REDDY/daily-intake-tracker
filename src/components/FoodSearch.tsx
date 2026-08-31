import { useMemo, useState, type ReactNode } from 'react'
import { Search } from 'lucide-react'
import { CATEGORY_META, FOOD_CATALOG } from '../foods/catalog'
import { searchFoods } from '../foods/lookup'
import { FOOD_CATEGORIES, type Food, type FoodCategory } from '../foods/types'
import { FoodCard } from './FoodCard'

const PREVIEW = 8

export function FoodSearch({
  extraFoods,
  onSelect,
}: {
  extraFoods: Food[]
  onSelect: (food: Food) => void
}) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<FoodCategory | 'all'>('all')
  const [expanded, setExpanded] = useState<Partial<Record<FoodCategory, boolean>>>({})
  const results = useMemo(() => searchFoods(query, extraFoods), [query, extraFoods])

  const filtered = useMemo(
    () => (category === 'all' ? results : results.filter((food) => food.category === category)),
    [results, category],
  )

  const grouped = useMemo(() => {
    const map = new Map<FoodCategory, Food[]>()
    for (const food of filtered) {
      const list = map.get(food.category) ?? []
      list.push(food)
      map.set(food.category, list)
    }
    return map
  }, [filtered])

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
            placeholder="Coke 500 mL, Diet Coke, Subway cookie, Hershey’s…"
            className="w-full rounded-2xl border border-line bg-card py-3.5 pr-4 pl-12 text-base outline-none ring-sage/0 transition focus:ring-2 focus:ring-sage/30"
          />
        </div>
      </label>

      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        <Chip active={category === 'all'} onClick={() => setCategory('all')}>
          All
        </Chip>
        {FOOD_CATEGORIES.filter((c) => c !== 'other').map((id) => (
          <Chip key={id} active={category === id} onClick={() => setCategory(id)}>
            {CATEGORY_META[id].emoji} {CATEGORY_META[id].label}
          </Chip>
        ))}
      </div>

      <div className="mt-5 space-y-6">
        {showGrouped
          ? [...grouped.entries()].map(([cat, foods]) => {
              const meta = CATEGORY_META[cat]
              const open = expanded[cat] || category === cat
              const visible = open ? foods : foods.slice(0, PREVIEW)
              return (
                <section key={cat}>
                  <h3 className="mb-3 text-sm font-semibold tracking-wide text-ink-soft uppercase">
                    {meta.emoji} {meta.label}
                  </h3>
                  <div className="space-y-3">
                    {visible.map((food) => (
                      <FoodCard key={food.id} food={food} onSelect={() => onSelect(food)} />
                    ))}
                  </div>
                  {!open && foods.length > PREVIEW ? (
                    <button
                      type="button"
                      className="mt-3 text-sm font-semibold text-sage"
                      onClick={() => setExpanded((prev) => ({ ...prev, [cat]: true }))}
                    >
                      Show all {foods.length} {meta.label.toLowerCase()}
                    </button>
                  ) : null}
                </section>
              )
            })
          : filtered.map((food) => (
              <FoodCard key={food.id} food={food} onSelect={() => onSelect(food)} />
            ))}
        {filtered.length === 0 ? (
          <p className="rounded-2xl bg-card p-6 text-center text-ink-soft">
            No matches in the {FOOD_CATALOG.length}+ built-in foods. Add a custom food instead.
          </p>
        ) : null}
      </div>
    </div>
  )
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-semibold ${
        active ? 'bg-sage text-white' : 'bg-card text-ink'
      }`}
    >
      {children}
    </button>
  )
}
