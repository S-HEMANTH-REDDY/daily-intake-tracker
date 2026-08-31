import { clamp } from '../calculations/dates'
import type { StatusTone } from '../calculations/status'
import { toneStyles } from './tone'

export function ProgressBar({
  ratio,
  tone,
}: {
  ratio: number
  tone: StatusTone
}) {
  const width = clamp(ratio * 100, 0, 100)
  const overflow = ratio > 1
  const styles = toneStyles(tone)

  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-line/80">
      <div
        className={`h-full rounded-full transition-all duration-500 ${styles.bar} ${overflow ? 'opacity-100' : ''}`}
        style={{ width: `${overflow ? 100 : width}%` }}
      />
    </div>
  )
}
