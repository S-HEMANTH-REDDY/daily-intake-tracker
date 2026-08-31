import type { ActivityLevel, Sex } from '../src/users/types.js'
import { env } from './env.js'

export type Role = 'admin' | 'member'

export interface Account {
  id: string
  displayName: string
  role: Role
  pinEnv: 'PIN_HEMANTH' | 'PIN_SREENIDHEE'
  age: number | null
  sex: Sex
  heightCm: number | null
  weightKg: number | null
  activityLevel: ActivityLevel
}

export const ACCOUNTS: Account[] = [
  {
    id: 'user-hemanth',
    displayName: 'Hemanth',
    role: 'admin',
    pinEnv: 'PIN_HEMANTH',
    age: null,
    sex: 'unspecified',
    heightCm: null,
    weightKg: null,
    activityLevel: 'moderate',
  },
  {
    id: 'user-sreenidhee',
    displayName: 'Sreenidhee',
    role: 'member',
    pinEnv: 'PIN_SREENIDHEE',
    age: 23,
    sex: 'female',
    heightCm: null,
    weightKg: null,
    activityLevel: 'moderate',
  },
]

export function getAccount(id: string): Account | undefined {
  return ACCOUNTS.find((a) => a.id === id)
}

export function pinFor(account: Account): string | undefined {
  const value = env(account.pinEnv)?.trim()
  return value || undefined
}
