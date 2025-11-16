<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <TextButton @click="router.back()">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </TextButton>
        <h1 class="text-2xl font-bold">
          {{ isNewClient ? t('clients.addClient') : t('clients.editClient') }}
        </h1>
      </div>
      <div class="flex gap-2">
        <TextButton v-if="!isNewClient" @click="confirmDelete">
          {{ t('common.delete') }}
        </TextButton>
        <PrimaryButton @click="onSubmit">
          {{ t('common.save') }}
        </PrimaryButton>
      </div>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BaseInput
          v-model="firstName"
          :label="t('clients.firstName')"
          :error="errors.firstName"
          required
        />
        
        <BaseInput
          v-model="lastName"
          :label="t('clients.lastName')"
          :error="errors.lastName"
          required
        />
        
        <BaseInput
          v-model="phone"
          :label="t('clients.phone')"
          :error="errors.phone"
          type="tel"
          required
        />
        
        <BaseInput
          v-model="email"
          :label="t('clients.email')"
          :error="errors.email"
          type="email"
        />
      </div>

      <div>
        <BaseTextarea
          v-model="notes"
          :label="t('clients.notes')"
          :error="errors.notes"
          :rows="4"
          :placeholder="t('clients.notesPlaceholder')"
        />
      </div>
    </div>

    <ConfirmModal
      v-model="showDeleteConfirm"
      :title="t('clients.deleteClient')"
      :message="t('clients.deleteConfirmMessage')"
      @confirm="deleteClient"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import { useNotificationsStore } from '@/stores/notifications'
import PrimaryButton from '@/components/base/buttons/PrimaryButton.vue'
import TextButton from '@/components/base/buttons/TextButton.vue'
import BaseInput from '@/components/base/forms/BaseInput.vue'
import BaseTextarea from '@/components/base/forms/BaseTextarea.vue'
import ConfirmModal from '@/components/base/modals/ConfirmModal.vue'
import { clientSchema } from '@/utils/validators'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const notificationsStore = useNotificationsStore()

const showDeleteConfirm = ref(false)

const { defineField, handleSubmit, errors, setValues } = useForm({
  validationSchema: toTypedSchema(clientSchema),
  initialValues: {
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    notes: '',
  },
})

const [firstName] = defineField('firstName')
const [lastName] = defineField('lastName')
const [phone] = defineField('phone')
const [email] = defineField('email')
const [notes] = defineField('notes')

const isNewClient = computed(() => route.params.id === 'new')

const onSubmit = handleSubmit((values) => {
  notificationsStore.success(
    isNewClient.value 
      ? t('clients.clientCreated') 
      : t('clients.clientUpdated')
  )
  
  router.push('/clients')
})

const confirmDelete = () => {
  showDeleteConfirm.value = true
}

const deleteClient = () => {
  notificationsStore.success(t('clients.clientDeleted'))
  router.push('/clients')
}

onMounted(() => {
  if (!isNewClient.value) {
    setValues({
      firstName: 'Emma',
      lastName: 'Watson',
      phone: '+1 (555) 222-3333',
      email: 'emma.watson@email.com',
      notes: 'Prefers morning appointments. Regular client.',
    })
  }
})
</script>
