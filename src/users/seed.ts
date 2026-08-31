export const SEED_USERS = [
  {
    id: 'user-hemanth',
    displayName: 'Hemanth',
    role: 'admin' as const,
    age: null as number | null,
    sex: 'unspecified' as const,
    heightCm: null as number | null,
    weightKg: null as number | null,
    activityLevel: 'moderate' as const,
    createdAt: '2026-08-30T00:00:00.000Z',
  },
  {
    id: 'user-sreenidhee',
    displayName: 'Sreenidhee',
    role: 'member' as const,
    age: 23,
    sex: 'female' as const,
    heightCm: null as number | null,
    weightKg: null as number | null,
    activityLevel: 'moderate' as const,
    createdAt: '2026-08-30T00:00:00.000Z',
  },
]
