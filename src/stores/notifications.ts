import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Notification } from '@/types'

export const useNotificationsStore = defineStore('notifications', () => {
  const notifications = ref<Notification[]>([])
  const toasts = ref<Array<{ id: string; type: string; message: string }>>([])

  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      read: false,
      createdAt: new Date(),
    }
    notifications.value.unshift(newNotification)
  }

  const markAsRead = (id: string) => {
    const notification = notifications.value.find((n) => n.id === id)
    if (notification) {
      notification.read = true
    }
  }

  const markAllAsRead = () => {
    notifications.value.forEach((notification) => {
      notification.read = true
    })
  }

  const removeNotification = (id: string) => {
    const index = notifications.value.findIndex((n) => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  const showToast = (type: 'success' | 'error' | 'warning' | 'info', message: string) => {
    const id = Date.now().toString()
    toasts.value.push({ id, type, message })

    setTimeout(() => {
      const index = toasts.value.findIndex((t) => t.id === id)
      if (index > -1) {
        toasts.value.splice(index, 1)
      }
    }, 5000)
  }

  const removeToast = (id: string) => {
    const index = toasts.value.findIndex((t) => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  return {
    notifications,
    toasts,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    showToast,
    removeToast,
  }
})
