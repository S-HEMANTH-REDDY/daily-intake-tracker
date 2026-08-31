import { createContext, useContext } from 'react'
import type { Food } from '../foods/types'
import type { AppState, LogEntry } from '../storage/schema'
import type { UserProfile } from '../users/types'

export interface AppStore {
  state: AppState
  activeUser: UserProfile
  customFoods: Food[]
  allFoodsForUser: Food[]
  setActiveUser: (userId: string) => void
  updateUser: (userId: string, patch: Partial<UserProfile>) => void
  addUser: (profile: Omit<UserProfile, 'id' | 'createdAt'>) => void
  addLog: (input: { foodId: string; quantity: number; date: string }) => void
  updateLog: (entryId: string, patch: { quantity?: number }) => void
  removeLog: (entryId: string) => void
  logsForDate: (date: string) => LogEntry[]
  allLogs: () => LogEntry[]
  addCustomFood: (food: Omit<Food, 'id' | 'isCustom' | 'ownerUserId'>) => Food
}

export const AppStoreContext = createContext<AppStore | null>(null)

export function useAppStore(): AppStore {
  const ctx = useContext(AppStoreContext)
  if (!ctx) throw new Error('useAppStore must be used within AppProvider')
  return ctx
}
