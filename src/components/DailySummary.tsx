import { ChevronLeft, ChevronRight } from 'lucide-react'
import { formatLongDate, roundDisplay } from '../calculations/dates'
import type { CategoryGuideline, NutrientTarget, StatusResult } from '../calculations/status'
import { ProgressBar } from './ProgressBar'
import { toneStyles } from './tone'

export function DailySummary({
  date,
  onPrev,
  onNext,
  canNext,
  overallRatio,
  categories,
  nutrients,
}: {
  date: string
  onPrev: () => void
  onNext: () => void
  canNext: boolean
  overallRatio: number
  categories: { guideline: CategoryGuideline; intake: number; status: StatusResult }[]
  nutrients: { target: NutrientTarget; intake: number; status: StatusResult }[]
}) {
  return (
    <section className="overflow-hidden rounded-[2rem] bg-sage text-white shadow-lg">
      <div className="flex items-center justify-between px-5 pt-5">
        <button type="button" onClick={onPrev} className="rounded-full p-2 hover:bg-white/10" aria-label="Previous day">
          <ChevronLeft />
        </button>
        <div className="text-center">
          <p className="text-xs font-semibold tracking-[0.18em] text-white/70 uppercase">Today's intake</p>
          <h1 className="font-display mt-1 text-xl">{formatLongDate(date)}</h1>
        </div>
        <button
          type="button"
          onClick={onNext}
          disabled={!canNext}
          className="rounded-full p-2 hover:bg-white/10 disabled:opacity-30"
          aria-label="Next day"
        >
          <ChevronRight />
        </button>
      </div>

      <div className="px-6 pt-6 pb-2">
        <p className="text-sm text-white/70">Overall</p>
        <p className="num text-4xl">{Math.round(overallRatio * 100)}% of tracked limits used</p>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/20">
          <div
            className="h-full rounded-full bg-white"
            style={{ width: `${Math.min(100, overallRatio * 100)}%` }}
          />
        </div>
      </div>

      <div className="mt-5 grid gap-3 px-5 pb-6 sm:grid-cols-2">
        {categories.map(({ guideline, intake, status }) => (
          <MiniStat
            key={guideline.category}
            emoji={guideline.emoji}
            label={guideline.label}
            value={`${roundDisplay(intake, 1)} / ${guideline.value}`}
            toneBar={status.ratio}
            tone={status.tone}
          />
        ))}
        {nutrients.map(({ target, intake, status }) => (
          <MiniStat
            key={target.id}
            emoji={target.emoji}
            label={target.label}
            value={`${roundDisplay(intake, target.unit === 'mg' || target.unit === 'kcal' ? 0 : 1)} / ${roundDisplay(target.value, 0)} ${target.unit}`}
            toneBar={status.ratio}
            tone={status.tone}
          />
        ))}
      </div>
    </section>
  )
}

function MiniStat({
  emoji,
  label,
  value,
  toneBar,
  tone,
}: {
  emoji: string
  label: string
  value: string
  toneBar: number
  tone: StatusResult['tone']
}) {
  const styles = toneStyles(tone)
  return (
    <div className="rounded-2xl bg-white/10 p-3.5">
      <p className="text-xs text-white/70">
        {emoji} {label}
      </p>
      <p className="num mt-1 text-2xl">{value}</p>
      <div className="mt-2">
        <ProgressBar ratio={toneBar} tone={tone} />
      </div>
      <p className="mt-1 text-[11px] text-white/60">{styles.label}</p>
    </div>
  )
}
