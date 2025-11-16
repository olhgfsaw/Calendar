<template>
  <div class="relative">
    <label v-if="label" class="block text-sm font-medium mb-2">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    
    <div class="relative">
      <input
        :value="formattedDate"
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
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
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
        class="absolute z-50 mt-2 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 min-w-[280px]"
      >
        <div class="flex items-center justify-between mb-4">
          <button
            type="button"
            class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            @click="previousMonth"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div class="font-semibold">
            {{ currentMonthYear }}
          </div>
          
          <button
            type="button"
            class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            @click="nextMonth"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div class="grid grid-cols-7 gap-1 mb-2">
          <div
            v-for="day in weekDays"
            :key="day"
            class="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-1"
          >
            {{ day }}
          </div>
        </div>

        <div class="grid grid-cols-7 gap-1">
          <button
            v-for="(date, index) in calendarDates"
            :key="index"
            type="button"
            class="aspect-square p-1 text-sm rounded transition-colors"
            :class="[
              date.isCurrentMonth 
                ? 'text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700' 
                : 'text-gray-400 dark:text-gray-600',
              date.isToday && 'font-bold border border-blue-500',
              date.isSelected && 'bg-blue-500 text-white hover:bg-blue-600',
              !date.isCurrentMonth && 'opacity-50'
            ]"
            @click="selectDate(date.date)"
          >
            {{ date.day }}
          </button>
        </div>

        <div class="mt-4 flex gap-2">
          <button
            type="button"
            class="flex-1 px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            @click="clearDate"
          >
            {{ t('common.clear') }}
          </button>
          <button
            type="button"
            class="flex-1 px-3 py-1.5 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            @click="selectToday"
          >
            {{ t('common.today') }}
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
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addMonths, subMonths } from 'date-fns'

interface Props {
  modelValue?: Date | null
  label?: string
  placeholder?: string
  error?: string
  hint?: string
  required?: boolean
  disabled?: boolean
  minDate?: Date
  maxDate?: Date
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  placeholder: 'Select date',
  required: false,
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: Date | null]
}>()

const { t } = useI18n()

const isOpen = ref(false)
const currentMonth = ref(new Date())

const weekDays = computed(() => {
  return [
    t('common.sunday').substring(0, 2),
    t('common.monday').substring(0, 2),
    t('common.tuesday').substring(0, 2),
    t('common.wednesday').substring(0, 2),
    t('common.thursday').substring(0, 2),
    t('common.friday').substring(0, 2),
    t('common.saturday').substring(0, 2),
  ]
})

const currentMonthYear = computed(() => {
  return format(currentMonth.value, 'MMMM yyyy')
})

const formattedDate = computed(() => {
  if (!props.modelValue) return ''
  return format(props.modelValue, 'MMM dd, yyyy')
})

const calendarDates = computed(() => {
  const start = startOfMonth(currentMonth.value)
  const end = endOfMonth(currentMonth.value)
  
  const startDay = start.getDay()
  const dates: Array<{
    date: Date
    day: number
    isCurrentMonth: boolean
    isToday: boolean
    isSelected: boolean
  }> = []

  const prevMonthEnd = endOfMonth(subMonths(currentMonth.value, 1))
  for (let i = startDay - 1; i >= 0; i--) {
    const date = new Date(prevMonthEnd)
    date.setDate(prevMonthEnd.getDate() - i)
    dates.push({
      date,
      day: date.getDate(),
      isCurrentMonth: false,
      isToday: isToday(date),
      isSelected: props.modelValue ? isSameDay(date, props.modelValue) : false,
    })
  }

  const monthDates = eachDayOfInterval({ start, end })
  monthDates.forEach((date) => {
    dates.push({
      date,
      day: date.getDate(),
      isCurrentMonth: true,
      isToday: isToday(date),
      isSelected: props.modelValue ? isSameDay(date, props.modelValue) : false,
    })
  })

  const remainingDays = 42 - dates.length
  for (let i = 1; i <= remainingDays; i++) {
    const date = new Date(end)
    date.setDate(end.getDate() + i)
    dates.push({
      date,
      day: date.getDate(),
      isCurrentMonth: false,
      isToday: isToday(date),
      isSelected: props.modelValue ? isSameDay(date, props.modelValue) : false,
    })
  }

  return dates
})

const togglePicker = () => {
  if (!props.disabled) {
    isOpen.value = !isOpen.value
  }
}

const selectDate = (date: Date) => {
  if (props.minDate && date < props.minDate) return
  if (props.maxDate && date > props.maxDate) return
  
  emit('update:modelValue', date)
  isOpen.value = false
}

const selectToday = () => {
  selectDate(new Date())
}

const clearDate = () => {
  emit('update:modelValue', null)
  isOpen.value = false
}

const previousMonth = () => {
  currentMonth.value = subMonths(currentMonth.value, 1)
}

const nextMonth = () => {
  currentMonth.value = addMonths(currentMonth.value, 1)
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
    currentMonth.value = new Date(props.modelValue)
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
