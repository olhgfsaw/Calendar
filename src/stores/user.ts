import { defineStore } from 'pinia'
import { ref } from 'vue'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/services/firebase'
import type { UserSettings } from '@/types'
import { useAuthStore } from './auth'

export const useUserStore = defineStore('user', () => {
  const settings = ref<UserSettings>({
    preferredLanguage: 'en',
    theme: 'auto',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    timeFormat: '24h',
    emailNotifications: true,
    pushNotifications: true,
  })

  const loadSettings = async () => {
    const authStore = useAuthStore()
    if (!authStore.currentUser) return

    try {
      const userDoc = await getDoc(doc(db, 'users', authStore.currentUser.uid))
      if (userDoc.exists() && userDoc.data().settings) {
        settings.value = { ...settings.value, ...userDoc.data().settings }
      }

      if (settings.value.preferredLanguage) {
        localStorage.setItem('locale', settings.value.preferredLanguage)
      }

      if (settings.value.theme) {
        localStorage.setItem('theme', settings.value.theme)
        applyTheme(settings.value.theme)
      }
    } catch (error) {
      console.error('Error loading user settings:', error)
    }
  }

  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    const authStore = useAuthStore()
    if (!authStore.currentUser) return

    try {
      settings.value = { ...settings.value, ...newSettings }

      await updateDoc(doc(db, 'users', authStore.currentUser.uid), {
        settings: settings.value,
        updatedAt: new Date(),
      })

      if (newSettings.preferredLanguage) {
        localStorage.setItem('locale', newSettings.preferredLanguage)
      }

      if (newSettings.theme) {
        localStorage.setItem('theme', newSettings.theme)
        applyTheme(newSettings.theme)
      }

      return true
    } catch (error) {
      console.error('Error updating user settings:', error)
      return false
    }
  }

  const applyTheme = (theme: 'light' | 'dark' | 'auto') => {
    const root = document.documentElement

    if (theme === 'auto') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      root.classList.toggle('dark', isDark)
    } else {
      root.classList.toggle('dark', theme === 'dark')
    }
  }

  return {
    settings,
    loadSettings,
    updateSettings,
    applyTheme,
  }
})
