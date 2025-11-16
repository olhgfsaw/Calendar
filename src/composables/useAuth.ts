import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import type { UserRole } from '@/types'

export function useAuth() {
  const authStore = useAuthStore()
  const router = useRouter()

  const user = computed(() => authStore.currentUser)
  const isAuthenticated = computed(() => authStore.isAuthenticated)
  const userRole = computed(() => authStore.userRole)
  const loading = computed(() => authStore.loading)

  const hasRole = (roles: UserRole[]) => {
    if (!user.value) return false
    return roles.includes(user.value.role)
  }

  const login = async (email: string, password: string) => {
    const success = await authStore.login(email, password)
    if (success) {
      router.push('/')
    }
    return success
  }

  const register = async (email: string, password: string, displayName: string) => {
    const success = await authStore.register(email, password, displayName)
    if (success) {
      router.push('/')
    }
    return success
  }

  const logout = async () => {
    await authStore.logout()
    router.push('/login')
  }

  return {
    user,
    isAuthenticated,
    userRole,
    loading,
    hasRole,
    login,
    register,
    logout,
  }
}
