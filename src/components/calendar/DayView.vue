<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
    <div class="border-b border-gray-200 dark:border-gray-700 px-4 py-3">
      <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">
        {{ formattedDate }}
      </h3>
    </div>

    <div class="overflow-auto" style="max-height: 700px;">
      <div class="grid grid-cols-[80px_1fr] border-b border-gray-200 dark:border-gray-700">
        <div class="border-r border-gray-200 dark:border-gray-700 p-2">
          <div class="text-xs font-medium text-gray-500 dark:text-gray-400">
            {{ t('calendar.time') }}
          </div>
        </div>
        <div class="p-2">
          <div class="text-xs font-medium text-gray-500 dark:text-gray-400">
            {{ t('calendar.title') }}
          </div>
        </div>
      </div>

      <div
        v-for="hour in workingHours"
        :key="hour"
        class="grid grid-cols-[80px_1fr] border-b border-gray-200 dark:border-gray-700 min-h-[80px]"
      >
        <div class="border-r border-gray-200 dark:border-gray-700 p-2 text-sm text-gray-500 dark:text-gray-400">
          {{ formatHour(hour) }}
        </div>
        <div 
          class="relative hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
          @click="handleTimeSlotClick(hour)"
          @dragover.prevent
          @drop="handleDrop(hour, $event)"
        >
          <div
            v-for="appointment in getAppointmentsForHour(hour)"
            :key="appointment.id"
            class="absolute left-0 right-0 mx-2 p-2 rounded cursor-pointer shadow-sm"
            :class="getAppointmentClass(appointment.status)"
            :style="getAppointmentStyle(appointment)"
            :draggable="true"
            @dragstart="handleDragStart(appointment, $event)"
            @dragend="handleDragEnd"
            @click.stop="handleAppointmentClick(appointment)"
          >
            <div class="text-sm font-medium">{{ appointment.client }}</div>
            <div class="text-xs">{{ appointment.service }}</div>
            <div class="text-xs">{{ appointment.startTime }} - {{ appointment.endTime }}</div>
            <div class="text-xs">{{ appointment.master }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { format, parse, isSameDay } from 'date-fns'
import { enUS, es, ru } from 'date-fns/locale'
import type { Appointment } from '@/types'

interface Props {
  currentDate: Date
  appointments: Appointment[]
  locale?: string
  startHour?: number
  endHour?: number
}

const props = withDefaults(defineProps<Props>(), {
  locale: 'en',
  startHour: 8,
  endHour: 20
})

const emit = defineEmits<{
  timeSlotClick: [hour: number]
  appointmentClick: [appointment: Appointment]
  appointmentDrop: [appointment: Appointment, newDate: Date, newTime: string]
}>()

const { t } = useI18n()

const localeMap = {
  en: enUS,
  es,
  ru
} as const

const currentLocale = computed(() => localeMap[props.locale as keyof typeof localeMap] || enUS)

const formattedDate = computed(() => {
  return format(props.currentDate, 'EEEE, MMMM d, yyyy', { locale: currentLocale.value })
})

const workingHours = computed(() => {
  const hours = []
  for (let i = props.startHour; i < props.endHour; i++) {
    hours.push(i)
  }
  return hours
})

const formatHour = (hour: number) => {
  const date = new Date()
  date.setHours(hour, 0, 0, 0)
  return format(date, 'HH:mm')
}

const getAppointmentsForHour = (hour: number) => {
  return props.appointments.filter(apt => {
    const aptDate = parse(apt.date, 'yyyy-MM-dd', new Date())
    if (!isSameDay(aptDate, props.currentDate)) return false
    
    const [startHour] = apt.startTime.split(':').map(Number)
    return startHour === hour
  })
}

const getAppointmentClass = (status: string) => {
  const classes = {
    scheduled: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200 border-l-4 border-blue-600',
    confirmed: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200 border-l-4 border-green-600',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200 border-l-4 border-red-600',
    completed: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 border-l-4 border-gray-600',
    'no-show': 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200 border-l-4 border-orange-600'
  }
  return classes[status as keyof typeof classes] || classes.scheduled
}

const getAppointmentStyle = (appointment: Appointment) => {
  const [startHour, startMinutes] = appointment.startTime.split(':').map(Number)
  const [endHour, endMinutes] = appointment.endTime.split(':').map(Number)
  
  const topOffset = (startMinutes / 60) * 80
  
  const durationMinutes = (endHour * 60 + endMinutes) - (startHour * 60 + startMinutes)
  const height = (durationMinutes / 60) * 80
  
  return {
    top: `${topOffset}px`,
    height: `${Math.max(height - 4, 30)}px`
  }
}

const handleTimeSlotClick = (hour: number) => {
  emit('timeSlotClick', hour)
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

const handleDrop = (hour: number, event: DragEvent) => {
  event.preventDefault()
  if (draggedAppointment) {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
    const offsetY = event.clientY - rect.top
    const minutes = Math.round((offsetY / 80) * 60 / 15) * 15
    const clampedMinutes = Math.min(Math.max(minutes, 0), 45)
    
    const newTime = `${hour.toString().padStart(2, '0')}:${clampedMinutes.toString().padStart(2, '0')}`
    emit('appointmentDrop', draggedAppointment, props.currentDate, newTime)
  }
}
</script>
