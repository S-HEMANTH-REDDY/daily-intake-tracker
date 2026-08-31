import { Shield } from 'lucide-react'

export function MemberPrivacyNotice({
  adminName,
  variant = 'banner',
}: {
  adminName: string
  variant?: 'banner' | 'card'
}) {
  const body = (
    <>
      This is a shared tracker. <span className="font-semibold">{adminName} (admin)</span> can view
      your food log (including when each item was logged), add or edit entries for you, reset today or
      all logs, and update your profile. Only you can sign in with your PIN.
    </>
  )

  if (variant === 'card') {
    return (
      <section className="card-shadow rounded-3xl bg-card p-5">
        <div className="flex gap-3">
          <Shield size={22} className="mt-0.5 shrink-0 text-sage" aria-hidden />
          <div>
            <h2 className="font-display text-xl">Shared with admin</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{body}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <p className="mb-4 flex gap-2 rounded-2xl bg-sage-soft/80 px-4 py-3 text-sm text-ink">
      <Shield size={18} className="mt-0.5 shrink-0 text-sage" aria-hidden />
      <span>{body}</span>
    </p>
  )
}
