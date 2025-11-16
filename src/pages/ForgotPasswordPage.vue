<template>
  <div>
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">{{ $t('auth.resetPassword') }}</h2>
    <p class="text-gray-600 dark:text-gray-400 mb-6">
      Enter your email address and we'll send you a link to reset your password.
    </p>
    
    <form @submit.prevent="handleReset" class="space-y-4">
      <BaseInput
        v-model="email"
        type="email"
        :label="$t('auth.email')"
        :placeholder="$t('auth.email')"
        :error="errors.email"
        required
      />
      
      <PrimaryButton
        type="submit"
        :loading="authStore.loading"
        :disabled="authStore.loading"
        full-width
      >
        {{ $t('auth.resetPassword') }}
      </PrimaryButton>
      
      <p class="text-center text-sm text-gray-600 dark:text-gray-400">
        <router-link to="/login" class="text-primary-600 hover:text-primary-500 font-medium">
          {{ $t('common.back') }} {{ $t('auth.login') }}
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
const errors = ref<{ email?: string }>({})

const handleReset = async () => {
  errors.value = {}
  
  if (!email.value) {
    errors.value.email = t('validation.email.required')
    return
  }
  
  const success = await authStore.resetPassword(email.value)
  
  if (success) {
    notificationsStore.showToast('success', t('auth.resetEmailSent'))
    router.push('/login')
  } else {
    notificationsStore.showToast('error', authStore.error || 'Reset failed')
  }
}
</script>
