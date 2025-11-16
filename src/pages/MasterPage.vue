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
          {{ isNewMaster ? t('masters.addMaster') : t('masters.editMaster') }}
        </h1>
      </div>
      <div class="flex gap-2">
        <TextButton v-if="!isNewMaster" @click="confirmDelete">
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
          :label="t('masters.name')"
          :error="errors.name"
          required
        />
        
        <BaseInput
          v-model="form.specialization"
          :label="t('masters.specialization')"
          :error="errors.specialization"
          required
        />
        
        <BaseInput
          v-model="form.phone"
          :label="t('masters.phone')"
          :error="errors.phone"
          type="tel"
          required
        />
        
        <BaseInput
          v-model="form.email"
          :label="t('masters.email')"
          :error="errors.email"
          type="email"
          required
        />

        <BaseInput
          v-model="form.photoURL"
          :label="t('masters.photo')"
          :error="errors.photoURL"
          type="url"
          :placeholder="t('masters.photoPlaceholder')"
        />

        <div class="flex items-center gap-4">
          <BaseSwitch
            v-model="form.isActive"
            :label="t('masters.active')"
          />
        </div>
      </div>

      <div>
        <BaseTextarea
          v-model="form.bio"
          :label="t('masters.bio')"
          :error="errors.bio"
          rows="4"
          :placeholder="t('masters.bioPlaceholder')"
        />
      </div>

      <div>
        <label class="block text-sm font-medium mb-2">
          {{ t('masters.workingHours') }}
        </label>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <BaseCheckbox
            v-for="day in weekDays"
            :key="day.value"
            v-model="form.workingDays"
            :value="day.value"
            :label="day.label"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BaseTimePicker
          v-model="form.startTime"
          :label="t('masters.startTime')"
          :error="errors.startTime"
        />
        
        <BaseTimePicker
          v-model="form.endTime"
          :label="t('masters.endTime')"
          :error="errors.endTime"
        />
      </div>
    </div>

    <ConfirmModal
      v-model="showDeleteConfirm"
      :title="t('masters.deleteMaster')"
      :message="t('masters.deleteConfirmMessage')"
      @confirm="deleteMaster"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useNotificationsStore } from '@/store/notifications'
import PrimaryButton from '@/components/base/buttons/PrimaryButton.vue'
import TextButton from '@/components/base/buttons/TextButton.vue'
import BaseInput from '@/components/base/forms/BaseInput.vue'
import BaseTextarea from '@/components/base/forms/BaseTextarea.vue'
import BaseSwitch from '@/components/base/forms/BaseSwitch.vue'
import BaseCheckbox from '@/components/base/forms/BaseCheckbox.vue'
import BaseTimePicker from '@/components/base/forms/BaseTimePicker.vue'
import ConfirmModal from '@/components/base/modals/ConfirmModal.vue'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const notificationsStore = useNotificationsStore()

const showDeleteConfirm = ref(false)

const form = ref({
  name: '',
  specialization: '',
  phone: '',
  email: '',
  photoURL: '',
  bio: '',
  isActive: true,
  workingDays: [] as string[],
  startTime: '09:00',
  endTime: '18:00',
})

const errors = ref<Record<string, string>>({})

const weekDays = computed(() => [
  { value: 'mon', label: t('common.monday') },
  { value: 'tue', label: t('common.tuesday') },
  { value: 'wed', label: t('common.wednesday') },
  { value: 'thu', label: t('common.thursday') },
  { value: 'fri', label: t('common.friday') },
  { value: 'sat', label: t('common.saturday') },
  { value: 'sun', label: t('common.sunday') },
])

const isNewMaster = computed(() => route.params.id === 'new')

const validate = (): boolean => {
  errors.value = {}
  
  if (!form.value.name) {
    errors.value.name = t('validation.name.required')
  }
  
  if (!form.value.specialization) {
    errors.value.specialization = t('validation.required')
  }
  
  if (!form.value.phone) {
    errors.value.phone = t('validation.phone.required')
  }
  
  if (!form.value.email) {
    errors.value.email = t('validation.email.required')
  }
  
  return Object.keys(errors.value).length === 0
}

const onSubmit = () => {
  if (!validate()) {
    notificationsStore.error(t('validation.formErrors'))
    return
  }
  
  notificationsStore.success(
    isNewMaster.value 
      ? t('masters.masterCreated') 
      : t('masters.masterUpdated')
  )
  
  router.push('/masters')
}

const confirmDelete = () => {
  showDeleteConfirm.value = true
}

const deleteMaster = () => {
  notificationsStore.success(t('masters.masterDeleted'))
  router.push('/masters')
}

onMounted(() => {
  if (!isNewMaster.value) {
    form.value = {
      name: 'Maria Rodriguez',
      specialization: 'Hair Stylist',
      phone: '+1 (555) 123-4567',
      email: 'maria@salon.com',
      photoURL: '',
      bio: 'Professional hair stylist with 10+ years of experience.',
      isActive: true,
      workingDays: ['mon', 'tue', 'wed', 'thu', 'fri'],
      startTime: '09:00',
      endTime: '18:00',
    }
  }
})
</script>
