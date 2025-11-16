<template>
  <div class="w-full">
    <label v-if="label" :for="id" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <textarea
      :id="id"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :rows="rows"
      :class="textareaClasses"
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
      @blur="$emit('blur')"
    ></textarea>
    <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
    <p v-else-if="hint" class="mt-1 text-sm text-gray-500">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  id?: string
  modelValue: string
  label?: string
  placeholder?: string
  error?: string
  hint?: string
  disabled?: boolean
  required?: boolean
  rows?: number
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  required: false,
  rows: 4,
})

defineEmits<{
  'update:modelValue': [value: string]
  blur: []
}>()

const textareaClasses = computed(() => {
  const base = 'block w-full rounded-lg border px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:bg-gray-100 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500'
  
  if (props.error) {
    return `${base} border-red-300 focus:border-red-500 focus:ring-red-500`
  }
  
  return `${base} border-gray-300 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600`
})
</script>
