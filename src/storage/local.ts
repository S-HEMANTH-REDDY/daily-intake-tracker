import { createInitialState, STORAGE_KEY, type AppState } from './schema'

export interface StorageAdapter {
  load(): AppState
  save(state: AppState): void
}

function migrate(raw: unknown): AppState {
  if (!raw || typeof raw !== 'object') return createInitialState()
  const data = raw as Partial<AppState>
  if (data.version !== 1 || !Array.isArray(data.users) || data.users.length === 0) {
    return createInitialState()
  }
  const base = createInitialState()
  return {
    version: 1,
    users: data.users,
    activeUserId:
      data.activeUserId && data.users.some((u) => u.id === data.activeUserId)
        ? data.activeUserId
        : data.users[0].id,
    customFoodsByUser: { ...base.customFoodsByUser, ...data.customFoodsByUser },
    logsByUser: { ...base.logsByUser, ...data.logsByUser },
  }
}

export const localStorageAdapter: StorageAdapter = {
  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return createInitialState()
      return migrate(JSON.parse(raw))
    } catch {
      return createInitialState()
    }
  },
  save(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  },
}
