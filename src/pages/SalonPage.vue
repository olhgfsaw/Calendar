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
          {{ isNewSalon ? t('salons.addSalon') : t('salons.editSalon') }}
        </h1>
      </div>
      <div class="flex gap-2">
        <TextButton v-if="!isNewSalon" @click="confirmDelete">
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
          v-model="form.name"
          :label="t('salons.name')"
          :error="errors.name"
          required
        />
        
        <BaseInput
          v-model="form.phone"
          :label="t('salons.phone')"
          :error="errors.phone"
          type="tel"
          required
        />
        
        <BaseInput
          v-model="form.email"
          :label="t('salons.email')"
          :error="errors.email"
          type="email"
          required
        />

        <BaseInput
          v-model="form.city"
          :label="t('salons.city')"
          :error="errors.city"
          required
        />

        <BaseInput
          v-model="form.country"
          :label="t('salons.country')"
          :error="errors.country"
          required
        />
      </div>

      <BaseInput
        v-model="form.address"
        :label="t('salons.address')"
        :error="errors.address"
        required
      />

      <div>
        <BaseTextarea
          v-model="form.workingHours"
          :label="t('salons.workingHours')"
          :error="errors.workingHours"
          rows="3"
          :placeholder="t('salons.workingHoursPlaceholder')"
        />
      </div>

      <div>
        <BaseTextarea
          v-model="form.description"
          :label="t('salons.description')"
          :error="errors.description"
          rows="4"
          :placeholder="t('salons.descriptionPlaceholder')"
        />
      </div>
    </div>

    <ConfirmModal
      v-model="showDeleteConfirm"
      :title="t('salons.deleteSalon')"
      :message="t('salons.deleteConfirmMessage')"
      @confirm="deleteSalon"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useNotificationsStore } from '@/stores/notifications'
import PrimaryButton from '@/components/base/buttons/PrimaryButton.vue'
import TextButton from '@/components/base/buttons/TextButton.vue'
import BaseInput from '@/components/base/forms/BaseInput.vue'
import BaseTextarea from '@/components/base/forms/BaseTextarea.vue'
import ConfirmModal from '@/components/base/modals/ConfirmModal.vue'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const notificationsStore = useNotificationsStore()

const showDeleteConfirm = ref(false)

const form = ref({
  name: '',
  address: '',
  city: '',
  country: '',
  phone: '',
  email: '',
  workingHours: '',
  description: '',
})

const errors = ref<Record<string, string>>({})

const isNewSalon = computed(() => route.params.id === 'new')

const validate = (): boolean => {
  errors.value = {}
  
  if (!form.value.name) {
    errors.value.name = t('validation.name.required')
  }
  
  if (!form.value.phone) {
    errors.value.phone = t('validation.phone.required')
  }
  
  if (!form.value.email) {
    errors.value.email = t('validation.email.required')
  }
  
  if (!form.value.address) {
    errors.value.address = t('validation.required')
  }
  
  if (!form.value.city) {
    errors.value.city = t('validation.required')
  }
  
  if (!form.value.country) {
    errors.value.country = t('validation.required')
  }
  
  return Object.keys(errors.value).length === 0
}

const onSubmit = () => {
  if (!validate()) {
    notificationsStore.error(t('validation.formErrors'))
    return
  }
  
  notificationsStore.success(
    isNewSalon.value 
      ? t('salons.salonCreated') 
      : t('salons.salonUpdated')
  )
  
  router.push('/salons')
}

const confirmDelete = () => {
  showDeleteConfirm.value = true
}

const deleteSalon = () => {
  notificationsStore.success(t('salons.salonDeleted'))
  router.push('/salons')
}

onMounted(() => {
  if (!isNewSalon.value) {
    form.value = {
      name: 'Downtown Beauty Salon',
      address: '123 Main Street',
      city: 'New York',
      country: 'USA',
      phone: '+1 (555) 111-2222',
      email: 'info@downtown-salon.com',
      workingHours: 'Mon-Fri: 9:00-20:00, Sat-Sun: 10:00-18:00',
      description: 'Full-service beauty salon in the heart of downtown.',
    }
  }
})
</script>
