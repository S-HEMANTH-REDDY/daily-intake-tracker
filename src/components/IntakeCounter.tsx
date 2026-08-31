import { Minus, Plus } from 'lucide-react'

export function IntakeCounter({
  value,
  increment = 1,
  onChange,
  min = 0,
}: {
  value: number
  increment?: number
  onChange: (next: number) => void
  min?: number
}) {
  const display = Number.isInteger(value) ? String(value) : value.toFixed(1)

  return (
    <div className="inline-flex items-center gap-3 rounded-full bg-parchment px-2 py-1.5">
      <button
        type="button"
        aria-label="Decrease"
        className="grid size-10 place-items-center rounded-full bg-card text-ink shadow-sm transition hover:bg-sage-soft disabled:opacity-40"
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, Number((value - increment).toFixed(2))))}
      >
        <Minus size={18} />
      </button>
      <span className="num min-w-10 text-center text-2xl">{display}</span>
      <button
        type="button"
        aria-label="Increase"
        className="grid size-10 place-items-center rounded-full bg-sage text-white shadow-sm transition hover:bg-sage-2"
        onClick={() => onChange(Number((value + increment).toFixed(2)))}
      >
        <Plus size={18} />
      </button>
    </div>
  )
}
