<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
    <div class="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700">
      <div
        v-for="day in weekDays"
        :key="day"
        class="px-2 py-3 text-center text-sm font-medium text-gray-500 dark:text-gray-400 uppercase"
      >
        {{ day }}
      </div>
    </div>

    <div class="grid grid-cols-7 divide-x divide-y divide-gray-200 dark:divide-gray-700" style="min-height: 600px;">
      <div
        v-for="(day, index) in daysInMonth"
        :key="index"
        class="p-2 min-h-[120px] relative"
        :class="{
          'bg-gray-50 dark:bg-gray-900': !day.isCurrentMonth,
          'bg-blue-50 dark:bg-blue-900/20': day.isToday,
          'hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer': day.isCurrentMonth
        }"
        @click="day.isCurrentMonth && handleDayClick(day.date)"
        @dragover.prevent
        @drop="handleDrop(day.date, $event)"
      >
        <div class="text-sm font-medium mb-1" :class="{
          'text-gray-400 dark:text-gray-600': !day.isCurrentMonth,
          'text-blue-600 dark:text-blue-400 font-bold': day.isToday,
          'text-gray-900 dark:text-gray-100': day.isCurrentMonth && !day.isToday
        }">
          {{ day.dayNumber }}
        </div>

        <div class="space-y-1">
          <div
            v-for="appointment in day.appointments"
            :key="appointment.id"
            class="text-xs px-2 py-1 rounded cursor-pointer truncate"
            :class="getAppointmentClass(appointment.status)"
            :draggable="true"
            @dragstart="handleDragStart(appointment, $event)"
            @dragend="handleDragEnd"
            @click.stop="handleAppointmentClick(appointment)"
          >
            <div class="flex items-center gap-1">
              <span>{{ appointment.startTime }}</span>
              <span class="truncate">{{ appointment.client }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  format, 
  isSameDay, 
  isSameMonth,
  parse
} from 'date-fns'
import { enUS, es, ru } from 'date-fns/locale'
import type { Appointment } from '@/types'

interface Props {
  currentDate: Date
  appointments: Appointment[]
  locale?: string
}

const props = withDefaults(defineProps<Props>(), {
  locale: 'en'
})

const emit = defineEmits<{
  dayClick: [date: Date]
  appointmentClick: [appointment: Appointment]
  appointmentDrop: [appointment: Appointment, newDate: string]
}>()

const { t } = useI18n()

const localeMap = {
  en: enUS,
  es,
  ru
} as const

const currentLocale = computed(() => localeMap[props.locale as keyof typeof localeMap] || enUS)

const weekDays = computed(() => {
  return ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'].map(day => t(`common.${day}`))
})

const daysInMonth = computed(() => {
  const monthStart = startOfMonth(props.currentDate)
  const monthEnd = endOfMonth(props.currentDate)
  const calendarStart = startOfWeek(monthStart, { locale: currentLocale.value })
  const calendarEnd = endOfWeek(monthEnd, { locale: currentLocale.value })
  
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })
  
  return days.map(date => ({
    date,
    dayNumber: format(date, 'd'),
    isCurrentMonth: isSameMonth(date, props.currentDate),
    isToday: isSameDay(date, new Date()),
    appointments: props.appointments.filter(apt => 
      isSameDay(parse(apt.date, 'yyyy-MM-dd', new Date()), date)
    )
  }))
})

const getAppointmentClass = (status: string) => {
  const classes = {
    scheduled: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200',
    confirmed: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200',
    completed: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    'no-show': 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200'
  }
  return classes[status as keyof typeof classes] || classes.scheduled
}

const handleDayClick = (date: Date) => {
  emit('dayClick', date)
}

const handleAppointmentClick = (appointment: Appointment) => {
  emit('appointmentClick', appointment)
}

let draggedAppointment: Appointment | null = null

const handleDragStart = (appointment: Appointment, event: DragEvent) => {
  draggedAppointment = appointment
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', appointment.id)
  }
}

const handleDragEnd = () => {
  draggedAppointment = null
}

const handleDrop = (date: Date, event: DragEvent) => {
  event.preventDefault()
  event.stopPropagation()
  
  if (draggedAppointment) {
    emit('appointmentDrop', draggedAppointment, format(date, 'yyyy-MM-dd'))
  }
}
</script>
