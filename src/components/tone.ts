import type { StatusTone } from '../calculations/status'

export function toneStyles(tone: StatusTone): {
  bar: string
  badge: string
  text: string
  label: string
  emoji: string
} {
  if (tone === 'exceeded') {
    return {
      bar: 'bg-coral',
      badge: 'bg-coral-soft text-coral',
      text: 'text-coral',
      label: 'Exceeded guideline',
      emoji: '🔴',
    }
  }
  if (tone === 'approaching') {
    return {
      bar: 'bg-amber',
      badge: 'bg-amber-soft text-amber',
      text: 'text-amber',
      label: 'Approaching guideline',
      emoji: '🟡',
    }
  }
  if (tone === 'goal_met') {
    return {
      bar: 'bg-sage',
      badge: 'bg-sage-soft text-sage',
      text: 'text-sage',
      label: 'Goal met',
      emoji: '🟢',
    }
  }
  if (tone === 'below_goal') {
    return {
      bar: 'bg-sage-2',
      badge: 'bg-sage-soft text-sage',
      text: 'text-ink-soft',
      label: 'Below goal',
      emoji: '🟢',
    }
  }
  return {
    bar: 'bg-sage',
    badge: 'bg-sage-soft text-sage',
    text: 'text-sage',
    label: 'Within guideline',
    emoji: '🟢',
  }
}
