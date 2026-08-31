import { neon, type NeonQueryFunction } from '@neondatabase/serverless'
import { ACCOUNTS } from './accounts'

let _sql: NeonQueryFunction<false, false> | null = null

export function getSql(): NeonQueryFunction<false, false> {
  if (_sql) return _sql
  const url = process.env.DATABASE_URL
  if (!url) throw new Error('DATABASE_URL is not set')
  _sql = neon(url)
  return _sql
}

let schemaReady: Promise<void> | null = null

export async function ensureSchema(): Promise<void> {
  if (!schemaReady) schemaReady = setupSchema()
  await schemaReady
}

async function setupSchema(): Promise<void> {
  const sql = getSql()
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      display_name TEXT NOT NULL,
      role TEXT NOT NULL,
      age INTEGER,
      sex TEXT,
      height_cm DOUBLE PRECISION,
      weight_kg DOUBLE PRECISION,
      activity_level TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `
  await sql`
    CREATE TABLE IF NOT EXISTS logs (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      date TEXT NOT NULL,
      food_id TEXT NOT NULL,
      quantity DOUBLE PRECISION NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `
  await sql`
    CREATE TABLE IF NOT EXISTS custom_foods (
      id TEXT PRIMARY KEY,
      owner_user_id TEXT NOT NULL REFERENCES users(id),
      data JSONB NOT NULL
    )
  `
  await sql`CREATE INDEX IF NOT EXISTS logs_user_date ON logs (user_id, date)`

  for (const account of ACCOUNTS) {
    await sql`
      INSERT INTO users (id, display_name, role, age, sex, height_cm, weight_kg, activity_level)
      VALUES (
        ${account.id},
        ${account.displayName},
        ${account.role},
        ${account.age},
        ${account.sex},
        ${account.heightCm},
        ${account.weightKg},
        ${account.activityLevel}
      )
      ON CONFLICT (id) DO NOTHING
    `
  }
}
