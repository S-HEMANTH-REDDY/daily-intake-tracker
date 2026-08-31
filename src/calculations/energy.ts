import type { ActivityLevel, Sex, UserProfile } from '../users/types'

/** Mifflin-St Jeor, 1990. Used when age, sex, height, and weight are all present. */
export function mifflinStJeorBmr(input: {
  sex: Sex
  weightKg: number
  heightCm: number
  age: number
}): number | null {
  if (input.sex === 'unspecified') return null
  const base = 10 * input.weightKg + 6.25 * input.heightCm - 5 * input.age
  return input.sex === 'male' ? base + 5 : base - 161
}

export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
}

/**
 * Dietary Guidelines for Americans estimated calorie needs when anthropometrics
 * are incomplete. Midpoint of the 19–30 adult ranges by activity, then
 * age-adjusted using the DGA pattern of lower needs after 30/50.
 * Source: Dietary Guidelines for Americans, estimated calorie needs by age, sex, and activity.
 */
export function estimatedCaloriesFromAgeSexActivity(user: UserProfile): number {
  const activity = user.activityLevel
  const age = user.age ?? 30

  if (user.sex === 'female') {
    let sedentary = 1800
    let moderate = 2000
    let active = 2400
    if (age >= 51) {
      sedentary = 1600
      moderate = 1800
      active = 2200
    } else if (age >= 31) {
      sedentary = 1800
      moderate = 2000
      active = 2200
    } else {
      sedentary = 1800
      moderate = 2000
      active = 2400
    }
    if (activity === 'sedentary') return sedentary
    if (activity === 'light') return Math.round((sedentary + moderate) / 2)
    if (activity === 'moderate') return moderate
    if (activity === 'active') return active
    return Math.round(active * 1.05)
  }

  if (user.sex === 'male') {
    let sedentary = 2400
    let moderate = 2600
    let active = 3000
    if (age >= 51) {
      sedentary = 2000
      moderate = 2400
      active = 2800
    } else if (age >= 31) {
      sedentary = 2200
      moderate = 2600
      active = 2800
    } else {
      sedentary = 2400
      moderate = 2800
      active = 3000
    }
    if (activity === 'sedentary') return sedentary
    if (activity === 'light') return Math.round((sedentary + moderate) / 2)
    if (activity === 'moderate') return moderate
    if (activity === 'active') return active
    return Math.round(active * 1.05)
  }

  return 2000
}

export function calorieTarget(user: UserProfile): {
  kcal: number
  kind: 'calculated' | 'established'
  method: string
} {
  if (
    user.age != null &&
    user.sex !== 'unspecified' &&
    user.heightCm != null &&
    user.weightKg != null
  ) {
    const bmr = mifflinStJeorBmr({
      sex: user.sex,
      weightKg: user.weightKg,
      heightCm: user.heightCm,
      age: user.age,
    })
    if (bmr != null) {
      const kcal = Math.round(bmr * ACTIVITY_MULTIPLIERS[user.activityLevel])
      return {
        kcal,
        kind: 'calculated',
        method:
          'Mifflin-St Jeor resting energy estimate × activity factor. This is an estimate of energy needs, not a medical prescription.',
      }
    }
  }

  if (user.sex === 'unspecified' && user.age == null) {
    return {
      kcal: 2000,
      kind: 'established',
      method:
        'FDA Nutrition Facts Daily Value reference of 2,000 kcal, used because age and sex are not set. Update the profile for a personalized estimate.',
    }
  }

  return {
    kcal: estimatedCaloriesFromAgeSexActivity(user),
    kind: 'calculated',
    method:
      'Estimated from Dietary Guidelines for Americans calorie-need tables by age, sex, and activity, because height or weight is not set.',
  }
}
