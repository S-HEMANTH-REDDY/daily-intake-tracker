import { useAppStore } from '../storage/context'

export function UserSelector() {
  const { state, activeUser, sessionRole, setActiveUser, logout, busy } = useAppStore()
  const viewingOther = sessionRole === 'admin' && activeUser.id !== 'user-hemanth'

  return (
    <div className="flex items-center gap-2">
      {sessionRole === 'admin' ? (
        <label className="flex items-center gap-2 text-sm">
          <span className="hidden text-ink-soft sm:inline">Viewing</span>
          <select
            value={activeUser.id}
            disabled={busy}
            onChange={(e) => void setActiveUser(e.target.value)}
            className="rounded-full border border-line bg-card px-3 py-2 font-semibold outline-none focus:ring-2 focus:ring-sage/30"
          >
            {state.users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.displayName}
                {user.role === 'admin' ? ' (Admin)' : ''}
              </option>
            ))}
          </select>
        </label>
      ) : (
        <p className="rounded-full bg-card px-3 py-2 text-sm font-semibold">{activeUser.displayName}</p>
      )}
      {viewingOther ? (
        <span className="hidden rounded-full bg-amber-soft px-2 py-1 text-[11px] font-semibold text-amber sm:inline">
          Her log
        </span>
      ) : null}
      <button
        type="button"
        onClick={() => void logout()}
        className="rounded-full px-3 py-2 text-sm text-ink-soft hover:bg-card"
      >
        Log out
      </button>
    </div>
  )
}
