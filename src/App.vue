<template>
  <component :is="layout">
    <router-view />
  </component>
  
  <div
    v-if="notificationsStore.toasts.length > 0"
    class="fixed top-4 right-4 z-50 space-y-2"
  >
    <TransitionGroup
      enter-active-class="transition ease-out duration-200"
      enter-from-class="transform opacity-0 translate-x-full"
      enter-to-class="transform opacity-100 translate-x-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="transform opacity-100"
      leave-to-class="transform opacity-0"
    >
      <div
        v-for="toast in notificationsStore.toasts"
        :key="toast.id"
        :class="toastClasses(toast.type)"
        class="px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px]"
      >
        <div class="flex-1">
          <p class="text-sm font-medium">{{ toast.message }}</p>
        </div>
        <button
          @click="notificationsStore.removeToast(toast.id)"
          class="text-white hover:opacity-75"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'
import { useNotificationsStore } from '@/stores/notifications'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'

const route = useRoute()
const authStore = useAuthStore()
const uiStore = useUiStore()
const notificationsStore = useNotificationsStore()

const layout = computed(() => {
  const layoutName = route.meta.layout as string
  
  if (layoutName === 'auth') return AuthLayout
  if (layoutName === 'none') return 'div'
  return DefaultLayout
})

const toastClasses = (type: string) => {
  const classes = {
    success: 'bg-green-600 text-white',
    error: 'bg-red-600 text-white',
    warning: 'bg-yellow-600 text-white',
    info: 'bg-blue-600 text-white',
  }
  return classes[type as keyof typeof classes] || classes.info
}

onMounted(async () => {
  uiStore.initializeUI()
  await authStore.initAuth()
})
</script>
