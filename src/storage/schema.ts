import type { Food } from '../foods/types'
import type { UserProfile } from '../users/types'
import { SEED_USERS } from '../users/seed'

export interface LogEntry {
  id: string
  userId: string
  date: string
  foodId: string
  quantity: number
  createdAt: string
  updatedAt: string
}

export interface AppState {
  version: 1
  users: UserProfile[]
  activeUserId: string
  customFoodsByUser: Record<string, Food[]>
  logsByUser: Record<string, LogEntry[]>
}

export const STORAGE_KEY = 'daily-intake-tracker:v1'

export function createInitialState(): AppState {
  const users = SEED_USERS.map((u) => ({ ...u }))
  return {
    version: 1,
    users,
    activeUserId: users[0].id,
    customFoodsByUser: Object.fromEntries(users.map((u) => [u.id, []])),
    logsByUser: Object.fromEntries(users.map((u) => [u.id, []])),
  }
}

export function newId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID()}`
}
