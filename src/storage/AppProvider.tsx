import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { FOOD_CATALOG } from '../foods/catalog'
import type { Food } from '../foods/types'
import { AppStoreContext, type AppStore } from './context'
import { localStorageAdapter } from './local'
import { newId, type AppState, type LogEntry } from './schema'
import type { UserProfile } from '../users/types'

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => localStorageAdapter.load())

  useEffect(() => {
    localStorageAdapter.save(state)
  }, [state])

  const activeUser = state.users.find((u) => u.id === state.activeUserId) ?? state.users[0]
  const customFoods = state.customFoodsByUser[activeUser.id] ?? []

  const allFoodsForUser = useMemo(
    () => [...FOOD_CATALOG, ...customFoods],
    [customFoods],
  )

  const setActiveUser = useCallback((userId: string) => {
    setState((prev) => ({ ...prev, activeUserId: userId }))
  }, [])

  const updateUser = useCallback((userId: string, patch: Partial<UserProfile>) => {
    setState((prev) => ({
      ...prev,
      users: prev.users.map((u) => (u.id === userId ? { ...u, ...patch } : u)),
    }))
  }, [])

  const addUser = useCallback((profile: Omit<UserProfile, 'id' | 'createdAt'>) => {
    const id = newId('user')
    const user: UserProfile = {
      ...profile,
      id,
      createdAt: new Date().toISOString(),
    }
    setState((prev) => ({
      ...prev,
      users: [...prev.users, user],
      activeUserId: id,
      customFoodsByUser: { ...prev.customFoodsByUser, [id]: [] },
      logsByUser: { ...prev.logsByUser, [id]: [] },
    }))
  }, [])

  const addLog = useCallback(
    (input: { foodId: string; quantity: number; date: string }) => {
      const userId = activeUser.id
      setState((prev) => {
        const existing = prev.logsByUser[userId] ?? []
        const same = existing.find(
          (e) => e.date === input.date && e.foodId === input.foodId,
        )
        let nextLogs: LogEntry[]
        if (same) {
          nextLogs = existing.map((e) =>
            e.id === same.id
              ? {
                  ...e,
                  quantity: e.quantity + input.quantity,
                  updatedAt: new Date().toISOString(),
                }
              : e,
          )
        } else {
          const entry: LogEntry = {
            id: newId('log'),
            userId,
            date: input.date,
            foodId: input.foodId,
            quantity: input.quantity,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
          nextLogs = [...existing, entry]
        }
        return {
          ...prev,
          logsByUser: { ...prev.logsByUser, [userId]: nextLogs },
        }
      })
    },
    [activeUser.id],
  )

  const updateLog = useCallback(
    (entryId: string, patch: { quantity?: number }) => {
      const userId = activeUser.id
      setState((prev) => ({
        ...prev,
        logsByUser: {
          ...prev.logsByUser,
          [userId]: (prev.logsByUser[userId] ?? [])
            .map((e) =>
              e.id === entryId
                ? { ...e, ...patch, updatedAt: new Date().toISOString() }
                : e,
            )
            .filter((e) => (e.quantity ?? 0) > 0),
        },
      }))
    },
    [activeUser.id],
  )

  const removeLog = useCallback(
    (entryId: string) => {
      const userId = activeUser.id
      setState((prev) => ({
        ...prev,
        logsByUser: {
          ...prev.logsByUser,
          [userId]: (prev.logsByUser[userId] ?? []).filter((e) => e.id !== entryId),
        },
      }))
    },
    [activeUser.id],
  )

  const logsForDate = useCallback(
    (date: string) => (state.logsByUser[activeUser.id] ?? []).filter((e) => e.date === date),
    [state.logsByUser, activeUser.id],
  )

  const allLogs = useCallback(
    () => state.logsByUser[activeUser.id] ?? [],
    [state.logsByUser, activeUser.id],
  )

  const addCustomFood = useCallback(
    (food: Omit<Food, 'id' | 'isCustom' | 'ownerUserId'>) => {
      const created: Food = {
        ...food,
        id: newId('food'),
        isCustom: true,
        ownerUserId: activeUser.id,
      }
      setState((prev) => ({
        ...prev,
        customFoodsByUser: {
          ...prev.customFoodsByUser,
          [activeUser.id]: [...(prev.customFoodsByUser[activeUser.id] ?? []), created],
        },
      }))
      return created
    },
    [activeUser.id],
  )

  const value: AppStore = {
    state,
    activeUser,
    customFoods,
    allFoodsForUser,
    setActiveUser,
    updateUser,
    addUser,
    addLog,
    updateLog,
    removeLog,
    logsForDate,
    allLogs,
    addCustomFood,
  }

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>
}
