<template>
  <div class="flex items-center">
    <button
      type="button"
      :disabled="disabled"
      :class="switchClasses"
      @click="toggle"
    >
      <span :class="thumbClasses"></span>
    </button>
    <label v-if="label" class="ml-3 text-sm text-gray-700 dark:text-gray-300">
      {{ label }}
    </label>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue: boolean
  label?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const toggle = () => {
  if (!props.disabled) {
    emit('update:modelValue', !props.modelValue)
  }
}

const switchClasses = computed(() => {
  const base = 'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  return `${base} ${props.modelValue ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'}`
})

const thumbClasses = computed(() => {
  const base = 'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
  
  return `${base} ${props.modelValue ? 'translate-x-5' : 'translate-x-0'}`
})
</script>
