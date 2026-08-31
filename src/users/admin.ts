import { SEED_USERS } from './seed'

/** Fixed admin display name (members do not receive admin profile in API state). */
export const ADMIN_DISPLAY_NAME =
  SEED_USERS.find((u) => u.role === 'admin')?.displayName ?? 'Hemanth'
