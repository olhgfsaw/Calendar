<template>
  <div class="h-full flex flex-col">
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{{ t('calendar.title') }}</h1>
    </div>
    
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow flex-1 flex flex-col overflow-hidden">
      <div class="p-4 border-b border-gray-200 dark:border-gray-700 space-y-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-2">
              <IconButton @click="previousPeriod">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </IconButton>
              
              <span class="text-lg font-semibold text-gray-900 dark:text-white min-w-[200px] text-center">
                {{ currentPeriodLabel }}
              </span>
              
              <IconButton @click="nextPeriod">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </IconButton>
              
              <TextButton @click="goToToday" class="ml-2">
                {{ t('calendar.today') }}
              </TextButton>
            </div>
            
            <div class="flex items-center gap-1 ml-4 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                v-for="view in views"
                :key="view"
                class="px-3 py-1.5 text-sm font-medium rounded transition-colors"
                :class="currentView === view 
                  ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'"
                @click="currentView = view"
              >
                {{ t(`calendar.${view}`) }}
              </button>
            </div>
          </div>
          
          <PrimaryButton @click="openCreateModal">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            {{ t('calendar.newAppointment') }}
          </PrimaryButton>
        </div>
        
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ t('calendar.filterByMaster') }}
            </label>
            <select
              v-model="selectedMasterId"
              class="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              @change="handleMasterFilter"
            >
              <option value="">{{ t('common.all') }}</option>
              <option v-for="master in masterOptions" :key="master.value" :value="master.value">
                {{ master.label }}
              </option>
            </select>
          </div>
          
          <div class="flex items-center gap-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ t('calendar.filterByStatus') }}
            </label>
            <select
              v-model="selectedStatus"
              class="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              @change="handleStatusFilter"
            >
              <option value="">{{ t('common.all') }}</option>
              <option value="scheduled">{{ t('appointments.status.scheduled') }}</option>
              <option value="confirmed">{{ t('appointments.status.confirmed') }}</option>
              <option value="cancelled">{{ t('appointments.status.cancelled') }}</option>
              <option value="completed">{{ t('appointments.status.completed') }}</option>
              <option value="no-show">{{ t('appointments.status.no-show') }}</option>
            </select>
          </div>
          
          <TextButton
            v-if="hasActiveFilters"
            @click="clearFilters"
            class="text-sm"
          >
            {{ t('common.clearFilters') }}
          </TextButton>
        </div>
      </div>
      
      <component
        :is="currentViewComponent"
        :current-date="currentDate"
        :appointments="calendarAppointments"
        :locale="locale"
        :client-options="clientOptions"
        :master-options="masterOptions"
        :service-options="serviceOptions"
        :start-hour="8"
        :end-hour="20"
        @slot-click="handleSlotClick"
        @day-click="handleDayClick"
        @time-slot-click="handleTimeSlotClick"
        @appointment-click="handleAppointmentClick"
        @appointment-drop="handleAppointmentDrop"
      />
    </div>
    
    <AppointmentModal
      :is-open="isModalOpen"
      :appointment="selectedAppointment"
      :client-options="clientOptions"
      :master-options="masterOptions"
      :service-options="serviceOptions"
      :initial-date="selectedSlot?.date || null"
      :initial-time="selectedSlot ? formatHour(selectedSlot.hour) : null"
      @close="closeModal"
      @submit="handleAppointmentSubmit"
      @delete="handleAppointmentDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { 
  format, 
  startOfWeek, 
  addDays, 
  addWeeks, 
  subWeeks, 
  addMonths, 
  subMonths, 
  startOfMonth,
  endOfWeek,
  set,
  parse
} from 'date-fns'
import { enUS, es, ru } from 'date-fns/locale'
import { useCalendarStore } from '@/stores/calendar'
import { useNotificationsStore } from '@/stores/notifications'
import PrimaryButton from '@/components/base/buttons/PrimaryButton.vue'
import IconButton from '@/components/base/buttons/IconButton.vue'
import TextButton from '@/components/base/buttons/TextButton.vue'
import { AppointmentModal, WeekView, MonthView, DayView } from '@/components/calendar'
import type { Appointment } from '@/types'

const { t, locale } = useI18n()
const calendarStore = useCalendarStore()
const notificationsStore = useNotificationsStore()

type CalendarView = 'month' | 'week' | 'day'

const currentDate = ref(new Date())
const currentView = ref<CalendarView>('week')
const views: CalendarView[] = ['month', 'week', 'day']
const isModalOpen = ref(false)
const selectedAppointment = ref<Appointment | null>(null)
const selectedSlot = ref<{ date: Date; hour: number } | null>(null)
const selectedMasterId = ref('')
const selectedStatus = ref<Appointment['status'] | ''>('')

const currentLocale = computed(() => {
  const localeMap = {
    en: enUS,
    es,
    ru,
  }
  return localeMap[locale.value as keyof typeof localeMap] || enUS
})

const currentViewComponent = computed(() => {
  const components = {
    month: MonthView,
    week: WeekView,
    day: DayView
  }
  return components[currentView.value]
})

