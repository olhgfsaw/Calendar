<template>
  <div
    class="appointment-card p-2 rounded-md border-l-4 cursor-pointer transition-all hover:shadow-md"
    :class="[
      statusColor,
      'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
    ]"
    @click="handleClick"
  >
    <div class="flex items-start justify-between gap-2">
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-1">
          <span class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
            {{ clientName }}
          </span>
          <span 
            class="px-1.5 py-0.5 text-xs rounded-full"
            :class="statusBadgeColor"
          >
            {{ t(`appointments.status.${appointment.status}`) }}
          </span>
        </div>
        
        <div class="text-xs text-gray-600 dark:text-gray-400 space-y-0.5">
          <div class="flex items-center gap-1">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ formatTime(appointment.start) }} - {{ formatTime(appointment.end) }}</span>
          </div>
          
          <div class="flex items-center gap-1">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span class="truncate">{{ serviceName }}</span>
          </div>
          
          <div v-if="masterName" class="flex items-center gap-1">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span class="truncate">{{ masterName }}</span>
          </div>
        </div>
      </div>
      
      <button
        v-if="showActions"
        type="button"
        class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
        @click.stop="handleMenuClick"
      >
        <svg class="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
        </svg>
      </button>
    </div>
    
    <div v-if="appointment.notes" class="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
      <p class="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{{ appointment.notes }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { format } from 'date-fns'
import type { Appointment } from '@/types'

interface Props {
  appointment: Appointment
  clientName?: string
  serviceName?: string
  masterName?: string
  showActions?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  clientName: 'Unknown Client',
  serviceName: 'Service',
  showActions: true,
})

const emit = defineEmits<{
  click: [appointment: Appointment]
  menuClick: [appointment: Appointment]
}>()

const { t } = useI18n()

const statusColor = computed(() => {
  const colors = {
    scheduled: 'border-l-blue-500',
    confirmed: 'border-l-green-500',
    cancelled: 'border-l-red-500',
    completed: 'border-l-gray-500',
    'no-show': 'border-l-orange-500',
  }
  return colors[props.appointment.status] || 'border-l-gray-500'
})

const statusBadgeColor = computed(() => {
  const colors = {
    scheduled: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    confirmed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    completed: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
    'no-show': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  }
  return colors[props.appointment.status] || 'bg-gray-100 text-gray-800'
})

const formatTime = (date: Date) => {
  return format(date, 'HH:mm')
}

const handleClick = () => {
  emit('click', props.appointment)
}

const handleMenuClick = () => {
  emit('menuClick', props.appointment)
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
