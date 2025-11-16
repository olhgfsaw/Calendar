<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">{{ t('masters.title') }}</h1>
      <PrimaryButton @click="createMaster">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        {{ t('masters.addMaster') }}
      </PrimaryButton>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div class="p-4 border-b border-gray-200 dark:border-gray-700">
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

      <div v-if="loading" class="p-8 text-center text-gray-500">
        {{ t('common.loading') }}
      </div>

      <div v-else-if="filteredMasters.length === 0" class="p-8 text-center text-gray-500">
        {{ t('common.noData') }}
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                {{ t('masters.name') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                {{ t('masters.specialization') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                {{ t('masters.phone') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                {{ t('masters.email') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                {{ t('masters.status') }}
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                {{ t('common.edit') }}
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr
              v-for="master in filteredMasters"
              :key="master.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors cursor-pointer"
              @click="viewMaster(master.id)"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <Avatar :src="master.photoURL" :name="master.name" size="sm" />
                  <span class="ml-3 font-medium">{{ master.name }}</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                {{ master.specialization }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                {{ master.phone }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                {{ master.email }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 py-1 text-xs font-semibold rounded-full"
                  :class="master.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'"
                >
                  {{ master.isActive ? t('masters.active') : t('masters.inactive') }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
                <IconButton
                  icon="pencil"
                  @click.stop="editMaster(master.id)"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import PrimaryButton from '@/components/base/buttons/PrimaryButton.vue'
import IconButton from '@/components/base/buttons/IconButton.vue'
import BaseInput from '@/components/base/forms/BaseInput.vue'
import Avatar from '@/components/base/layout-pieces/Avatar.vue'

interface Master {
  id: string
  name: string
  specialization: string
  phone: string
  email: string
  photoURL?: string
  isActive: boolean
}

const { t } = useI18n()
const router = useRouter()

const searchQuery = ref('')
const loading = ref(false)

const masters = ref<Master[]>([
  {
    id: '1',
    name: 'Maria Rodriguez',
    specialization: 'Hair Stylist',
    phone: '+1 (555) 123-4567',
    email: 'maria@salon.com',
    photoURL: '',
    isActive: true,
  },
  {
    id: '2',
    name: 'Anna Petrova',
    specialization: 'Nail Technician',
    phone: '+1 (555) 987-6543',
    email: 'anna@salon.com',
    photoURL: '',
    isActive: true,
  },
  {
    id: '3',
    name: 'Sophie Martin',
    specialization: 'Makeup Artist',
    phone: '+1 (555) 456-7890',
    email: 'sophie@salon.com',
    photoURL: '',
    isActive: false,
  },
])

const filteredMasters = computed(() => {
  if (!searchQuery.value) return masters.value
  
  const query = searchQuery.value.toLowerCase()
  return masters.value.filter(
    (master) =>
      master.name.toLowerCase().includes(query) ||
      master.specialization.toLowerCase().includes(query) ||
      master.email.toLowerCase().includes(query) ||
      master.phone.includes(query)
  )
})

const createMaster = () => {
  router.push('/masters/new')
}

const viewMaster = (id: string) => {
  router.push(`/masters/${id}`)
}

const editMaster = (id: string) => {
  router.push(`/masters/${id}/edit`)
}
</script>
