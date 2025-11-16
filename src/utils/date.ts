import {
  format,
  parse,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addDays,
  addWeeks,
  addMonths,
  subDays,
  subWeeks,
  subMonths,
  isSameDay,
  isSameMonth,
  isWithinInterval,
  setHours,
  setMinutes,
} from 'date-fns'

export const formatDate = (date: Date, formatString = 'yyyy-MM-dd'): string => {
  return format(date, formatString)
}

export const formatTime = (date: Date, formatString = 'HH:mm'): string => {
  return format(date, formatString)
}

export const formatDateTime = (date: Date, formatString = 'yyyy-MM-dd HH:mm'): string => {
  return format(date, formatString)
}

export const parseDate = (dateString: string, formatString = 'yyyy-MM-dd'): Date => {
  return parse(dateString, formatString, new Date())
}

export const getWeekDays = (date: Date): Date[] => {
  const start = startOfWeek(date, { weekStartsOn: 1 })
  const end = endOfWeek(date, { weekStartsOn: 1 })
  return eachDayOfInterval({ start, end })
}

export const getMonthDays = (date: Date): Date[] => {
  const start = startOfMonth(date)
  const end = endOfMonth(date)
  return eachDayOfInterval({ start, end })
}

export const generateTimeSlots = (
  startTime: string,
  endTime: string,
  intervalMinutes = 30,
): string[] => {
  const slots: string[] = []
  const [startHour = 0, startMinute = 0] = startTime.split(':').map(Number)
  const [endHour = 0, endMinute = 0] = endTime.split(':').map(Number)

  let currentTime = setMinutes(setHours(new Date(), startHour), startMinute)
  const endDateTime = setMinutes(setHours(new Date(), endHour), endMinute)

  while (currentTime <= endDateTime) {
    slots.push(formatTime(currentTime))
    currentTime = new Date(currentTime.getTime() + intervalMinutes * 60000)
  }

  return slots
}

export const addTime = (date: Date, amount: number, unit: 'day' | 'week' | 'month'): Date => {
  switch (unit) {
    case 'day':
      return addDays(date, amount)
    case 'week':
      return addWeeks(date, amount)
    case 'month':
      return addMonths(date, amount)
  }
}

export const subtractTime = (
  date: Date,
  amount: number,
  unit: 'day' | 'week' | 'month',
): Date => {
  switch (unit) {
    case 'day':
      return subDays(date, amount)
    case 'week':
      return subWeeks(date, amount)
    case 'month':
      return subMonths(date, amount)
  }
}

export { isSameDay, isSameMonth, isWithinInterval, startOfWeek, endOfWeek, startOfMonth, endOfMonth }
