import { roundDisplay } from '../calculations/dates'
import type { StatusResult } from '../calculations/status'
import { ProgressBar } from './ProgressBar'
import { WarningBadge } from './WarningBadge'

export function NutrientCard({
  emoji,
  label,
  intake,
  limit,
  unit,
  status,
  kindNote,
}: {
  emoji: string
  label: string
  intake: number
  limit: number
  unit: string
  status: StatusResult
  kindNote?: string
}) {
  const digits = unit === 'mg' || unit === 'kcal' ? 0 : 1

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
          <p className="num mt-1 text-4xl tracking-tight">
            {roundDisplay(intake, digits)}
            <span className="mx-1.5 text-2xl font-medium text-ink-soft">/</span>
            {roundDisplay(limit, digits)}
            <span className="ml-1.5 text-base font-medium text-ink-soft">{unit}</span>
          </p>
        </div>
        <WarningBadge tone={status.tone} compact />
      </div>
      <div className="mt-4">
        <ProgressBar ratio={status.ratio} tone={status.tone} />
      </div>
      <p className="mt-3 text-sm text-ink-soft">{status.message}</p>
      {kindNote ? <p className="mt-2 text-xs leading-relaxed text-ink-soft/80">{kindNote}</p> : null}
    </article>
  )
}
