<template>
  <div>
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">{{ $t('auth.login') }}</h2>
    
    <form @submit.prevent="handleLogin" class="space-y-4">
      <BaseInput
        v-model="email"
        type="email"
        :label="$t('auth.email')"
        :placeholder="$t('auth.email')"
        :error="errors.email"
        required
      />
      
      <BaseInput
        v-model="password"
        type="password"
        :label="$t('auth.password')"
        :placeholder="$t('auth.password')"
        :error="errors.password"
        required
      />
      
      <div class="flex items-center justify-between">
        <router-link to="/forgot-password" class="text-sm text-primary-600 hover:text-primary-500">
          {{ $t('auth.forgotPassword') }}
        </router-link>
      </div>
      
      <PrimaryButton
        type="submit"
        :loading="authStore.loading"
        :disabled="authStore.loading"
        full-width
      >
        {{ $t('auth.login') }}
      </PrimaryButton>
      
      <p class="text-center text-sm text-gray-600 dark:text-gray-400">
        {{ $t('auth.dontHaveAccount') }}
        <router-link to="/join" class="text-primary-600 hover:text-primary-500 font-medium">
          {{ $t('auth.createAccount') }}
        </router-link>
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useNotificationsStore } from '@/stores/notifications'
import BaseInput from '@/components/base/forms/BaseInput.vue'
import PrimaryButton from '@/components/base/buttons/PrimaryButton.vue'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const authStore = useAuthStore()
const notificationsStore = useNotificationsStore()
const { t } = useI18n()

const email = ref('')
const password = ref('')
const errors = ref<{ email?: string; password?: string }>({})

const handleLogin = async () => {
  errors.value = {}
  
  if (!email.value) {
    errors.value.email = t('validation.email.required')
    return
  }
  
  if (!password.value) {
    errors.value.password = t('validation.password.required')
    return
  }
  
  const success = await authStore.login(email.value, password.value)
  
  if (success) {
    notificationsStore.showToast('success', t('auth.loginSuccess'))
    router.push('/calendar')
  } else {
    notificationsStore.showToast('error', authStore.error || 'Login failed')
  }
}
</script>
