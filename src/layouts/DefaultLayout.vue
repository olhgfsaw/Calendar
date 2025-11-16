<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="flex h-screen overflow-hidden">
      <aside
        :class="[
          'hidden md:flex md:flex-col bg-white dark:bg-gray-800 border-r dark:border-gray-700 transition-all duration-300',
          uiStore.sidebarCollapsed ? 'w-16' : 'w-64',
        ]"
      >
        <div class="p-4">
          <Logo :collapsed="uiStore.sidebarCollapsed" />
        </div>
        <nav class="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          <router-link
            v-for="item in navigation"
            :key="item.path"
            :to="item.path"
            class="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors"
            active-class="bg-primary-50 text-primary-700 dark:bg-primary-900 dark:text-primary-100"
            inactive-class="text-gray-700 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700"
          >
            <component :is="item.icon" class="w-5 h-5 flex-shrink-0" />
            <span v-if="!uiStore.sidebarCollapsed">{{ $t(item.label) }}</span>
          </router-link>
        </nav>
      </aside>

      <div class="flex-1 flex flex-col overflow-hidden">
        <header class="bg-white dark:bg-gray-800 border-b dark:border-gray-700 px-4 py-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <button
                class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                @click="uiStore.toggleSidebar"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </button>
            </div>
            
            <div class="flex items-center gap-2">
              <LanguageSwitcher />
              <ThemeToggle />
              <NotificationBell />
              <Avatar
                v-if="authStore.currentUser"
                :src="authStore.currentUser.photoURL"
                :name="authStore.currentUser.displayName"
                size="md"
              />
              <button
                v-if="authStore.isAuthenticated"
                class="px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg"
                @click="logout"
              >
                {{ $t('nav.logout') }}
              </button>
            </div>
          </div>
        </header>

        <main class="flex-1 overflow-auto p-6">
          <router-view />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'
import Logo from '@/components/base/layoutPieces/Logo.vue'
import ThemeToggle from '@/components/base/layoutPieces/ThemeToggle.vue'
import LanguageSwitcher from '@/components/base/layoutPieces/LanguageSwitcher.vue'
import NotificationBell from '@/components/base/layoutPieces/NotificationBell.vue'
import Avatar from '@/components/base/layoutPieces/Avatar.vue'
import { useRouter } from 'vue-router'
import { 
  CalendarDaysIcon, 
  UsersIcon, 
  BuildingStorefrontIcon, 
  UserGroupIcon 
} from '@heroicons/vue/24/outline'

const authStore = useAuthStore()
const uiStore = useUiStore()
const router = useRouter()

const navigation = [
  { path: '/calendar', label: 'nav.calendar', icon: CalendarDaysIcon },
  { path: '/masters', label: 'nav.masters', icon: UsersIcon },
  { path: '/salons', label: 'nav.salons', icon: BuildingStorefrontIcon },
  { path: '/clients', label: 'nav.clients', icon: UserGroupIcon },
]

const logout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>