const currentPeriodLabel = computed(() => {
  if (currentView.value === 'month') {
    return format(currentDate.value, 'MMMM yyyy', { locale: currentLocale.value })
  } else if (currentView.value === 'week') {
    const weekStart = startOfWeek(currentDate.value, { locale: currentLocale.value })
    const weekEnd = endOfWeek(currentDate.value, { locale: currentLocale.value })
    return `${format(weekStart, 'MMM d', { locale: currentLocale.value })} - ${format(weekEnd, 'MMM d, yyyy', { locale: currentLocale.value })}`
  } else {
    return format(currentDate.value, 'EEEE, MMMM d, yyyy', { locale: currentLocale.value })
  }
})

const calendarAppointments = computed(() => {
  return calendarStore.filteredAppointments.map(apt => ({
    ...apt,
    date: format(apt.start, 'yyyy-MM-dd'),
    startTime: format(apt.start, 'HH:mm'),
    endTime: format(apt.end, 'HH:mm'),
    client: getClientName(apt.clientId),
    master: getMasterName(apt.masterId),
    service: getServiceName(apt.serviceId)
  }))
})

const clientOptions = ref([
  { value: 'client1', label: 'John Doe' },
  { value: 'client2', label: 'Jane Smith' },
  { value: 'client3', label: 'Bob Johnson' },
  { value: 'client4', label: 'Alice Williams' },
  { value: 'client5', label: 'Charlie Brown' },
])

const masterOptions = ref([
  { value: 'master1', label: 'Anna Martinez' },
  { value: 'master2', label: 'Maria Garcia' },
  { value: 'master3', label: 'Sofia Rodriguez' },
  { value: 'master4', label: 'Elena Ivanova' },
])

const serviceOptions = ref([
  { value: 'service1', label: 'Haircut - $50 (60 min)' },
  { value: 'service2', label: 'Coloring - $120 (120 min)' },
  { value: 'service3', label: 'Manicure - $35 (45 min)' },
  { value: 'service4', label: 'Pedicure - $40 (50 min)' },
  { value: 'service5', label: 'Hair Styling - $70 (90 min)' },
])

const getClientName = (clientId: string) => {
  return clientOptions.value.find(c => c.value === clientId)?.label || 'Unknown Client'
}

const getMasterName = (masterId: string) => {
  return masterOptions.value.find(m => m.value === masterId)?.label || 'Unknown Master'
}

const getServiceName = (serviceId: string) => {
  return serviceOptions.value.find(s => s.value === serviceId)?.label || 'Unknown Service'
}

const formatHour = (hour: number) => {
  return `${hour.toString().padStart(2, '0')}:00`
}

const handleSlotClick = (date: Date, hour: number) => {
  selectedSlot.value = { date, hour }
  openCreateModal()
}

const handleDayClick = (date: Date) => {
  selectedSlot.value = { date, hour: 9 }
  openCreateModal()
}

const handleTimeSlotClick = (hour: number) => {
  selectedSlot.value = { date: currentDate.value, hour }
  openCreateModal()
}

const handleAppointmentClick = (appointment: Appointment) => {
  selectedAppointment.value = calendarStore.filteredAppointments.find(a => a.id === appointment.id) || null
  isModalOpen.value = true
}

const handleAppointmentDrop = (appointment: Appointment, newDateOrTime: Date | string, newTime?: string) => {
  const originalAppointment = calendarStore.filteredAppointments.find(a => a.id === appointment.id)
  if (!originalAppointment) return
  
  let date: Date
  let hours: number
  let minutes: number
  
  if (newTime) {
    date = newDateOrTime as Date
    const [h, m] = newTime.split(':').map(Number)
    hours = h
    minutes = m || 0
  } else if (typeof newDateOrTime === 'string') {
    if (newDateOrTime.includes('-')) {
      date = parse(newDateOrTime, 'yyyy-MM-dd', new Date())
      hours = originalAppointment.start.getHours()
      minutes = originalAppointment.start.getMinutes()
    } else {
      console.error('Unexpected time-only string without date')
      return
    }
  } else {
    date = newDateOrTime
    hours = originalAppointment.start.getHours()
    minutes = originalAppointment.start.getMinutes()
  }
  
  const duration = originalAppointment.end.getTime() - originalAppointment.start.getTime()
  const newStart = set(date, { hours, minutes, seconds: 0, milliseconds: 0 })
  const newEnd = new Date(newStart.getTime() + duration)
  
  calendarStore.updateAppointment(appointment.id, {
    start: newStart,
    end: newEnd
  })
  
  notificationsStore.addNotification({
    type: 'success',
    userId: 'demo-user',
    title: t('notifications.success'),
    message: t('calendar.appointmentUpdated'),
  })
}

const openCreateModal = () => {
  selectedAppointment.value = null
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  selectedAppointment.value = null
  selectedSlot.value = null
}

