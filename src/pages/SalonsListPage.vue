<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">{{ t('salons.title') }}</h1>
      <PrimaryButton @click="createSalon">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        {{ t('salons.addSalon') }}
      </PrimaryButton>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <BaseInput
        v-model="searchQuery"
        :placeholder="t('common.search')"
        type="text"
      >
        <template #prefix>
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </template>
      </BaseInput>
    </div>

    <BaseDataTable
      :columns="[]"
      :data="filteredSalons"
      :loading="loading"
      :page-size="9"
      view-mode="grid"
      grid-class="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      @row-click="viewSalon"
    >
      <template #grid-item="{ item }">
        <div
          class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
          @click="viewSalon(item)"
        >
          <div class="h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <svg class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          
          <div class="p-4">
            <h3 class="font-semibold text-lg mb-2">{{ item.name }}</h3>
            
            <div class="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{{ item.address }}</span>
              </div>
              
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>{{ item.phone }}</span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </BaseDataTable>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import PrimaryButton from '@/components/base/buttons/PrimaryButton.vue'
import BaseInput from '@/components/base/forms/BaseInput.vue'
import BaseDataTable from '@/components/base/BaseDataTable.vue'

interface Salon {
  id: string
  name: string
  address: string
  phone: string
  city: string
}

const { t } = useI18n()
const router = useRouter()

const searchQuery = ref('')
const loading = ref(false)

const salons = ref<Salon[]>([
  {
    id: '1',
    name: 'Downtown Beauty Salon',
    address: '123 Main Street, New York, NY 10001',
    phone: '+1 (555) 111-2222',
    city: 'New York',
  },
  {
    id: '2',
    name: 'Uptown Hair Studio',
    address: '456 Park Avenue, New York, NY 10022',
    phone: '+1 (555) 333-4444',
    city: 'New York',
  },
  {
    id: '3',
    name: 'Elegant Nails & Spa',
    address: '789 Broadway, New York, NY 10003',
    phone: '+1 (555) 555-6666',
    city: 'New York',
  },
])

const filteredSalons = computed(() => {
  if (!searchQuery.value) return salons.value
  
  const query = searchQuery.value.toLowerCase()
  return salons.value.filter(
    (salon) =>
      salon.name.toLowerCase().includes(query) ||
      salon.address.toLowerCase().includes(query) ||
      salon.city.toLowerCase().includes(query) ||
      salon.phone.includes(query)
  )
})

const createSalon = () => {
  router.push('/salons/new')
}

const viewSalon = (salon: Salon) => {
  router.push(`/salons/${salon.id}`)
}
</script>
