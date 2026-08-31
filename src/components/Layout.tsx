import { NavLink, Outlet } from 'react-router-dom'
import { BookOpen, ClipboardList, History, LayoutDashboard, UserRound } from 'lucide-react'
import { UserSelector } from './UserSelector'
import { Disclaimer } from './Disclaimer'
import { useAppStore } from '../storage/context'

const NAV = [
  { to: '/', label: 'Today', icon: LayoutDashboard, end: true },
  { to: '/log', label: 'Log', icon: ClipboardList },
  { to: '/history', label: 'History', icon: History },
  { to: '/profile', label: 'You', icon: UserRound },
  { to: '/sources', label: 'Sources', icon: BookOpen },
]

export function Layout() {
  const { error, busy, sessionRole, activeUser, sessionUserId } = useAppStore()
  const viewingOther = sessionRole === 'admin' && activeUser.id !== sessionUserId

  return (
    <div className="mx-auto flex min-h-dvh max-w-6xl flex-col px-4 pt-4 pb-24 sm:pb-8">
      <header className="mb-6 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-sage uppercase">Daily Intake</p>
          <p className="font-display text-lg text-ink">Junk food & nutrition</p>
        </div>
        <UserSelector />
      </header>

      {viewingOther ? (
        <p className="mb-4 rounded-2xl bg-amber-soft px-4 py-2 text-sm text-amber">
          Admin view: you are looking at <span className="font-semibold">{activeUser.displayName}</span>
          ’s logs. Logged times are shown on Today and Log. Anything you add or reset applies to her.
        </p>
      ) : null}
      {error ? (
        <p className="mb-4 rounded-2xl bg-coral-soft px-4 py-2 text-sm text-coral">{error}</p>
      ) : null}
      {busy ? <p className="mb-2 text-xs text-ink-soft">Updating…</p> : null}

      <div className="flex gap-6">
        <nav className="sticky top-6 hidden h-fit w-44 shrink-0 flex-col gap-1 sm:flex">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-2xl px-3 py-2.5 text-sm font-medium ${
                  isActive ? 'bg-sage text-white' : 'text-ink-soft hover:bg-card'
                }`
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <main className="min-w-0 flex-1">
          <Outlet />
          <div className="mt-8">
            <Disclaimer compact />
          </div>
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-parchment/95 px-2 py-2 backdrop-blur sm:hidden">
        <div className="mx-auto grid max-w-lg grid-cols-5">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 rounded-2xl py-2 text-[11px] font-medium ${
                  isActive ? 'text-sage' : 'text-ink-soft'
                }`
              }
            >
              <item.icon size={20} />
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
