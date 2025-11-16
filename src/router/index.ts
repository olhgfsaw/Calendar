import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { checkPermission } from '@/services/permission'
import type { UserRole } from '@/types'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/LoginPage.vue'),
      meta: { layout: 'auth', requiresAuth: false },
    },
    {
      path: '/join',
      name: 'join',
      component: () => import('@/pages/JoinPage.vue'),
      meta: { layout: 'auth', requiresAuth: false },
    },
    {
      path: '/forgot-password',
      name: 'forgotPassword',
      component: () => import('@/pages/ForgotPasswordPage.vue'),
      meta: { layout: 'auth', requiresAuth: false },
    },
    {
      path: '/calendar',
      name: 'calendar',
      component: () => import('@/pages/CalendarPage.vue'),
      meta: { layout: 'default', requiresAuth: true, roles: ['admin', 'manager', 'master'] },
    },
    {
      path: '/forbidden',
      name: 'forbidden',
      component: () => import('@/pages/Forbidden.vue'),
      meta: { layout: 'none', requiresAuth: false },
    },
    {
      path: '/',
      redirect: '/calendar',
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'notFound',
      component: () => import('@/pages/NotFound.vue'),
      meta: { layout: 'none' },
    },
  ],
})

router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore()
  
  if (authStore.loading) {
    await authStore.initAuth()
  }
  
  const requiresAuth = to.meta.requiresAuth !== false
  
  if (requiresAuth && !authStore.isAuthenticated) {
    next('/login')
    return
  }
  
  if ((to.path === '/login' || to.path === '/join') && authStore.isAuthenticated) {
    next('/calendar')
    return
  }
  
  if (requiresAuth && to.meta.roles) {
    const allowedRoles = to.meta.roles as UserRole[]
    const userRole = authStore.userRole as UserRole
    
    if (!checkPermission(userRole, allowedRoles)) {
      next('/forbidden')
      return
    }
  }
  
  next()
})

export default router
