import type { StatusTone } from '../calculations/status'
import { toneStyles } from './tone'

export function WarningBadge({ tone, compact }: { tone: StatusTone; compact?: boolean }) {
  const styles = toneStyles(tone)
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${styles.badge}`}
    >
      <span aria-hidden>{styles.emoji}</span>
      {compact ? null : styles.label}
    </span>
  )
}
