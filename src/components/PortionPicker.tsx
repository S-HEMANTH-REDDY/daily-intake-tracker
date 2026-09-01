import { formatPortion, FRACTION_PORTIONS } from '../foods/portions'

export function PortionPicker({
  value,
  onChange,
  portions = FRACTION_PORTIONS,
}: {
  value: number
  onChange: (next: number) => void
  portions?: readonly number[]
}) {
  return (
    <div className="w-full">
      <p className="mb-2 text-center text-xs font-medium text-ink-soft">How much did you have?</p>
      <div className="grid grid-cols-5 gap-2">
        {portions.map((portion) => {
          const active = Math.abs(value - portion) < 0.001
          return (
            <button
              key={portion}
              type="button"
              onClick={() => onChange(portion)}
              className={`rounded-2xl py-3 text-lg font-semibold transition ${
                active
                  ? 'bg-sage text-white shadow-sm'
                  : 'bg-parchment text-ink hover:bg-sage-soft hover:text-sage'
              }`}
            >
              {formatPortion(portion)}
            </button>
          )
        })}
      </div>
      <p className="mt-2 text-center text-xs text-ink-soft">
        Selected: <span className="font-semibold text-ink">{formatPortion(value)}</span> of one serving
      </p>
    </div>
  )
}
