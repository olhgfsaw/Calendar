<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">{{ t('masters.title') }}</h1>
      <PrimaryButton @click="createMaster">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
        {{ t('masters.addMaster') }}
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
      :data="filteredMasters"
      :loading="loading"
      :page-size="10"
      @row-click="viewMaster"
    >
      <template #cell-name="{ item }">
        <div class="flex items-center">
          <Avatar :src="item.photoURL" :name="item.name" size="sm" />
          <span class="ml-3 font-medium">{{ item.name }}</span>
        </div>
      </template>

      <template #cell-specialization="{ value }">
        <span class="text-sm text-gray-600 dark:text-gray-400">{{ value }}</span>
      </template>

      <template #cell-phone="{ value }">
        <span class="text-sm text-gray-600 dark:text-gray-400">{{ value }}</span>
      </template>

      <template #cell-email="{ value }">
        <span class="text-sm text-gray-600 dark:text-gray-400">{{ value }}</span>
      </template>

      <template #cell-status="{ item }">
        <span
          class="px-2 py-1 text-xs font-semibold rounded-full"
          :class="
            item.isActive
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
          "
        >
          {{ item.isActive ? t('masters.active') : t('masters.inactive') }}
        </span>
      </template>

      <template #cell-actions="{ item }">
        <IconButton icon="pencil" @click.stop="editMaster(item.id)" />
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

const columns = [
  { key: 'name', label: t('masters.name'), width: '2fr' },
  { key: 'specialization', label: t('masters.specialization'), width: '1.5fr' },
  { key: 'phone', label: t('masters.phone'), width: '1.5fr' },
  { key: 'email', label: t('masters.email'), width: '2fr' },
  { key: 'status', label: t('masters.status'), width: '1fr', sortable: false },
  { key: 'actions', label: t('common.edit'), width: '80px', align: 'right', sortable: false },
]

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
  {
    id: '4',
    name: 'Elena Ivanova',
    specialization: 'Hair Colorist',
    phone: '+1 (555) 234-5678',
    email: 'elena@salon.com',
    photoURL: '',
    isActive: true,
  },
  {
    id: '5',
    name: 'Lisa Chen',
    specialization: 'Massage Therapist',
    phone: '+1 (555) 345-6789',
    email: 'lisa@salon.com',
    photoURL: '',
    isActive: true,
  },
  {
    id: '6',
    name: 'Carmen Garcia',
    specialization: 'Esthetician',
    phone: '+1 (555) 456-7891',
    email: 'carmen@salon.com',
    photoURL: '',
    isActive: true,
  },
  {
    id: '7',
    name: 'Natalia Kowalski',
    specialization: 'Eyebrow Artist',
    phone: '+1 (555) 567-8912',
    email: 'natalia@salon.com',
    photoURL: '',
    isActive: false,
  },
  {
    id: '8',
    name: 'Sarah Johnson',
    specialization: 'Hair Stylist',
    phone: '+1 (555) 678-9123',
    email: 'sarah@salon.com',
    photoURL: '',
    isActive: true,
  },
  {
    id: '9',
    name: 'Michelle Lee',
    specialization: 'Nail Artist',
    phone: '+1 (555) 789-1234',
    email: 'michelle@salon.com',
    photoURL: '',
    isActive: true,
  },
  {
    id: '10',
    name: 'Julia Schmidt',
    specialization: 'Lash Technician',
    phone: '+1 (555) 891-2345',
    email: 'julia@salon.com',
    photoURL: '',
    isActive: true,
  },
  {
    id: '11',
    name: 'Victoria Brown',
    specialization: 'Makeup Artist',
    phone: '+1 (555) 912-3456',
    email: 'victoria@salon.com',
    photoURL: '',
    isActive: true,
  },
  {
    id: '12',
    name: 'Diana Kim',
    specialization: 'Hair Stylist',
    phone: '+1 (555) 123-4568',
    email: 'diana@salon.com',
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
      master.phone.includes(query),
  )
})

const createMaster = () => {
  router.push('/masters/new')
}

const viewMaster = (master: Master) => {
  router.push(`/masters/${master.id}`)
}

const editMaster = (id: string) => {
  router.push(`/masters/${id}/edit`)
}
</script>
