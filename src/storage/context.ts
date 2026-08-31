import { createContext, useContext } from 'react'
import type { Food } from '../foods/types'
import type { AppState, LogEntry } from '../storage/schema'
import type { UserProfile, UserRole } from '../users/types'

export interface AppStore {
  state: AppState
  activeUser: UserProfile
  sessionUserId: string
  sessionRole: UserRole
  customFoods: Food[]
  allFoodsForUser: Food[]
  busy: boolean
  error: string | null
  setActiveUser: (userId: string) => Promise<void>
  updateUser: (userId: string, patch: Partial<UserProfile>) => void
  addLog: (input: { foodId: string; quantity: number; date: string }) => Promise<void>
  updateLog: (entryId: string, patch: { quantity?: number }) => Promise<void>
  removeLog: (entryId: string) => Promise<void>
  logsForDate: (date: string) => LogEntry[]
  allLogs: () => LogEntry[]
  addCustomFood: (food: Omit<Food, 'id' | 'isCustom' | 'ownerUserId'>) => Promise<Food>
  resetLogs: (userId: string, scope: 'today' | 'all') => Promise<void>
  logout: () => Promise<void>
}

export const AppStoreContext = createContext<AppStore | null>(null)

export function useAppStore(): AppStore {
  const ctx = useContext(AppStoreContext)
  if (!ctx) throw new Error('useAppStore must be used within AppProvider')
  return ctx
}
