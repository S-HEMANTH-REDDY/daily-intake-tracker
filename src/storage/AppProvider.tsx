import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { FOOD_CATALOG } from '../foods/catalog'
import type { Food } from '../foods/types'
import { todayKey } from '../calculations/dates'
import { LoginScreen } from '../components/LoginScreen'
import type { UserProfile, UserRole } from '../users/types'
import { apiFetch, ApiError } from './api'
import { AppStoreContext, type AppStore } from './context'
import type { AppState, LogEntry } from './schema'

interface StatePayload {
  users: UserProfile[]
  activeUserId: string
  sessionUserId: string
  customFoods: Food[]
  logs: LogEntry[]
}

interface MePayload {
  userId: string
  role: UserRole
  viewingUserId: string
  displayName?: string
}

function toState(payload: StatePayload): AppState {
  return {
    version: 1,
    users: payload.users,
    activeUserId: payload.activeUserId,
    customFoodsByUser: { [payload.activeUserId]: payload.customFoods },
    logsByUser: { [payload.activeUserId]: payload.logs },
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState | null>(null)
  const [sessionUserId, setSessionUserId] = useState('')
  const [sessionRole, setSessionRole] = useState<UserRole>('member')
  const [boot, setBoot] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const pendingProfile = useRef<Partial<UserProfile>>({})
  const profileTimer = useRef<number | null>(null)
  const profileUserId = useRef<string | null>(null)

  const applyPayload = useCallback((payload: StatePayload, role?: UserRole) => {
    setState(toState(payload))
    setSessionUserId(payload.sessionUserId)
    if (role) setSessionRole(role)
  }, [])

  const refresh = useCallback(async () => {
    const me = await apiFetch<MePayload>('/api/me')
    const payload = await apiFetch<StatePayload>('/api/state')
    applyPayload(payload, me.role)
  }, [applyPayload])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        await refresh()
      } catch (err) {
        if (!(err instanceof ApiError && err.status === 401) && !cancelled) {
          setError(err instanceof Error ? err.message : 'Could not load')
        }
        if (!cancelled) setState(null)
      } finally {
        if (!cancelled) setBoot(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [refresh])

  const flushProfile = useCallback(async () => {
    const userId = profileUserId.current
    const patch = pendingProfile.current
    pendingProfile.current = {}
    profileUserId.current = null
    if (profileTimer.current) {
      window.clearTimeout(profileTimer.current)
      profileTimer.current = null
    }
    if (!userId || Object.keys(patch).length === 0) return
    const data = await apiFetch<{ users: UserProfile[] }>('/api/profile', {
      method: 'PATCH',
      body: JSON.stringify({ userId, patch }),
    })
    setState((prev) => (prev ? { ...prev, users: data.users } : prev))
  }, [])

  const activeUser = state?.users.find((u) => u.id === state.activeUserId) ?? state?.users[0]
  const customFoods = activeUser ? (state?.customFoodsByUser[activeUser.id] ?? []) : []

  const allFoodsForUser = useMemo(
    () => [...FOOD_CATALOG, ...customFoods],
    [customFoods],
  )

  const setActiveUser = useCallback(
    async (userId: string) => {
      if (sessionRole !== 'admin') return
      await flushProfile()
      setBusy(true)
      setError(null)
      try {
        const payload = await apiFetch<StatePayload>('/api/view', {
          method: 'POST',
          body: JSON.stringify({ userId }),
        })
        applyPayload(payload, 'admin')
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not switch profile')
      } finally {
        setBusy(false)
      }
    },
    [applyPayload, flushProfile, sessionRole],
  )

  const updateUser = useCallback((userId: string, patch: Partial<UserProfile>) => {
    setState((prev) =>
      prev
        ? {
            ...prev,
            users: prev.users.map((u) => (u.id === userId ? { ...u, ...patch } : u)),
          }
        : prev,
    )
    pendingProfile.current = { ...pendingProfile.current, ...patch }
    profileUserId.current = userId
    if (profileTimer.current) window.clearTimeout(profileTimer.current)
    profileTimer.current = window.setTimeout(() => {
      void flushProfile().catch((err: Error) => setError(err.message))
    }, 400)
  }, [flushProfile])

  const addLog = useCallback(
    async (input: { foodId: string; quantity: number; date: string }) => {
      setError(null)
      const data = await apiFetch<{ logs: LogEntry[] }>('/api/logs', {
        method: 'POST',
        body: JSON.stringify(input),
      })
      setState((prev) =>
        prev
          ? { ...prev, logsByUser: { ...prev.logsByUser, [prev.activeUserId]: data.logs } }
          : prev,
      )
    },
    [],
  )

  const updateLog = useCallback(async (entryId: string, patch: { quantity?: number }) => {
    if (patch.quantity == null) return
    setError(null)
    const data = await apiFetch<{ logs: LogEntry[] }>('/api/logs', {
      method: 'PATCH',
      body: JSON.stringify({ id: entryId, quantity: patch.quantity }),
    })
    setState((prev) =>
      prev
        ? { ...prev, logsByUser: { ...prev.logsByUser, [prev.activeUserId]: data.logs } }
        : prev,
    )
  }, [])

  const removeLog = useCallback(async (entryId: string) => {
    setError(null)
    const data = await apiFetch<{ logs: LogEntry[] }>('/api/logs', {
      method: 'DELETE',
      body: JSON.stringify({ id: entryId }),
    })
    setState((prev) =>
      prev
        ? { ...prev, logsByUser: { ...prev.logsByUser, [prev.activeUserId]: data.logs } }
        : prev,
    )
  }, [])

  const logsForDate = useCallback(
    (date: string) => (state?.logsByUser[state.activeUserId] ?? []).filter((e) => e.date === date),
    [state],
  )

  const allLogs = useCallback(
    () => state?.logsByUser[state.activeUserId] ?? [],
    [state],
  )

  const addCustomFood = useCallback(
    async (food: Omit<Food, 'id' | 'isCustom' | 'ownerUserId'>) => {
      setError(null)
      const data = await apiFetch<{ food: Food; customFoods: Food[] }>('/api/foods', {
        method: 'POST',
        body: JSON.stringify({ food }),
      })
      setState((prev) =>
        prev
          ? {
              ...prev,
              customFoodsByUser: {
                ...prev.customFoodsByUser,
                [prev.activeUserId]: data.customFoods,
              },
            }
          : prev,
      )
      return data.food
    },
    [],
  )

  const resetLogs = useCallback(
    async (userId: string, scope: 'today' | 'all') => {
      if (sessionRole !== 'admin') return
      setBusy(true)
      setError(null)
      try {
        await apiFetch('/api/admin/reset', {
          method: 'POST',
          body: JSON.stringify({ userId, scope, today: todayKey() }),
        })
        await refresh()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not reset')
      } finally {
        setBusy(false)
      }
    },
    [refresh, sessionRole],
  )

  const logout = useCallback(async () => {
    await flushProfile()
    await apiFetch('/api/logout', { method: 'POST' })
    setState(null)
    setSessionUserId('')
    setSessionRole('member')
  }, [flushProfile])

  if (boot) {
    return <p className="p-6 text-ink-soft">Loading…</p>
  }

  if (!state || !activeUser) {
    return <LoginScreen onLoggedIn={refresh} />
  }

  const value: AppStore = {
    state,
    activeUser,
    sessionUserId,
    sessionRole,
    customFoods,
    allFoodsForUser,
    busy,
    error,
    setActiveUser,
    updateUser,
    addLog,
    updateLog,
    removeLog,
    logsForDate,
    allLogs,
    addCustomFood,
    resetLogs,
    logout,
  }

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>
}
