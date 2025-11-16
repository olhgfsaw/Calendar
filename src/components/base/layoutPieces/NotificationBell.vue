<template>
  <div class="relative">
    <button
      type="button"
      class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 relative"
      @click="isOpen = !isOpen"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
      </svg>
      <span v-if="unreadCount > 0" class="absolute top-1 right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
        {{ unreadCount > 9 ? '9+' : unreadCount }}
      </span>
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
        class="absolute right-0 mt-2 w-80 rounded-lg shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-10"
      >
        <div class="p-4 border-b dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ $t('notifications.title') || 'Notifications' }}</h3>
        </div>
        <div class="max-h-96 overflow-y-auto">
          <div v-if="notificationsStore.notifications.length === 0" class="p-4 text-center text-gray-500 dark:text-gray-400">
            {{ $t('notifications.noNotifications') || 'No notifications' }}
          </div>
          <div
            v-for="notification in notificationsStore.notifications.slice(0, 5)"
            :key="notification.id"
            class="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 border-b dark:border-gray-700 last:border-b-0 cursor-pointer"
            :class="{ 'bg-blue-50 dark:bg-blue-900': !notification.read }"
            @click="markAsRead(notification.id)"
          >
            <p class="text-sm font-medium text-gray-900 dark:text-white">{{ notification.title }}</p>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ notification.message }}</p>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useNotificationsStore } from '@/stores/notifications'

const notificationsStore = useNotificationsStore()
const isOpen = ref(false)

const unreadCount = computed(() => {
  return notificationsStore.notifications.filter(n => !n.read).length
})

const markAsRead = (id: string) => {
  notificationsStore.markAsRead(id)
}
</script>
