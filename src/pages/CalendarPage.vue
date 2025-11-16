<template>
  <div>
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{{ $t('calendar.title') }}</h1>
      <p class="mt-2 text-gray-600 dark:text-gray-400">{{ $t('calendar.subtitle') || 'Manage appointments and schedules' }}</p>
    </div>
    
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-4">
          <button class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            {{ $t('calendar.month') }}
          </button>
          <button class="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg">
            {{ $t('calendar.week') }}
          </button>
          <button class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            {{ $t('calendar.day') }}
          </button>
        </div>
        
        <PrimaryButton @click="showNewAppointment = true">
          {{ $t('calendar.newAppointment') }}
        </PrimaryButton>
      </div>
      
      <div class="text-center py-12 text-gray-500 dark:text-gray-400">
        <svg class="mx-auto h-12 w-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
        <p>{{ $t('calendar.noAppointments') || 'No appointments scheduled' }}</p>
      </div>
    </div>
    
    <BaseModal
      v-model="showNewAppointment"
      :title="$t('calendar.newAppointment')"
      size="lg"
    >
      <p class="text-gray-600 dark:text-gray-400">Appointment creation form will be here</p>
      <template #footer>
        <PrimaryButton variant="outline" @click="showNewAppointment = false">
          {{ $t('common.cancel') }}
        </PrimaryButton>
        <PrimaryButton>
          {{ $t('common.save') }}
        </PrimaryButton>
      </template>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PrimaryButton from '@/components/base/buttons/PrimaryButton.vue'
import BaseModal from '@/components/base/modals/BaseModal.vue'

const showNewAppointment = ref(false)
</script>
