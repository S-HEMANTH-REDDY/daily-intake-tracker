import { useState, type ReactNode } from 'react'
import { ACTIVITY_LEVELS, SEX_OPTIONS, type ActivityLevel, type Sex } from '../users/types'
import { useAppStore } from '../storage/context'
import { buildNutrientTargets } from '../recommendations/personalize'
import { calorieTarget } from '../calculations/energy'

const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
  sedentary: 'Sedentary (little or no exercise)',
  light: 'Light (1–3 days/week)',
  moderate: 'Moderate (3–5 days/week)',
  active: 'Active (6–7 days/week)',
  very_active: 'Very active (physical job or 2× training)',
}

export function ProfilePage() {
  const { state, activeUser, updateUser, addUser, setActiveUser } = useAppStore()
  const [adding, setAdding] = useState(false)
  const [newName, setNewName] = useState('')
  const [newAge, setNewAge] = useState('')
  const [newSex, setNewSex] = useState<Sex>('unspecified')
  const targets = buildNutrientTargets(activeUser)
  const energy = calorieTarget(activeUser)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl">Profiles</h1>
        <p className="mt-1 text-ink-soft">
          Each person has separate logs, totals, targets, and history. Switching profiles never mixes data.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {state.users.map((user) => (
          <button
            key={user.id}
            type="button"
            onClick={() => setActiveUser(user.id)}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              user.id === activeUser.id ? 'bg-sage text-white' : 'bg-card text-ink'
            }`}
          >
            {user.displayName}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="rounded-full border border-dashed border-line px-4 py-2 text-sm font-semibold"
        >
          Add person
        </button>
      </div>

      {adding ? (
        <form
          className="card-shadow space-y-3 rounded-3xl bg-card p-5"
          onSubmit={(e) => {
            e.preventDefault()
            if (!newName.trim()) return
            addUser({
              displayName: newName.trim(),
              age: newAge ? Number(newAge) : null,
              sex: newSex,
              heightCm: null,
              weightKg: null,
              activityLevel: 'moderate',
            })
            setAdding(false)
            setNewName('')
            setNewAge('')
            setNewSex('unspecified')
          }}
        >
          <h2 className="font-semibold">New profile</h2>
          <input
            required
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Name"
            className="w-full rounded-2xl border border-line px-3 py-2.5"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              value={newAge}
              onChange={(e) => setNewAge(e.target.value)}
              placeholder="Age"
              type="number"
              min={1}
              max={120}
              className="rounded-2xl border border-line px-3 py-2.5"
            />
            <select
              value={newSex}
              onChange={(e) => setNewSex(e.target.value as Sex)}
              className="rounded-2xl border border-line px-3 py-2.5"
            >
              {SEX_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="rounded-full bg-sage px-4 py-2 text-sm font-semibold text-white">
              Save
            </button>
            <button type="button" onClick={() => setAdding(false)} className="rounded-full px-4 py-2 text-sm">
              Cancel
            </button>
          </div>
        </form>
      ) : null}

      <form
        className="card-shadow space-y-4 rounded-3xl bg-card p-5"
        onSubmit={(e) => e.preventDefault()}
      >
        <h2 className="font-display text-2xl">{activeUser.displayName}</h2>
        <Field label="Display name">
          <input
            value={activeUser.displayName}
            onChange={(e) => updateUser(activeUser.id, { displayName: e.target.value })}
            className="w-full rounded-2xl border border-line px-3 py-2.5"
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Age">
            <input
              type="number"
              min={1}
              max={120}
              value={activeUser.age ?? ''}
              onChange={(e) =>
                updateUser(activeUser.id, { age: e.target.value ? Number(e.target.value) : null })
              }
              className="w-full rounded-2xl border border-line px-3 py-2.5"
            />
          </Field>
          <Field label="Sex (used for AHA sugar and DGA calorie tables)">
            <select
              value={activeUser.sex}
              onChange={(e) => updateUser(activeUser.id, { sex: e.target.value as Sex })}
              className="w-full rounded-2xl border border-line px-3 py-2.5"
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
              value={activeUser.heightCm ?? ''}
              onChange={(e) =>
                updateUser(activeUser.id, { heightCm: e.target.value ? Number(e.target.value) : null })
              }
              className="w-full rounded-2xl border border-line px-3 py-2.5"
            />
          </Field>
          <Field label="Weight (kg)">
            <input
              type="number"
              min={20}
              max={400}
              value={activeUser.weightKg ?? ''}
              onChange={(e) =>
                updateUser(activeUser.id, { weightKg: e.target.value ? Number(e.target.value) : null })
              }
              className="w-full rounded-2xl border border-line px-3 py-2.5"
            />
          </Field>
        </div>
        <Field label="Activity level">
          <select
            value={activeUser.activityLevel}
            onChange={(e) =>
              updateUser(activeUser.id, { activityLevel: e.target.value as ActivityLevel })
            }
            className="w-full rounded-2xl border border-line px-3 py-2.5"
          >
            {ACTIVITY_LEVELS.map((level) => (
              <option key={level} value={level}>
                {ACTIVITY_LABELS[level]}
              </option>
            ))}
          </select>
        </Field>
      </form>

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
