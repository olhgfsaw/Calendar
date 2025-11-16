import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUiStore = defineStore('ui', () => {
  const sidebarCollapsed = ref(false)
  const mobileSidebarOpen = ref(false)
  const theme = ref<'light' | 'dark' | 'auto'>('auto')
  const locale = ref('en')

  const modals = ref<Record<string, boolean>>({})

  const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value
    localStorage.setItem('sidebarCollapsed', sidebarCollapsed.value.toString())
  }

  const toggleMobileSidebar = () => {
    mobileSidebarOpen.value = !mobileSidebarOpen.value
  }

  const setTheme = (newTheme: 'light' | 'dark' | 'auto') => {
    theme.value = newTheme
    localStorage.setItem('theme', newTheme)
  }

  const setLocale = (newLocale: string) => {
    locale.value = newLocale
    localStorage.setItem('locale', newLocale)
  }

  const openModal = (modalId: string) => {
    modals.value[modalId] = true
  }

  const closeModal = (modalId: string) => {
    modals.value[modalId] = false
  }

  const toggleModal = (modalId: string) => {
    modals.value[modalId] = !modals.value[modalId]
  }

  const initializeUI = () => {
    const savedCollapsed = localStorage.getItem('sidebarCollapsed')
    if (savedCollapsed) {
      sidebarCollapsed.value = savedCollapsed === 'true'
    }

    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'auto' | null
    if (savedTheme) {
      theme.value = savedTheme
    }

    const savedLocale = localStorage.getItem('locale')
    if (savedLocale) {
      locale.value = savedLocale
    }
  }

  return {
    sidebarCollapsed,
    mobileSidebarOpen,
    theme,
    locale,
    modals,
    toggleSidebar,
    toggleMobileSidebar,
    setTheme,
    setLocale,
    openModal,
    closeModal,
    toggleModal,
    initializeUI,
  }
})
