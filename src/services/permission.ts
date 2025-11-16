import type { UserRole } from '@/types'

export const checkPermission = (userRole: UserRole, allowedRoles: UserRole[]): boolean => {
  return allowedRoles.includes(userRole)
}

export const canAccessCalendar = (role: UserRole): boolean => {
  return checkPermission(role, ['admin', 'manager', 'master'])
}

export const canManageMasters = (role: UserRole): boolean => {
  return checkPermission(role, ['admin', 'manager'])
}

export const canManageSalons = (role: UserRole): boolean => {
  return checkPermission(role, ['admin'])
}

export const canManageClients = (role: UserRole): boolean => {
  return checkPermission(role, ['admin', 'manager', 'master'])
}

export const canAccessAdminDashboard = (role: UserRole): boolean => {
  return checkPermission(role, ['admin'])
}

export const canAccessReports = (role: UserRole): boolean => {
  return checkPermission(role, ['admin', 'manager'])
}

export const canEditAppointment = (
  role: UserRole,
  appointmentMasterId: string,
  userId: string,
): boolean => {
  if (role === 'admin' || role === 'manager') return true
  if (role === 'master' && appointmentMasterId === userId) return true
  return false
}
