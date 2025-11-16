<template>
  <div class="flex-1 overflow-auto">
    <div class="grid grid-cols-8 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 sticky top-0 z-10">
      <div class="p-3 text-xs font-medium text-gray-500 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700">
        {{ t('calendar.time') }}
      </div>
      <div
        v-for="day in weekDays"
        :key="day.date.toISOString()"
        class="p-3 text-center border-r border-gray-200 dark:border-gray-700"
        :class="{ 'bg-blue-50 dark:bg-blue-900/20': day.isToday }"
      >
        <div class="text-xs font-medium text-gray-500 dark:text-gray-400">
          {{ format(day.date, 'EEE', { locale: currentLocale }) }}
        </div>
        <div
          class="text-lg font-semibold mt-1"
          :class="day.isToday ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'"
        >
          {{ format(day.date, 'd') }}
        </div>
      </div>
    </div>
    
    <div class="grid grid-cols-8 auto-rows-auto">
      <template v-for="hour in workingHours" :key="hour">
        <div class="p-2 text-xs text-gray-500 dark:text-gray-400 border-r border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          {{ formatHour(hour) }}
        </div>
        
        <div
          v-for="day in weekDays"
          :key="`${day.date.toISOString()}-${hour}`"
          class="relative border-r border-b border-gray-200 dark:border-gray-700 min-h-[80px] p-1 hover:bg-gray-50 dark:hover:bg-gray-700/30 cursor-pointer"
          @click="handleSlotClick(day.date, hour)"
          @dragover.prevent
          @drop="handleDrop(day.date, hour, $event)"
        >
          <div 
            v-for="appointment in getAppointmentsForSlot(day.date, hour)" 
            :key="appointment.id" 
            class="absolute left-1 right-1"
            :style="getAppointmentStyle(appointment)"
            :draggable="true"
            @dragstart="handleDragStart(appointment, $event)"
            @dragend="handleDragEnd"
          >
            <AppointmentCard
              :appointment="appointment"
              :client-name="getClientName(appointment.clientId)"
              :master-name="getMasterName(appointment.masterId)"
              :service-name="getServiceName(appointment.serviceId)"
              :show-actions="false"
              @click="handleAppointmentClick(appointment)"
            />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { format, startOfWeek, addDays, isSameDay, isToday as isTodayFn, parse } from 'date-fns'
import { enUS, es, ru } from 'date-fns/locale'
import { AppointmentCard } from '@/components/calendar'
import type { Appointment } from '@/types'

interface Props {
  currentDate: Date
  appointments: Appointment[]
  locale?: string
  startHour?: number
  endHour?: number
  clientOptions: Array<{ value: string; label: string }>
  masterOptions: Array<{ value: string; label: string }>
  serviceOptions: Array<{ value: string; label: string }>
}

const props = withDefaults(defineProps<Props>(), {
  locale: 'en',
  startHour: 8,
  endHour: 20
})

const emit = defineEmits<{
  slotClick: [date: Date, hour: number]
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

const weekDays = computed(() => {
  const weekStart = startOfWeek(props.currentDate, { locale: currentLocale.value })
  return Array.from({ length: 7 }, (_, i) => {
    const date = addDays(weekStart, i)
    return {
      date,
      isToday: isTodayFn(date)
    }
  })
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

const getAppointmentsForSlot = (date: Date, hour: number) => {
  return props.appointments.filter(apt => {
    const aptDate = parse(apt.date, 'yyyy-MM-dd', new Date())
    const aptHour = parseInt(apt.startTime.split(':')[0])
    return isSameDay(aptDate, date) && aptHour === hour
  })
}

const getClientName = (clientId: string) => {
  const client = props.clientOptions.find(c => c.value === clientId)
  return client?.label || 'Unknown'
}

const getMasterName = (masterId: string) => {
  const master = props.masterOptions.find(m => m.value === masterId)
  return master?.label || 'Unknown'
}

const getServiceName = (serviceId: string) => {
  const service = props.serviceOptions.find(s => s.value === serviceId)
  return service?.label || 'Unknown'
}

const getAppointmentStyle = (appointment: any) => {
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

const handleSlotClick = (date: Date, hour: number) => {
  emit('slotClick', date, hour)
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

const handleDrop = (date: Date, hour: number, event: DragEvent) => {
  event.preventDefault()
  event.stopPropagation()
  
  if (draggedAppointment) {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
    const offsetY = event.clientY - rect.top
    const minutes = Math.round((offsetY / 80) * 60 / 15) * 15
    const clampedMinutes = Math.min(Math.max(minutes, 0), 45)
    
    const newTime = `${hour.toString().padStart(2, '0')}:${clampedMinutes.toString().padStart(2, '0')}`
    emit('appointmentDrop', draggedAppointment, date, newTime)
  }
}
</script>
