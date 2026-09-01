import { Link } from 'react-router-dom'
import { roundDisplay } from '../calculations/dates'
import { formatFluidMl } from '../calculations/fluid'
import { statusForGoal } from '../calculations/status'
import { ProgressBar } from './ProgressBar'
import { WarningBadge } from './WarningBadge'

export function FluidSummaryCard({
  totalMl,
  goalMl,
  derivation,
}: {
  totalMl: number
  goalMl: number
  derivation: string
}) {
  const status = statusForGoal(totalMl, goalMl, 'mL')

  return (
    <article className="card-shadow rounded-3xl bg-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-ink-soft">
            <span className="mr-1.5" aria-hidden>
              💧
            </span>
            Water intake today
          </p>
          <p className="num mt-1 text-5xl leading-none">
            {formatFluidMl(totalMl)}
            <span className="mx-1 text-2xl font-medium text-ink-soft">/</span>
            {formatFluidMl(goalMl)}
          </p>
          <p className="mt-2 text-sm text-ink-soft">
            {roundDisplay(totalMl, 0)} mL logged · includes water bottles, Diet Coke, and other drinks
          </p>
        </div>
        <WarningBadge tone={status.tone} />
      </div>
      <div className="mt-5">
        <ProgressBar ratio={status.ratio} tone={status.tone} />
      </div>
      <p className="mt-3 text-sm text-ink-soft">{status.message}</p>
      <Link to="/water" className="mt-4 inline-block text-sm font-semibold text-sage">
        Open Water tab for full breakdown →
      </Link>
      <p className="mt-3 text-xs leading-relaxed text-ink-soft/80">{derivation}</p>
    </article>
  )
}
