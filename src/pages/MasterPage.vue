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
          v-model="name"
          :label="t('masters.name')"
          :error="errors.name"
          required
        />
        
        <BaseInput
          v-model="specialization"
          :label="t('masters.specialization')"
          :error="errors.specialization"
          required
        />
        
        <BaseInput
          v-model="phone"
          :label="t('masters.phone')"
          :error="errors.phone"
          type="tel"
          required
        />
        
        <BaseInput
          v-model="email"
          :label="t('masters.email')"
          :error="errors.email"
          type="email"
          required
        />

        <BaseInput
          v-model="photoURL"
          :label="t('masters.photo')"
          :error="errors.photoURL"
          type="url"
          :placeholder="t('masters.photoPlaceholder')"
        />

        <div class="flex items-center gap-4">
          <BaseSwitch
            v-model="isActive"
            :label="t('masters.active')"
          />
        </div>
      </div>

      <div>
        <BaseTextarea
          v-model="bio"
          :label="t('masters.bio')"
          :error="errors.bio"
          :rows="4"
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
            v-model="workingDays"
            :value="day.value"
            :label="day.label"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BaseTimePicker
          v-model="startTime"
          :label="t('masters.startTime')"
          :error="errors.startTime"
        />
        
        <BaseTimePicker
          v-model="endTime"
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
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import { useNotificationsStore } from '@/stores/notifications'
import PrimaryButton from '@/components/base/buttons/PrimaryButton.vue'
import TextButton from '@/components/base/buttons/TextButton.vue'
import BaseInput from '@/components/base/forms/BaseInput.vue'
import BaseTextarea from '@/components/base/forms/BaseTextarea.vue'
import BaseSwitch from '@/components/base/forms/BaseSwitch.vue'
import BaseCheckbox from '@/components/base/forms/BaseCheckbox.vue'
import BaseTimePicker from '@/components/base/forms/BaseTimePicker.vue'
import ConfirmModal from '@/components/base/modals/ConfirmModal.vue'
import { masterSchema } from '@/utils/validators'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const notificationsStore = useNotificationsStore()

const showDeleteConfirm = ref(false)

const { defineField, handleSubmit, errors, setValues } = useForm({
  validationSchema: toTypedSchema(masterSchema),
  initialValues: {
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
  },
})

const [name] = defineField('name')
const [specialization] = defineField('specialization')
const [phone] = defineField('phone')
const [email] = defineField('email')
const [photoURL] = defineField('photoURL')
const [bio] = defineField('bio')
const [isActive] = defineField('isActive')
const [workingDays] = defineField('workingDays')
const [startTime] = defineField('startTime')
const [endTime] = defineField('endTime')

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

const onSubmit = handleSubmit((values) => {
  notificationsStore.success(
    isNewMaster.value 
      ? t('masters.masterCreated') 
      : t('masters.masterUpdated')
  )
  
  router.push('/masters')
})

const confirmDelete = () => {
  showDeleteConfirm.value = true
}

const deleteMaster = () => {
  notificationsStore.success(t('masters.masterDeleted'))
  router.push('/masters')
}

onMounted(() => {
  if (!isNewMaster.value) {
    setValues({
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
    })
  }
})
</script>
