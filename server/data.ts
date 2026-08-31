import type { Food } from '../src/foods/types'
import type { LogEntry } from '../src/storage/schema'
import type { UserProfile } from '../src/users/types'
import { getAccount } from './accounts'
import { ensureSchema, getSql } from './db'

export async function loadUsers(): Promise<UserProfile[]> {
  await ensureSchema()
  const sql = getSql()
  const rows = await sql`
    SELECT id, display_name, role, age, sex, height_cm, weight_kg, activity_level, created_at
    FROM users
    ORDER BY created_at ASC
  `
  return rows.map((row) => ({
    id: String(row.id),
    displayName: String(row.display_name),
    role: row.role === 'admin' ? 'admin' : 'member',
    age: row.age == null ? null : Number(row.age),
    sex: (row.sex as UserProfile['sex']) ?? 'unspecified',
    heightCm: row.height_cm == null ? null : Number(row.height_cm),
    weightKg: row.weight_kg == null ? null : Number(row.weight_kg),
    activityLevel: (row.activity_level as UserProfile['activityLevel']) ?? 'moderate',
    createdAt: new Date(String(row.created_at)).toISOString(),
  }))
}

export async function loadLogs(userId: string): Promise<LogEntry[]> {
  await ensureSchema()
  const sql = getSql()
  const rows = await sql`
    SELECT id, user_id, date, food_id, quantity, created_at, updated_at
    FROM logs
    WHERE user_id = ${userId}
    ORDER BY created_at ASC
  `
  return rows.map((row) => ({
    id: String(row.id),
    userId: String(row.user_id),
    date: String(row.date),
    foodId: String(row.food_id),
    quantity: Number(row.quantity),
    createdAt: new Date(String(row.created_at)).toISOString(),
    updatedAt: new Date(String(row.updated_at)).toISOString(),
  }))
}

export async function loadCustomFoods(userId: string): Promise<Food[]> {
  await ensureSchema()
  const sql = getSql()
  const rows = await sql`
    SELECT data FROM custom_foods WHERE owner_user_id = ${userId}
  `
  return rows.map((row) => row.data as Food)
}

export async function addOrMergeLog(input: {
  userId: string
  foodId: string
  quantity: number
  date: string
}): Promise<LogEntry[]> {
  await ensureSchema()
  const sql = getSql()
  const existing = await sql`
    SELECT id, quantity FROM logs
    WHERE user_id = ${input.userId} AND date = ${input.date} AND food_id = ${input.foodId}
    LIMIT 1
  `
  const now = new Date().toISOString()
  if (existing[0]) {
    const nextQty = Number(existing[0].quantity) + input.quantity
    await sql`
      UPDATE logs SET quantity = ${nextQty}, updated_at = ${now}::timestamptz
      WHERE id = ${String(existing[0].id)}
    `
  } else {
    const id = `log-${crypto.randomUUID()}`
    await sql`
      INSERT INTO logs (id, user_id, date, food_id, quantity, created_at, updated_at)
      VALUES (${id}, ${input.userId}, ${input.date}, ${input.foodId}, ${input.quantity}, ${now}::timestamptz, ${now}::timestamptz)
    `
  }
  return loadLogs(input.userId)
}

export async function updateLogQuantity(userId: string, entryId: string, quantity: number): Promise<LogEntry[]> {
  await ensureSchema()
  const sql = getSql()
  if (quantity <= 0) {
    await sql`DELETE FROM logs WHERE id = ${entryId} AND user_id = ${userId}`
  } else {
    await sql`
      UPDATE logs SET quantity = ${quantity}, updated_at = NOW()
      WHERE id = ${entryId} AND user_id = ${userId}
    `
  }
  return loadLogs(userId)
}

export async function deleteLog(userId: string, entryId: string): Promise<LogEntry[]> {
  await ensureSchema()
  const sql = getSql()
  await sql`DELETE FROM logs WHERE id = ${entryId} AND user_id = ${userId}`
  return loadLogs(userId)
}

export async function insertCustomFood(userId: string, food: Food): Promise<Food[]> {
  await ensureSchema()
  const sql = getSql()
  await sql`
    INSERT INTO custom_foods (id, owner_user_id, data)
    VALUES (${food.id}, ${userId}, ${JSON.stringify(food)})
  `
  return loadCustomFoods(userId)
}

export async function updateProfile(userId: string, patch: Partial<UserProfile>): Promise<UserProfile[]> {
  await ensureSchema()
  const sql = getSql()
  const account = getAccount(userId)
  if (!account) throw new Error('Unknown user')
  const current = (await loadUsers()).find((u) => u.id === userId)
  if (!current) throw new Error('Unknown user')
  const next = { ...current, ...patch, id: userId }
  await sql`
    UPDATE users SET
      display_name = ${next.displayName},
      age = ${next.age},
      sex = ${next.sex},
      height_cm = ${next.heightCm},
      weight_kg = ${next.weightKg},
      activity_level = ${next.activityLevel}
    WHERE id = ${userId}
  `
  return loadUsers()
}

export async function resetLogs(userId: string, scope: 'today' | 'all', today: string): Promise<void> {
  await ensureSchema()
  const sql = getSql()
  if (scope === 'today') {
    await sql`DELETE FROM logs WHERE user_id = ${userId} AND date = ${today}`
  } else {
    await sql`DELETE FROM logs WHERE user_id = ${userId}`
  }
}
