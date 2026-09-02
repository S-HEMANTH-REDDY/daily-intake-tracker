export const SEX_OPTIONS = ['female', 'male', 'unspecified'] as const
export type Sex = (typeof SEX_OPTIONS)[number]

export const ACTIVITY_LEVELS = [
  'sedentary',
  'light',
  'moderate',
  'active',
  'very_active',
] as const
export type ActivityLevel = (typeof ACTIVITY_LEVELS)[number]

export type UserRole = 'admin' | 'member'

export interface UserProfile {
  id: string
  displayName: string
  role: UserRole
  age: number | null
  sex: Sex
  heightCm: number | null
  weightKg: number | null
  activityLevel: ActivityLevel
  /** How many vitamin/supplement tablets you aim to take per day (set on Profile). */
  supplementTabletsGoal: number
  createdAt: string
}
