<template>
  <BaseModal
    v-model="isOpen"
    :title="title"
    size="sm"
    :show-close="false"
  >
    <p class="text-gray-600 dark:text-gray-200">{{ message }}</p>
    
    <template #footer>
      <PrimaryButton variant="outline" @click="handleCancel">
        {{ cancelText || $t('common.cancel') }}
      </PrimaryButton>
      <PrimaryButton :variant="confirmVariant" @click="handleConfirm">
        {{ confirmText || $t('common.confirm') }}
      </PrimaryButton>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import BaseModal from './BaseModal.vue'
import PrimaryButton from '../buttons/PrimaryButton.vue'

interface Props {
  modelValue: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  confirmVariant?: 'primary' | 'danger'
}

const props = withDefaults(defineProps<Props>(), {
  confirmVariant: 'primary',
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: []
  cancel: []
}>()

const isOpen = ref(props.modelValue)

watch(() => props.modelValue, (newValue) => {
  isOpen.value = newValue
})

watch(isOpen, (newValue) => {
  emit('update:modelValue', newValue)
})

const handleConfirm = () => {
  emit('confirm')
  isOpen.value = false
}

const handleCancel = () => {
  emit('cancel')
  isOpen.value = false
}
</script>
