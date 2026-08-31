import { useAppStore } from '../storage/context'

export function UserSelector() {
  const { state, activeUser, setActiveUser } = useAppStore()

  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="hidden text-ink-soft sm:inline">Profile</span>
      <select
        value={activeUser.id}
        onChange={(e) => setActiveUser(e.target.value)}
        className="rounded-full border border-line bg-card px-3 py-2 font-semibold outline-none focus:ring-2 focus:ring-sage/30"
      >
        {state.users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.displayName}
          </option>
        ))}
      </select>
    </label>
  )
}
