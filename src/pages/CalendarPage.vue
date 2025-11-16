<template>
  <div class="h-full flex flex-col">
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{{ t('calendar.title') }}</h1>
    </div>
    
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow flex-1 flex flex-col overflow-hidden">
      <div class="p-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-2">
              <IconButton @click="previousWeek">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </IconButton>
              
              <span class="text-lg font-semibold text-gray-900 dark:text-white min-w-[200px] text-center">
                {{ currentWeekLabel }}
              </span>
              
              <IconButton @click="nextWeek">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </IconButton>
              
              <TextButton @click="goToToday" class="ml-2">
                {{ t('calendar.today') }}
              </TextButton>
            </div>
          </div>
          
          <PrimaryButton @click="openCreateModal">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            {{ t('calendar.newAppointment') }}
          </PrimaryButton>
        </div>
      </div>
      
      <div class="flex-1 overflow-auto">
        <div class="grid grid-cols-8 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 sticky top-0 z-10">
          <div class="p-3 text-xs font-medium text-gray-500 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700">
            {{ t('calendar.time') || 'Time' }}
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
            >
              <div v-for="appointment in getAppointmentsForSlot(day.date, hour)" :key="appointment.id" class="mb-1">
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
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { format, startOfWeek, addDays, addWeeks, subWeeks, isSameDay, isToday as isTodayFn, set } from 'date-fns'
import { enUS, es, ru } from 'date-fns/locale'
import { useCalendarStore } from '@/stores/calendar'
import { useNotificationsStore } from '@/stores/notifications'
import PrimaryButton from '@/components/base/buttons/PrimaryButton.vue'
import IconButton from '@/components/base/buttons/IconButton.vue'
import TextButton from '@/components/base/buttons/TextButton.vue'
import { AppointmentCard, AppointmentModal } from '@/components/calendar'
import type { Appointment } from '@/types'

const { t, locale } = useI18n()
const calendarStore = useCalendarStore()
const notificationsStore = useNotificationsStore()

const currentDate = ref(new Date())
const isModalOpen = ref(false)
const selectedAppointment = ref<Appointment | null>(null)
const selectedSlot = ref<{ date: Date; hour: number } | null>(null)

const currentLocale = computed(() => {
  const localeMap = {
    en: enUS,
    es: es,
    ru: ru,
  }
  return localeMap[locale.value as keyof typeof localeMap] || enUS
})

const weekStart = computed(() => {
  const start = locale.value === 'en' ? 0 : 1
  return startOfWeek(currentDate.value, { weekStartsOn: start as 0 | 1 })
})

const weekDays = computed(() => {
  return Array.from({ length: 7 }, (_, i) => {
    const date = addDays(weekStart.value, i)
    return {
      date,
      isToday: isTodayFn(date),
    }
  })
})

const currentWeekLabel = computed(() => {
  const start = weekStart.value
  const end = addDays(start, 6)
  return `${format(start, 'MMM d', { locale: currentLocale.value })} - ${format(end, 'MMM d, yyyy', { locale: currentLocale.value })}`
})

const workingHours = computed(() => {
  return Array.from({ length: 12 }, (_, i) => i + 8)
})

const clientOptions = ref([
  { value: 'client1', label: 'John Doe' },
  { value: 'client2', label: 'Jane Smith' },
  { value: 'client3', label: 'Bob Johnson' },
])

const masterOptions = ref([
  { value: 'master1', label: 'Anna Martinez' },
  { value: 'master2', label: 'Maria Garcia' },
  { value: 'master3', label: 'Sofia Rodriguez' },
])

const serviceOptions = ref([
  { value: 'service1', label: 'Haircut - $50 (60 min)' },
  { value: 'service2', label: 'Coloring - $120 (120 min)' },
  { value: 'service3', label: 'Manicure - $35 (45 min)' },
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

const getAppointmentsForSlot = (date: Date, hour: number) => {
  return calendarStore.filteredAppointments.filter((appointment) => {
    return (
      isSameDay(appointment.start, date) &&
      appointment.start.getHours() === hour
    )
  })
}

const handleSlotClick = (date: Date, hour: number) => {
  selectedSlot.value = { date, hour }
  openCreateModal()
}

const handleAppointmentClick = (appointment: Appointment) => {
  selectedAppointment.value = appointment
  isModalOpen.value = true
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
      title: t('notifications.success'),
      message: t('calendar.appointmentUpdated') || 'Appointment updated successfully',
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
      title: t('notifications.success'),
      message: t('calendar.appointmentCreated') || 'Appointment created successfully',
    })
  }
}

const previousWeek = () => {
  currentDate.value = subWeeks(currentDate.value, 1)
}

const nextWeek = () => {
  currentDate.value = addWeeks(currentDate.value, 1)
}

const goToToday = () => {
  currentDate.value = new Date()
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
])
</script>