const handleAppointmentSubmit = (data: Partial<Appointment>) => {
  if (selectedAppointment.value) {
    calendarStore.updateAppointment(selectedAppointment.value.id, data)
    notificationsStore.addNotification({
      type: 'success',
      userId: 'demo-user',
      title: t('notifications.success'),
      message: t('calendar.appointmentUpdated'),
    })
  } else {
    const newAppointment: Appointment = {
      id: `appt-${Date.now()}`,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'current-user',
    } as Appointment
    
    calendarStore.addAppointment(newAppointment)
    notificationsStore.addNotification({
      type: 'success',
      userId: 'demo-user',
      title: t('notifications.success'),
      message: t('calendar.appointmentCreated'),
    })
  }
  closeModal()
}

const previousPeriod = () => {
  if (currentView.value === 'month') {
    currentDate.value = subMonths(currentDate.value, 1)
  } else if (currentView.value === 'week') {
    currentDate.value = subWeeks(currentDate.value, 1)
  } else {
    currentDate.value = addDays(currentDate.value, -1)
  }
}

const nextPeriod = () => {
  if (currentView.value === 'month') {
    currentDate.value = addMonths(currentDate.value, 1)
  } else if (currentView.value === 'week') {
    currentDate.value = addWeeks(currentDate.value, 1)
  } else {
    currentDate.value = addDays(currentDate.value, 1)
  }
}

const goToToday = () => {
  currentDate.value = new Date()
}

const handleMasterFilter = () => {
  if (selectedMasterId.value) {
    calendarStore.setMasters([selectedMasterId.value])
  } else {
    calendarStore.setMasters([])
  }
}

const handleStatusFilter = () => {
  if (selectedStatus.value) {
    calendarStore.setStatuses([selectedStatus.value])
  } else {
    calendarStore.setStatuses([])
  }
}

const clearFilters = () => {
  selectedMasterId.value = ''
  selectedStatus.value = ''
  calendarStore.clearFilters()
}

const hasActiveFilters = computed(() => {
  return calendarStore.selectedMasterIds.length > 0 || calendarStore.selectedStatuses.length > 0
})

watch(() => calendarStore.selectedMasterIds, (newIds) => {
  selectedMasterId.value = newIds[0] || ''
}, { deep: true, immediate: true })

watch(() => calendarStore.selectedStatuses, (newStatuses) => {
  selectedStatus.value = newStatuses[0] || ''
}, { deep: true, immediate: true })

const handleAppointmentDelete = () => {
  if (selectedAppointment.value) {
    const appointmentId = selectedAppointment.value.id
    calendarStore.removeAppointment(appointmentId)
    notificationsStore.addNotification({
      type: 'success',
      userId: 'demo-user',
      title: t('notifications.success'),
      message: t('calendar.appointmentDeleted'),
    })
    closeModal()
  }
}

calendarStore.setAppointments([
  {
    id: 'demo-1',
    clientId: 'client1',
    masterId: 'master1',
    serviceId: 'service1',
    salonId: 'salon1',
    start: set(new Date(), { hours: 10, minutes: 0, seconds: 0 }),
    end: set(new Date(), { hours: 11, minutes: 0, seconds: 0 }),
    status: 'confirmed',
    notes: 'Regular customer, prefers short style',
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'admin',
  },
  {
    id: 'demo-2',
    clientId: 'client2',
    masterId: 'master2',
    serviceId: 'service2',
    salonId: 'salon1',
    start: set(new Date(), { hours: 14, minutes: 0, seconds: 0 }),
    end: set(new Date(), { hours: 16, minutes: 0, seconds: 0 }),
    status: 'scheduled',
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'admin',
  },
  {
    id: 'demo-3',
    clientId: 'client3',
    masterId: 'master1',
    serviceId: 'service3',
    salonId: 'salon1',
    start: set(new Date(), { hours: 12, minutes: 0, seconds: 0 }),
    end: set(new Date(), { hours: 12, minutes: 45, seconds: 0 }),
    status: 'completed',
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'admin',
  },
  {
    id: 'demo-4',
    clientId: 'client4',
    masterId: 'master3',
    serviceId: 'service4',
    salonId: 'salon1',
    start: set(addDays(new Date(), 1), { hours: 9, minutes: 0, seconds: 0 }),
    end: set(addDays(new Date(), 1), { hours: 9, minutes: 50, seconds: 0 }),
    status: 'scheduled',
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'admin',
  },
  {
    id: 'demo-5',
    clientId: 'client5',
    masterId: 'master2',
    serviceId: 'service5',
    salonId: 'salon1',
    start: set(addDays(new Date(), 2), { hours: 11, minutes: 0, seconds: 0 }),
    end: set(addDays(new Date(), 2), { hours: 12, minutes: 30, seconds: 0 }),
    status: 'confirmed',
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'admin',
  },
  {
    id: 'demo-6',
    clientId: 'client1',
    masterId: 'master4',
    serviceId: 'service1',
    salonId: 'salon1',
    start: set(addDays(new Date(), -1), { hours: 15, minutes: 0, seconds: 0 }),
    end: set(addDays(new Date(), -1), { hours: 16, minutes: 0, seconds: 0 }),
    status: 'completed',
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'admin',
  },
])
</script>
