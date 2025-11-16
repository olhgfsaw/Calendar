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

    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <BaseInput v-model="searchQuery" :placeholder="t('common.search')" type="text">
        <template #prefix>
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

    <BaseDataTable
      :columns="columns"
      :data="filteredClients"
      :loading="loading"
      :page-size="10"
      @row-click="viewClient"
    >
      <template #cell-name="{ item }">
        <div class="flex items-center">
          <Avatar :name="`${item.firstName} ${item.lastName}`" size="sm" />
          <span class="ml-3 font-medium">{{ item.firstName }} {{ item.lastName }}</span>
        </div>
      </template>

      <template #cell-phone="{ value }">
        <span class="text-sm text-gray-600 dark:text-gray-400">{{ value }}</span>
      </template>

      <template #cell-email="{ value }">
        <span class="text-sm text-gray-600 dark:text-gray-400">{{ value }}</span>
      </template>

      <template #cell-lastVisit="{ value }">
        <span class="text-sm text-gray-600 dark:text-gray-400">{{ value }}</span>
      </template>

      <template #cell-totalAppointments="{ value }">
        <span class="text-sm text-gray-600 dark:text-gray-400">{{ value }}</span>
      </template>

      <template #cell-actions="{ item }">
        <IconButton icon="pencil" @click.stop="editClient(item.id)" />
      </template>
    </BaseDataTable>
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
import BaseDataTable from '@/components/base/BaseDataTable.vue'

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

const columns = [
  { key: 'name', label: t('common.name'), width: '2fr' },
  { key: 'phone', label: t('clients.phone'), width: '1.5fr' },
  { key: 'email', label: t('clients.email'), width: '2fr' },
  { key: 'lastVisit', label: t('clients.lastVisit'), width: '1.5fr' },
  { key: 'totalAppointments', label: t('clients.totalAppointments'), width: '1fr' },
  { key: 'actions', label: t('common.edit'), width: '80px', align: 'right', sortable: false },
]

const clientsRaw = ref<Client[]>([
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
  {
    id: '4',
    firstName: 'Michael',
    lastName: 'Brown',
    phone: '+1 (555) 777-8888',
    email: 'michael.brown@email.com',
    lastVisit: '2024-03-12',
    totalAppointments: 15,
  },
  {
    id: '5',
    firstName: 'Sophia',
    lastName: 'Davis',
    phone: '+1 (555) 888-9999',
    email: 'sophia.davis@email.com',
    lastVisit: '2024-03-08',
    totalAppointments: 3,
  },
  {
    id: '6',
    firstName: 'Daniel',
    lastName: 'Wilson',
    phone: '+1 (555) 999-1111',
    email: 'daniel.wilson@email.com',
    lastVisit: '2024-03-05',
    totalAppointments: 7,
  },
  {
    id: '7',
    firstName: 'Olivia',
    lastName: 'Taylor',
    phone: '+1 (555) 111-2222',
    email: 'olivia.taylor@email.com',
    lastVisit: '2024-02-25',
    totalAppointments: 10,
  },
  {
    id: '8',
    firstName: 'James',
    lastName: 'Martinez',
    phone: '+1 (555) 222-3334',
    email: 'james.martinez@email.com',
    lastVisit: '2024-03-14',
    totalAppointments: 6,
  },
  {
    id: '9',
    firstName: 'Isabella',
    lastName: 'Garcia',
    phone: '+1 (555) 333-4445',
    email: 'isabella.garcia@email.com',
    lastVisit: '2024-03-11',
    totalAppointments: 9,
  },
  {
    id: '10',
    firstName: 'William',
    lastName: 'Rodriguez',
    phone: '+1 (555) 444-5556',
    email: 'william.rodriguez@email.com',
    lastVisit: '2024-03-07',
    totalAppointments: 4,
  },
  {
    id: '11',
    firstName: 'Mia',
    lastName: 'Hernandez',
    phone: '+1 (555) 555-6667',
    email: 'mia.hernandez@email.com',
    lastVisit: '2024-03-13',
    totalAppointments: 11,
  },
  {
    id: '12',
    firstName: 'David',
    lastName: 'Lopez',
    phone: '+1 (555) 666-7778',
    email: 'david.lopez@email.com',
    lastVisit: '2024-03-01',
    totalAppointments: 2,
  },
  {
    id: '13',
    firstName: 'Charlotte',
    lastName: 'Gonzalez',
    phone: '+1 (555) 777-8889',
    email: 'charlotte.gonzalez@email.com',
    lastVisit: '2024-02-20',
    totalAppointments: 14,
  },
])

const clients = computed(() => {
  return clientsRaw.value.map(client => ({
    ...client,
    name: `${client.firstName} ${client.lastName}`
  }))
})

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

const viewClient = (client: Client) => {
  router.push(`/clients/${client.id}`)
}

const editClient = (id: string) => {
  router.push(`/clients/${id}/edit`)
}
</script>
