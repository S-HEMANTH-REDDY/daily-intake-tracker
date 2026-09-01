import { roundDisplay } from '../calculations/dates'
import type { StatusResult } from '../calculations/status'
import { ProgressBar } from './ProgressBar'
import { WarningBadge } from './WarningBadge'

export function CategoryCard({
  emoji,
  label,
  intake,
  limit,
  unit,
  status,
  derivation,
  mode = 'limit',
}: {
  emoji: string
  label: string
  intake: number
  limit: number
  unit: string
  status: StatusResult
  derivation?: string
  mode?: 'limit' | 'goal'
}) {
  const verb = mode === 'goal' ? 'logged' : 'eaten'
  const targetLabel = mode === 'goal' ? 'goal' : 'guideline'

  return (
    <article className="card-shadow rounded-3xl bg-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-ink-soft">
            <span className="mr-1.5" aria-hidden>
              {emoji}
            </span>
            {label}
          </p>
          <p className="num mt-1 text-5xl leading-none">
            {roundDisplay(intake, 1)}
            <span className="mx-1 text-2xl font-medium text-ink-soft">/</span>
            {roundDisplay(limit, 0)}
          </p>
          <p className="mt-2 text-sm text-ink-soft">
            {roundDisplay(intake, 1)} {verb} · {roundDisplay(limit, 0)} {pluralUnit(unit, limit)} {targetLabel}
          </p>
        </div>
        <WarningBadge tone={status.tone} />
      </div>
      <div className="mt-5">
        <ProgressBar ratio={status.ratio} tone={status.tone} />
      </div>
      <p className="mt-3 text-sm text-ink-soft">{status.message}</p>
      {derivation ? (
        <p className="mt-3 text-xs leading-relaxed text-ink-soft/80">{derivation}</p>
      ) : null}
    </article>
  )
}

function pluralUnit(unit: string, count: number): string {
  if (count === 1) {
    if (unit.endsWith('ies')) return `${unit.slice(0, -3)}y`
    if (unit.endsWith('s')) return unit.slice(0, -1)
  }
  return unit
}
