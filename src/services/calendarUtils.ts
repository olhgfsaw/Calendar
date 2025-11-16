import type { Appointment, Master, WorkingHours, TimeRange } from '@/types'
import { isWithinInterval, parse } from 'date-fns'

export const checkTimeSlotAvailable = (
  appointments: Appointment[],
  masterId: string,
  start: Date,
  end: Date,
): boolean => {
  const masterAppointments = appointments.filter((app) => app.masterId === masterId)

  for (const appointment of masterAppointments) {
    const appointmentStart = appointment.start
    const appointmentEnd = appointment.end

    const hasOverlap =
      (start >= appointmentStart && start < appointmentEnd) ||
      (end > appointmentStart && end <= appointmentEnd) ||
      (start <= appointmentStart && end >= appointmentEnd)

    if (hasOverlap) return false
  }

  return true
}

export const isWithinWorkingHours = (
  date: Date,
  workingHours: WorkingHours,
): boolean => {
  const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
  const dayOfWeek = dayName as keyof WorkingHours
  const dayHours = workingHours[dayOfWeek]

  if (!dayHours) return false

  const timeString = date.toTimeString().slice(0, 5)
  return timeString >= dayHours.start && timeString <= dayHours.end
}

export const getAvailableTimeSlots = (
  master: Master,
  date: Date,
  appointments: Appointment[],
  slotDuration = 30,
): Date[] => {
  const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
  const dayOfWeek = dayName as keyof WorkingHours
  const dayHours = master.workingHours[dayOfWeek]

  if (!dayHours) return []

  const slots: Date[] = []
  const [startHour = 0, startMinute = 0] = dayHours.start.split(':').map(Number)
  const [endHour = 0, endMinute = 0] = dayHours.end.split(':').map(Number)

  const currentDate = new Date(date)
  currentDate.setHours(startHour, startMinute, 0, 0)

  const endDate = new Date(date)
  endDate.setHours(endHour, endMinute, 0, 0)

  while (currentDate < endDate) {
    const slotEnd = new Date(currentDate.getTime() + slotDuration * 60000)

    if (checkTimeSlotAvailable(appointments, master.id, currentDate, slotEnd)) {
      slots.push(new Date(currentDate))
    }

    currentDate.setTime(currentDate.getTime() + slotDuration * 60000)
  }

  return slots
}

export const calculateAppointmentEnd = (start: Date, durationMinutes: number): Date => {
  return new Date(start.getTime() + durationMinutes * 60000)
}
