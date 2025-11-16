<template>
  <div class="flex items-center">
    <input
      :id="id"
      type="checkbox"
      :checked="isChecked"
      :disabled="disabled"
      :class="checkboxClasses"
      @change="handleChange"
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
  modelValue: boolean | string[] | null | undefined
  label?: string
  disabled?: boolean
  value?: string
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean | string[]]
}>()

const isArray = computed(() => Array.isArray(props.modelValue))

const isChecked = computed(() => {
  if (isArray.value && props.value !== undefined) {
    return (props.modelValue as string[]).includes(props.value)
  }
  return props.modelValue as boolean
})

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const checked = target.checked
  
  if (props.value !== undefined) {
    const currentArray = Array.isArray(props.modelValue) ? props.modelValue : []
    if (checked) {
      const newArray = [...currentArray, props.value]
      emit('update:modelValue', [...new Set(newArray)])
    } else {
      emit('update:modelValue', currentArray.filter(v => v !== props.value))
    }
  } else {
    emit('update:modelValue', checked)
  }
}

const checkboxClasses = computed(() => {
  return 'h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:bg-gray-800'
})
</script>
