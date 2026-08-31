import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FOOD_CATEGORIES, type FoodCategory } from '../foods/types'
import { CATEGORY_META } from '../foods/catalog'
import { useAppStore } from '../storage/context'
import { todayKey } from '../calculations/dates'

export function CustomFoodPage() {
  const store = useAppStore()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [servingLabel, setServingLabel] = useState('1 serving')
  const [category, setCategory] = useState<FoodCategory>('other')
  const [calories, setCalories] = useState('')
  const [addedSugar, setAddedSugar] = useState('')
  const [totalSugar, setTotalSugar] = useState('')
  const [satFat, setSatFat] = useState('')
  const [sodium, setSodium] = useState('')
  const [protein, setProtein] = useState('')
  const [fiber, setFiber] = useState('')
  const [totalFat, setTotalFat] = useState('')
  const [carbs, setCarbs] = useState('')
  const [addToToday, setAddToToday] = useState(true)

  return (
    <form
      className="mx-auto max-w-xl space-y-4"
      onSubmit={(e) => {
        e.preventDefault()
        const food = store.addCustomFood({
          name: name.trim(),
          category,
          servingLabel: servingLabel.trim() || '1 serving',
          increment: 1,
          nutrition: {
            calories: Number(calories) || 0,
            totalFatG: Number(totalFat) || 0,
            saturatedFatG: Number(satFat) || 0,
            transFatG: 0,
            cholesterolMg: 0,
            sodiumMg: Number(sodium) || 0,
            carbsG: Number(carbs) || 0,
            fiberG: Number(fiber) || 0,
            totalSugarG: Number(totalSugar) || Number(addedSugar) || 0,
            addedSugarG: Number(addedSugar) || 0,
            proteinG: Number(protein) || 0,
          },
          source: { name: 'Custom food entered by user' },
        })
        if (addToToday) {
          store.addLog({ foodId: food.id, quantity: 1, date: todayKey() })
        }
        navigate('/')
      }}
    >
      <div>
        <h1 className="font-display text-3xl">Custom food</h1>
        <p className="mt-1 text-ink-soft">
          Saved only for {store.activeUser.displayName}. It behaves like built-in foods after you save.
        </p>
      </div>

      <label className="block text-sm">
        <span className="mb-1.5 block font-medium">Name</span>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Homemade chocolate cake"
          className="w-full rounded-2xl border border-line bg-card px-3 py-2.5"
        />
      </label>
      <label className="block text-sm">
        <span className="mb-1.5 block font-medium">Serving size</span>
        <input
          value={servingLabel}
          onChange={(e) => setServingLabel(e.target.value)}
          className="w-full rounded-2xl border border-line bg-card px-3 py-2.5"
        />
      </label>
      <label className="block text-sm">
        <span className="mb-1.5 block font-medium">Category</span>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as FoodCategory)}
          className="w-full rounded-2xl border border-line bg-card px-3 py-2.5"
        >
          {FOOD_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {CATEGORY_META[c].emoji} {CATEGORY_META[c].label}
            </option>
          ))}
        </select>
      </label>

      <div className="grid grid-cols-2 gap-3">
        <Num label="Calories" value={calories} onChange={setCalories} />
        <Num label="Added sugar (g)" value={addedSugar} onChange={setAddedSugar} />
        <Num label="Total sugar (g)" value={totalSugar} onChange={setTotalSugar} />
        <Num label="Saturated fat (g)" value={satFat} onChange={setSatFat} />
        <Num label="Sodium (mg)" value={sodium} onChange={setSodium} />
        <Num label="Protein (g)" value={protein} onChange={setProtein} />
        <Num label="Fiber (g)" value={fiber} onChange={setFiber} />
        <Num label="Total fat (g)" value={totalFat} onChange={setTotalFat} />
        <Num label="Carbs (g)" value={carbs} onChange={setCarbs} />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={addToToday} onChange={(e) => setAddToToday(e.target.checked)} />
        Add 1 serving to today's log
      </label>

      <button type="submit" className="w-full rounded-full bg-sage py-3.5 font-semibold text-white">
        Save
      </button>
    </form>
  )
}

function Num({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block font-medium text-ink-soft">{label}</span>
      <input
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-line bg-card px-3 py-2.5"
      />
    </label>
  )
}
