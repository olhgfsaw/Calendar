<template>
  <BaseModal
    :model-value="isOpen"
    :title="isEditing ? t('appointments.editAppointment') : t('appointments.createAppointment')"
    size="lg"
    @close="handleClose"
  >
    <form @submit="onSubmit" class="space-y-4">
      <BaseSelect
        v-model="clientId"
        :label="t('appointments.client')"
        :options="clientOptions"
        :error="errors.clientId"
        required
      />

      <BaseSelect
        v-model="masterId"
        :label="t('appointments.master')"
        :options="masterOptions"
        :error="errors.masterId"
        required
      />

      <BaseSelect
        v-model="serviceId"
        :label="t('appointments.service')"
        :options="serviceOptions"
        :error="errors.serviceId"
        required
      />

      <div class="grid grid-cols-2 gap-4">
        <BaseDatePicker
          v-model="date"
          :label="t('appointments.date')"
          :error="errors.date"
          required
        />

        <BaseTimePicker
          v-model="startTime"
          :label="t('appointments.startTime')"
          :error="errors.startTime"
          :step="30"
          required
        />
      </div>

      <BaseSelect
        v-model="status"
        :label="t('appointments.status.label')"
        :options="statusOptions"
        :error="errors.status"
        required
      />

      <BaseTextarea
        v-model="notes"
        :label="t('appointments.notes')"
        :placeholder="t('appointments.notesPlaceholder')"
        :rows="3"
      />

      <div class="flex gap-3 pt-4">
        <button
          v-if="isEditing"
          type="button"
          class="px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          @click="handleDelete"
        >
          {{ t('common.delete') }}
        </button>
        
        <div class="flex-1"></div>
        
        <button
          type="button"
          class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          @click="handleClose"
        >
          {{ t('common.cancel') }}
        </button>
        
        <PrimaryButton
          type="submit"
          :loading="loading"
        >
          {{ isEditing ? t('common.save') : t('common.create') }}
        </PrimaryButton>
      </div>
    </form>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import { set } from 'date-fns'
import BaseModal from '@/components/base/modals/BaseModal.vue'
import BaseSelect from '@/components/base/forms/BaseSelect.vue'
import BaseDatePicker from '@/components/base/forms/BaseDatePicker.vue'
import BaseTimePicker from '@/components/base/forms/BaseTimePicker.vue'
import BaseTextarea from '@/components/base/forms/BaseTextarea.vue'
import PrimaryButton from '@/components/base/buttons/PrimaryButton.vue'
import { appointmentSchema } from '@/utils/validators'
import type { Appointment } from '@/types'

interface Props {
  isOpen: boolean
  appointment?: Appointment | null
  clientOptions?: Array<{ value: string; label: string }>
  masterOptions?: Array<{ value: string; label: string }>
  serviceOptions?: Array<{ value: string; label: string }>
  initialDate?: Date | null
  initialTime?: string | null
}

const props = withDefaults(defineProps<Props>(), {
  appointment: null,
  clientOptions: () => [],
  masterOptions: () => [],
  serviceOptions: () => [],
  initialDate: null,
  initialTime: null,
})

const emit = defineEmits<{
  close: []
  submit: [data: Partial<Appointment>]
  delete: []
}>()

const { t } = useI18n()

const loading = ref(false)

const { defineField, handleSubmit, errors, resetForm, setValues } = useForm({
  validationSchema: toTypedSchema(appointmentSchema),
  initialValues: {
    clientId: '',
    masterId: '',
    serviceId: '',
    salonId: '',
    date: new Date(),
    startTime: '09:00',
    status: 'scheduled' as Appointment['status'],
    notes: '',
  },
})

const [clientId] = defineField('clientId')
const [masterId] = defineField('masterId')
const [serviceId] = defineField('serviceId')
const [salonId] = defineField('salonId')
const [date] = defineField('date')
const [startTime] = defineField('startTime')
const [status] = defineField('status')
const [notes] = defineField('notes')

const isEditing = computed(() => !!props.appointment)

const statusOptions = computed(() => [
  { value: 'scheduled', label: t('appointments.status.scheduled') },
  { value: 'confirmed', label: t('appointments.status.confirmed') },
  { value: 'cancelled', label: t('appointments.status.cancelled') },
  { value: 'completed', label: t('appointments.status.completed') },
  { value: 'no-show', label: t('appointments.status.no-show') },
])

watch(() => props.isOpen, (isOpen) => {
  if (isOpen && props.appointment) {
    resetForm({
      values: {
        clientId: props.appointment.clientId,
        masterId: props.appointment.masterId,
        serviceId: props.appointment.serviceId,
        salonId: props.appointment.salonId,
        date: props.appointment.start,
        startTime: `${props.appointment.start.getHours().toString().padStart(2, '0')}:${props.appointment.start.getMinutes().toString().padStart(2, '0')}`,
        status: props.appointment.status,
        notes: props.appointment.notes || '',
      }
    })
  } else if (isOpen) {
    resetForm()
  }
})

watch([() => props.initialDate, () => props.initialTime], ([newDate, time]) => {
  if (props.isOpen && !props.appointment && newDate) {
    setValues({ date: newDate })
  }
  if (props.isOpen && !props.appointment && time) {
    setValues({ startTime: time })
  }
})

const onSubmit = handleSubmit((values) => {
  loading.value = true
  
  try {
    const [hours, minutes] = values.startTime.split(':').map(Number)
    const start = set(values.date, { hours, minutes, seconds: 0, milliseconds: 0 })
    const end = new Date(start.getTime() + 60 * 60000)
    
    const appointmentData: Partial<Appointment> = {
      clientId: values.clientId,
      masterId: values.masterId,
      serviceId: values.serviceId,
      salonId: values.salonId || '',
      start,
      end,
      status: values.status,
      notes: values.notes || undefined,
    }
    
    if (props.appointment) {
      appointmentData.id = props.appointment.id
    }
    
    emit('submit', appointmentData)
    handleClose()
  } finally {
    loading.value = false
  }
})

const handleClose = () => {
  resetForm()
  emit('close')
}

const handleDelete = () => {
  if (confirm(t('calendar.confirmDelete'))) {
    emit('delete')
  }
}
</script>
