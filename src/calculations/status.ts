export type LimitKind = 'established' | 'calculated' | 'app_guideline'
export type NutrientRole = 'upper_limit' | 'daily_target' | 'goal'
export type StatusTone = 'within' | 'approaching' | 'exceeded' | 'below_goal' | 'goal_met'

export interface NutrientTarget {
  id: string
  label: string
  emoji: string
  unit: string
  value: number
  role: NutrientRole
  kind: LimitKind
  sourceSummary: string
  sourceUrl: string
}

export interface CategoryGuideline {
  category: string
  label: string
  emoji: string
  unit: string
  value: number
  kind: 'app_guideline'
  role?: 'upper_limit' | 'goal'
  derivation: string
}

export interface StatusResult {
  tone: StatusTone
  ratio: number
  remaining: number
  overBy: number
  message: string
}

const APPROACHING_RATIO = 0.8

export function statusForLimit(
  intake: number,
  limit: number,
  unitLabel: string,
  name = 'Intake',
): StatusResult {
  if (limit <= 0) {
    return {
      tone: intake > 0 ? 'exceeded' : 'within',
      ratio: intake > 0 ? 2 : 0,
      remaining: 0,
      overBy: intake,
      message:
        intake > 0
          ? `Intake is ${formatDelta(intake, unitLabel)} above today's tracking threshold.`
          : "You're within today's guideline.",
    }
  }

  const ratio = intake / limit
  const remaining = Math.max(0, limit - intake)
  const overBy = Math.max(0, intake - limit)

  if (ratio > 1) {
    return {
      tone: 'exceeded',
      ratio,
      remaining,
      overBy,
      message: `${name} is ${formatDelta(overBy, unitLabel)} above today's guideline.`,
    }
  }
  if (ratio >= APPROACHING_RATIO) {
    return {
      tone: 'approaching',
      ratio,
      remaining,
      overBy,
      message: "You're getting close to today's guideline.",
    }
  }
  return {
    tone: 'within',
    ratio,
    remaining,
    overBy,
    message: "You're within today's guideline.",
  }
}

export function statusForGoal(intake: number, goal: number, unitLabel: string): StatusResult {
  if (goal <= 0) {
    return {
      tone: 'goal_met',
      ratio: 1,
      remaining: 0,
      overBy: 0,
      message: 'No goal is set for this nutrient.',
    }
  }
  const ratio = intake / goal
  const remaining = Math.max(0, goal - intake)
  if (ratio >= 1) {
    return {
      tone: 'goal_met',
      ratio,
      remaining: 0,
      overBy: intake - goal,
      message: `${capitalize(unitLabel)} goal is met for today.`,
    }
  }
  if (ratio >= APPROACHING_RATIO) {
    return {
      tone: 'approaching',
      ratio,
      remaining,
      overBy: 0,
      message: "You're getting close to today's goal.",
    }
  }
  return {
    tone: 'below_goal',
    ratio,
    remaining,
    overBy: 0,
    message: `${formatDelta(remaining, unitLabel)} remaining to reach today's goal.`,
  }
}

function formatDelta(value: number, unitLabel: string): string {
  const digits = unitLabel.includes('kcal') || unitLabel.includes('mg') || unitLabel.includes('cookie') || unitLabel.includes('serving') || unitLabel.includes('drink') || unitLabel.includes('bottle')
    ? 0
    : 1
  const n = Number(value.toFixed(digits))
  const formatted = n.toLocaleString(undefined, { maximumFractionDigits: digits })
  return `${formatted}${unitLabel.startsWith(' ') ? unitLabel : ` ${unitLabel}`}`
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}
