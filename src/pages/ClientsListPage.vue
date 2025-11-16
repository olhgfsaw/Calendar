<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">{{ t('clients.title') }}</h1>
      <PrimaryButton @click="createClient">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
        {{ t('clients.addClient') }}
      </PrimaryButton>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div class="p-4 border-b border-gray-200 dark:border-gray-700">
        <BaseInput v-model="searchQuery" :placeholder="t('common.search')" type="text">
          <template #prefix>
            <svg
              class="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </template>
        </BaseInput>
      </div>

      <div v-if="loading" class="p-8 text-center text-gray-500">
        {{ t('common.loading') }}
      </div>

      <div v-else-if="filteredClients.length === 0" class="p-8 text-center text-gray-500">
        {{ t('common.noData') }}
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                {{ t('clients.name') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                {{ t('clients.phone') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                {{ t('clients.email') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                {{ t('clients.lastVisit') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                {{ t('clients.totalAppointments') }}
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                {{ t('common.edit') }}
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr
              v-for="client in filteredClients"
              :key="client.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors cursor-pointer"
              @click="viewClient(client.id)"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <Avatar :name="`${client.firstName} ${client.lastName}`" size="sm" />
                  <span class="ml-3 font-medium">{{ client.firstName }} {{ client.lastName }}</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                {{ client.phone }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                {{ client.email }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                {{ client.lastVisit }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                {{ client.totalAppointments }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
                <IconButton icon="pencil" @click.stop="editClient(client.id)" />
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
import Avatar from '@/components/base/layoutPieces/Avatar.vue'

interface Client {
  id: string
  firstName: string
  lastName: string
  phone: string
  email: string
  lastVisit: string
  totalAppointments: number
}

const { t } = useI18n()
const router = useRouter()

const searchQuery = ref('')
const loading = ref(false)

const clients = ref<Client[]>([
  {
    id: '1',
    firstName: 'Emma',
    lastName: 'Watson',
    phone: '+1 (555) 222-3333',
    email: 'emma.watson@email.com',
    lastVisit: '2024-03-15',
    totalAppointments: 12,
  },
  {
    id: '2',
    firstName: 'John',
    lastName: 'Smith',
    phone: '+1 (555) 444-5555',
    email: 'john.smith@email.com',
    lastVisit: '2024-03-10',
    totalAppointments: 8,
  },
  {
    id: '3',
    firstName: 'Lisa',
    lastName: 'Anderson',
    phone: '+1 (555) 666-7777',
    email: 'lisa.anderson@email.com',
    lastVisit: '2024-02-28',
    totalAppointments: 5,
  },
])

const filteredClients = computed(() => {
  if (!searchQuery.value) return clients.value

  const query = searchQuery.value.toLowerCase()
  return clients.value.filter(
    (client) =>
      client.firstName.toLowerCase().includes(query) ||
      client.lastName.toLowerCase().includes(query) ||
      client.email.toLowerCase().includes(query) ||
      client.phone.includes(query),
  )
})

const createClient = () => {
  router.push('/clients/new')
}

const viewClient = (id: string) => {
  router.push(`/clients/${id}`)
}

const editClient = (id: string) => {
  router.push(`/clients/${id}/edit`)
}
</script>
