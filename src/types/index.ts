export type UserRole = 'admin' | 'manager' | 'master' | 'client' | 'guest'

export interface User {
  uid: string
  email: string
  displayName?: string
  photoURL?: string
  role: UserRole
  salonIds?: string[]
  createdAt: Date
  updatedAt: Date
}

export interface UserSettings {
  preferredLanguage: 'en' | 'es' | 'ru'
  theme: 'light' | 'dark' | 'auto'
  timezone: string
  timeFormat: '12h' | '24h'
  emailNotifications: boolean
  pushNotifications: boolean
}

export interface Salon {
  id: string
  name: string
  address: string
  city: string
  country: string
  phone: string
  email?: string
  workingHours: WorkingHours
  managerIds: string[]
  services: Service[]
  createdAt: Date
  updatedAt: Date
}

export interface WorkingHours {
  monday?: TimeRange
  tuesday?: TimeRange
  wednesday?: TimeRange
  thursday?: TimeRange
  friday?: TimeRange
  saturday?: TimeRange
  sunday?: TimeRange
}

export interface TimeRange {
  start: string
  end: string
}

export interface Master {
  id: string
  userId: string
  salonIds: string[]
  services: string[]
  workingHours: WorkingHours
  status: 'active' | 'inactive' | 'vacation'
  specialization?: string
  bio?: string
  createdAt: Date
  updatedAt: Date
}

export interface Client {
  id: string
  userId?: string
  firstName: string
  lastName: string
  phone: string
  email?: string
  notes?: string
  tags?: string[]
  preferredMasterId?: string
  createdAt: Date
  updatedAt: Date
}

export interface Service {
  id: string
  name: string
  duration: number
  price: number
  description?: string
  category?: string
}

export interface Appointment {
  id: string
  masterId: string
  clientId: string
  salonId: string
  serviceId: string
  start: Date
  end: Date
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed' | 'no-show'
  notes?: string
  createdAt: Date
  updatedAt: Date
  createdBy: string
}

export interface BlockedTime {
  id: string
  masterId: string
  start: Date
  end: Date
  reason?: string
  createdAt: Date
}

export interface Notification {
  id: string
  userId: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  read: boolean
  createdAt: Date
  actionUrl?: string
}

export interface CalendarView {
  mode: 'month' | 'week' | 'day'
  selectedDate: Date
  salonId?: string
  masterIds?: string[]
}
