import { type ReactNode } from 'react'
import { ACTIVITY_LEVELS, SEX_OPTIONS, type ActivityLevel, type Sex } from '../users/types'
import { useAppStore } from '../storage/context'
import { buildNutrientTargets } from '../recommendations/personalize'
import { calorieTarget } from '../calculations/energy'
import { MemberPrivacyNotice, formatAdminLabel } from '../components/MemberPrivacyNotice'
import { ADMIN_DISPLAY_NAME } from '../users/admin'
import { useLogPermissions } from '../hooks/useLogPermissions'

const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
  sedentary: 'Sedentary (little or no exercise)',
  light: 'Light (1–3 days/week)',
  moderate: 'Moderate (3–5 days/week)',
  active: 'Active (6–7 days/week)',
  very_active: 'Very active (physical job or 2× training)',
}

export function ProfilePage() {
  const { state, activeUser, updateUser, setActiveUser, sessionRole, resetLogs, busy } = useAppStore()
  const targets = buildNutrientTargets(activeUser)
  const energy = calorieTarget(activeUser)
  const isAdmin = sessionRole === 'admin'
  const { readOnly, isMemberViewingAdmin } = useLogPermissions()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl">
          {isAdmin ? 'Profiles' : isMemberViewingAdmin ? `${activeUser.displayName}'s profile` : 'Your profile'}
        </h1>
        <p className="mt-1 text-ink-soft">
          {isAdmin
            ? 'Switch whose log you are viewing. Reset is admin-only and cannot be undone.'
            : isMemberViewingAdmin
              ? `Read-only view of ${formatAdminLabel(activeUser.displayName)}'s profile and targets. Use the header menu to switch back to your log.`
              : `Update your details here. Your food log is shared with ${formatAdminLabel(ADMIN_DISPLAY_NAME)} (see below).`}
        </p>
      </div>

      {!isAdmin && !readOnly ? <MemberPrivacyNotice adminName={ADMIN_DISPLAY_NAME} variant="card" /> : null}

      {isAdmin ? (
        <div className="flex flex-wrap gap-2">
          {state.users.map((user) => (
            <button
              key={user.id}
              type="button"
              onClick={() => void setActiveUser(user.id)}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                user.id === activeUser.id ? 'bg-sage text-white' : 'bg-card text-ink'
              }`}
            >
              {user.displayName}
              {user.role === 'admin' ? ' · Admin' : ''}
            </button>
          ))}
        </div>
      ) : null}

      <form
        className="card-shadow space-y-4 rounded-3xl bg-card p-5"
        onSubmit={(e) => e.preventDefault()}
      >
        <h2 className="font-display text-2xl">{activeUser.displayName}</h2>
        <Field label="Display name">
          <input
            value={activeUser.displayName}
            disabled={readOnly}
            onChange={(e) => updateUser(activeUser.id, { displayName: e.target.value })}
            className="w-full rounded-2xl border border-line px-3 py-2.5 disabled:bg-parchment disabled:text-ink-soft"
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Age">
            <input
              type="number"
              min={1}
              max={120}
              disabled={readOnly}
              value={activeUser.age ?? ''}
              onChange={(e) =>
                updateUser(activeUser.id, { age: e.target.value ? Number(e.target.value) : null })
              }
              className="w-full rounded-2xl border border-line px-3 py-2.5 disabled:bg-parchment disabled:text-ink-soft"
            />
          </Field>
          <Field label="Sex (used for AHA sugar and DGA calorie tables)">
            <select
              value={activeUser.sex}
              disabled={readOnly}
              onChange={(e) => updateUser(activeUser.id, { sex: e.target.value as Sex })}
              className="w-full rounded-2xl border border-line px-3 py-2.5 disabled:bg-parchment disabled:text-ink-soft"
            >
              {SEX_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Height (cm)">
            <input
              type="number"
              min={80}
              max={250}
              disabled={readOnly}
              value={activeUser.heightCm ?? ''}
              onChange={(e) =>
                updateUser(activeUser.id, { heightCm: e.target.value ? Number(e.target.value) : null })
              }
              className="w-full rounded-2xl border border-line px-3 py-2.5 disabled:bg-parchment disabled:text-ink-soft"
            />
          </Field>
          <Field label="Weight (kg)">
            <input
              type="number"
              min={20}
              max={400}
              disabled={readOnly}
              value={activeUser.weightKg ?? ''}
              onChange={(e) =>
                updateUser(activeUser.id, { weightKg: e.target.value ? Number(e.target.value) : null })
              }
              className="w-full rounded-2xl border border-line px-3 py-2.5 disabled:bg-parchment disabled:text-ink-soft"
            />
          </Field>
        </div>
        <Field label="Activity level">
          <select
            value={activeUser.activityLevel}
            disabled={readOnly}
            onChange={(e) =>
              updateUser(activeUser.id, { activityLevel: e.target.value as ActivityLevel })
            }
            className="w-full rounded-2xl border border-line px-3 py-2.5 disabled:bg-parchment disabled:text-ink-soft"
          >
            {ACTIVITY_LEVELS.map((level) => (
              <option key={level} value={level}>
                {ACTIVITY_LABELS[level]}
              </option>
            ))}
          </select>
        </Field>
      </form>

      {isAdmin ? (
        <section className="card-shadow space-y-3 rounded-3xl bg-card p-5">
          <h2 className="font-display text-2xl">Admin reset</h2>
          <p className="text-sm text-ink-soft">
            Clears food logs for {activeUser.displayName}. Custom foods and profile details stay.
            Sreenidhee cannot do this.
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                if (confirm(`Clear today's log for ${activeUser.displayName}?`)) {
                  void resetLogs(activeUser.id, 'today')
                }
              }}
              className="rounded-full bg-amber px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              Reset today
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                if (confirm(`Delete ALL logs for ${activeUser.displayName}? This cannot be undone.`)) {
                  void resetLogs(activeUser.id, 'all')
                }
              }}
              className="rounded-full bg-coral px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              Reset all logs
            </button>
          </div>
        </section>
      ) : null}

      <section className="card-shadow rounded-3xl bg-card p-5">
        <h2 className="font-display text-2xl">Current targets</h2>
        <p className="mt-1 text-sm text-ink-soft">{energy.method}</p>
        <ul className="mt-4 space-y-3">
          {targets.map((t) => (
            <li key={t.id} className="border-b border-line pb-3 last:border-0">
              <p className="font-semibold">
                {t.emoji} {t.label}: {t.value.toLocaleString()} {t.unit}{' '}
                <span className="font-normal text-ink-soft">
                  ({t.role.replace('_', ' ')} · {t.kind.replace('_', ' ')})
                </span>
              </p>
              <p className="mt-1 text-sm text-ink-soft">{t.sourceSummary}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block font-medium text-ink-soft">{label}</span>
      {children}
    </label>
  )
}
