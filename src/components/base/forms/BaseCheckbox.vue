<template>
  <div class="flex items-center">
    <input
      :id="id"
      type="checkbox"
      :checked="modelValue"
      :disabled="disabled"
      :class="checkboxClasses"
      @change="$emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
    />
    <label v-if="label" :for="id" class="ml-2 text-sm text-gray-700 dark:text-gray-300">
      {{ label }}
    </label>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  id?: string
  modelValue: boolean
  label?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
})

defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const checkboxClasses = computed(() => {
  return 'h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:bg-gray-800'
})
</script>
