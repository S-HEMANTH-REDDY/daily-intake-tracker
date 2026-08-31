import { useEffect, useState, type FormEvent } from 'react'
import { apiFetch } from '../storage/api'

interface PublicAccount {
  id: string
  displayName: string
  role: 'admin' | 'member'
}

export function LoginScreen({ onLoggedIn }: { onLoggedIn: () => Promise<void> }) {
  const [accounts, setAccounts] = useState<PublicAccount[]>([])
  const [accountId, setAccountId] = useState<string | null>(null)
  const [pin, setPin] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    apiFetch<{ accounts: PublicAccount[] }>('/api/accounts')
      .then((data) => setAccounts(data.accounts))
      .catch((err: Error) => setError(err.message))
  }, [])

  const selected = accounts.find((a) => a.id === accountId)

  async function submit(event: FormEvent) {
    event.preventDefault()
    if (!accountId || !pin.trim()) return
    setSubmitting(true)
    setError(null)
    try {
      await apiFetch('/api/login', {
        method: 'POST',
        body: JSON.stringify({ accountId, pin: pin.trim() }),
      })
      await onLoggedIn()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not sign in')
      setPin('')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-4 py-10">
      <p className="text-xs font-semibold tracking-[0.2em] text-sage uppercase">Daily Intake</p>
      <h1 className="font-display mt-2 text-3xl">Who’s logging?</h1>
      <p className="mt-2 text-ink-soft">
        Shared tracker for two people. Pick your name and enter your PIN. Logs live on the server, so
        both of you see the same day.
      </p>

      <div className="mt-6 grid gap-3">
        {accounts.map((account) => (
          <button
            key={account.id}
            type="button"
            onClick={() => {
              setAccountId(account.id)
              setPin('')
              setError(null)
            }}
            className={`rounded-3xl border px-4 py-4 text-left transition ${
              accountId === account.id
                ? 'border-sage bg-sage text-white'
                : 'border-line bg-card text-ink'
            }`}
          >
            <p className="font-display text-xl">{account.displayName}</p>
            <p className={`text-sm ${accountId === account.id ? 'text-white/80' : 'text-ink-soft'}`}>
              {account.role === 'admin'
                ? 'Admin — can view both logs, add entries, and reset'
                : 'Your log — Hemanth (admin) can also view and manage it'}
            </p>
          </button>
        ))}
      </div>

      {selected ? (
        <form className="card-shadow mt-6 space-y-3 rounded-3xl bg-card p-5" onSubmit={submit}>
          {selected.role === 'member' ? (
            <p className="rounded-2xl bg-sage-soft/80 px-3 py-2.5 text-sm text-ink">
              <span className="font-semibold">Privacy:</span> Hemanth (admin) can view your log,
              see when you logged each item, add or edit food for you, reset logs, and update your
              profile.
            </p>
          ) : null}
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium text-ink-soft">PIN for {selected.displayName}</span>
            <input
              autoFocus
              inputMode="numeric"
              autoComplete="one-time-code"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 8))}
              className="w-full rounded-2xl border border-line px-3 py-3 text-center text-2xl tracking-[0.4em]"
            />
          </label>
          {error ? <p className="text-sm text-coral">{error}</p> : null}
          <button
            type="submit"
            disabled={submitting || pin.length < 4}
            className="w-full rounded-full bg-sage py-3 font-semibold text-white disabled:opacity-50"
          >
            {submitting ? 'Opening…' : 'Open'}
          </button>
        </form>
      ) : error && accounts.length === 0 ? (
        <p className="mt-6 text-sm text-coral">{error}</p>
      ) : null}
    </div>
  )
}
