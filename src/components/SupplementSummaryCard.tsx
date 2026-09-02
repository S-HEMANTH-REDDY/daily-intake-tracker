import { Link } from 'react-router-dom'
import { roundDisplay } from '../calculations/dates'
import type { StatusResult } from '../calculations/status'
import { ProgressBar } from './ProgressBar'
import { WarningBadge } from './WarningBadge'

export function SupplementSummaryCard({
  intake,
  goal,
  status,
  derivation,
}: {
  intake: number
  goal: number
  status: StatusResult
  derivation: string
}) {
  return (
    <article className="card-shadow rounded-3xl bg-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-ink-soft">
            <span className="mr-1.5" aria-hidden>
              💊
            </span>
            Vitamins & supplements today
          </p>
          <p className="num mt-1 text-5xl leading-none">
            {roundDisplay(intake, 0)}
            <span className="mx-1 text-2xl font-medium text-ink-soft">/</span>
            {roundDisplay(goal, 0)}
          </p>
          <p className="mt-2 text-sm text-ink-soft">
            {roundDisplay(intake, 0)} tablet{intake === 1 ? '' : 's'} logged · daily goal {roundDisplay(goal, 0)}
          </p>
        </div>
        <WarningBadge tone={status.tone} />
      </div>
      <div className="mt-5">
        <ProgressBar ratio={status.ratio} tone={status.tone} />
      </div>
      <p className="mt-3 text-sm text-ink-soft">{status.message}</p>
      {readOnlyLink()}
      <p className="mt-3 text-xs leading-relaxed text-ink-soft/80">{derivation}</p>
    </article>
  )
}

function readOnlyLink() {
  return (
    <Link to="/log" className="mt-4 inline-block text-sm font-semibold text-sage">
      Log a tablet on the Log page →
    </Link>
  )
}
