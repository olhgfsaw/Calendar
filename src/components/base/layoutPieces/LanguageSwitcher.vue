<template>
  <div class="relative">
    <button
      type="button"
      class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
      @click="isOpen = !isOpen"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path>
      </svg>
      <span class="text-sm font-medium">{{ currentLocale.toUpperCase() }}</span>
    </button>
    
    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        class="absolute right-0 mt-2 w-40 rounded-lg shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-10"
      >
        <div class="py-1">
          <button
            v-for="lang in languages"
            :key="lang.code"
            type="button"
            class="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
            :class="{ 'bg-gray-100 dark:bg-gray-700': currentLocale === lang.code }"
            @click="changeLanguage(lang.code)"
          >
            {{ lang.name }}
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/user'

const { locale } = useI18n()
const userStore = useUserStore()
const isOpen = ref(false)

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'ru', name: 'Русский' },
]

const currentLocale = computed(() => locale.value)

const changeLanguage = (lang: string) => {
  locale.value = lang
  localStorage.setItem('locale', lang)
  userStore.updateSettings({ preferredLanguage: lang as 'en' | 'es' | 'ru' })
  isOpen.value = false
}
</script>
