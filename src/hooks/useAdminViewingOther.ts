import { useAppStore } from '../storage/context'

/** Admin is viewing a member's log (e.g. Hemanth watching Sreenidhee). */
export function useAdminViewingOther(): boolean {
  const { sessionRole, activeUser } = useAppStore()
  return sessionRole === 'admin' && activeUser.role === 'member'
}
