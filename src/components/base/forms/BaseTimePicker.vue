<template>
  <div class="relative">
    <label v-if="label" class="block text-sm font-medium mb-2">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    
    <div class="relative">
      <input
        :value="displayTime"
        type="text"
        readonly
        :placeholder="placeholder"
        class="w-full px-4 py-2.5 rounded-lg border transition-colors cursor-pointer"
        :class="[
          error 
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
            : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500/20',
          disabled ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed opacity-60' : 'bg-white dark:bg-gray-900'
        ]"
        :disabled="disabled"
        @click="togglePicker"
      />
      
      <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    </div>

    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-1"
    >
      <div
        v-if="isOpen"
        class="absolute z-50 mt-2 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 w-full max-w-xs"
      >
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div class="text-xs text-gray-500 dark:text-gray-400 mb-2 text-center">
              {{ t('common.hour') }}
            </div>
            <div class="max-h-48 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded">
              <button
                v-for="hour in hours"
                :key="hour"
                type="button"
                class="w-full px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                :class="selectedHour === hour && 'bg-blue-500 text-white hover:bg-blue-600'"
                @click="selectHour(hour)"
              >
                {{ formatHour(hour) }}
              </button>
            </div>
          </div>

          <div>
            <div class="text-xs text-gray-500 dark:text-gray-400 mb-2 text-center">
              {{ t('common.minute') }}
            </div>
            <div class="max-h-48 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded">
              <button
                v-for="minute in minutes"
                :key="minute"
                type="button"
                class="w-full px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                :class="selectedMinute === minute && 'bg-blue-500 text-white hover:bg-blue-600'"
                @click="selectMinute(minute)"
              >
                {{ formatMinute(minute) }}
              </button>
            </div>
          </div>
        </div>

        <div class="flex gap-2">
          <button
            type="button"
            class="flex-1 px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            @click="clearTime"
          >
            {{ t('common.clear') }}
          </button>
          <button
            type="button"
            class="flex-1 px-3 py-1.5 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            @click="confirmTime"
          >
            {{ t('common.confirm') }}
          </button>
        </div>
      </div>
    </transition>

    <p v-if="error" class="mt-1 text-sm text-red-500">{{ error }}</p>
    <p v-else-if="hint" class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'

interface Props {
  modelValue?: string | null
  label?: string
  placeholder?: string
  error?: string
  hint?: string
  required?: boolean
  disabled?: boolean
  step?: number
  format24h?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  placeholder: 'Select time',
  required: false,
  disabled: false,
  step: 30,
  format24h: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | null]
}>()

const { t } = useI18n()

const isOpen = ref(false)
const selectedHour = ref<number>(9)
const selectedMinute = ref<number>(0)

const hours = computed(() => {
  const maxHours = props.format24h ? 24 : 12
  return Array.from({ length: maxHours }, (_, i) => i + (props.format24h ? 0 : 1))
})

const minutes = computed(() => {
  const result: number[] = []
  for (let i = 0; i < 60; i += props.step) {
    result.push(i)
  }
  return result
})

const displayTime = computed(() => {
  if (!props.modelValue) return ''
  return props.modelValue
})

const formatHour = (hour: number): string => {
  return hour.toString().padStart(2, '0')
}

const formatMinute = (minute: number): string => {
  return minute.toString().padStart(2, '0')
}

const togglePicker = () => {
  if (!props.disabled) {
    isOpen.value = !isOpen.value
  }
}

const selectHour = (hour: number) => {
  selectedHour.value = hour
  const timeString = `${formatHour(hour)}:${formatMinute(selectedMinute.value)}`
  emit('update:modelValue', timeString)
}

const selectMinute = (minute: number) => {
  selectedMinute.value = minute
  const timeString = `${formatHour(selectedHour.value)}:${formatMinute(minute)}`
  emit('update:modelValue', timeString)
}

const confirmTime = () => {
  const timeString = `${formatHour(selectedHour.value)}:${formatMinute(selectedMinute.value)}`
  emit('update:modelValue', timeString)
  isOpen.value = false
}

const clearTime = () => {
  emit('update:modelValue', null)
  isOpen.value = false
}

const parseTime = (timeString: string) => {
  const [hours, minutes] = timeString.split(':').map(Number)
  selectedHour.value = hours
  selectedMinute.value = minutes
}

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  if (props.modelValue) {
    parseTime(props.modelValue)
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
