import { useAppStore } from '../storage/context'

export function useLogPermissions() {
  const { sessionRole, activeUser, sessionUserId } = useAppStore()
  const viewingOther = activeUser.id !== sessionUserId
  const canEdit = sessionRole === 'admin' || !viewingOther
  const readOnly = !canEdit

  return {
    viewingOther,
    canEdit,
    readOnly,
    isAdminViewingMember: sessionRole === 'admin' && activeUser.role === 'member',
    isMemberViewingAdmin: sessionRole === 'member' && activeUser.role === 'admin',
  }
}
