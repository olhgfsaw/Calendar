<template>
  <div>
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">{{ $t('auth.register') }}</h2>
    
    <form @submit="onSubmit" class="space-y-4">
      <BaseInput
        v-model="displayName"
        type="text"
        :label="$t('common.name')"
        :placeholder="$t('common.name')"
        :error="errors.displayName"
        required
      />
      
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
      
      <BaseInput
        v-model="confirmPassword"
        type="password"
        :label="$t('auth.confirmPassword')"
        :placeholder="$t('auth.confirmPassword')"
        :error="errors.confirmPassword"
        required
      />
      
      <PrimaryButton
        type="submit"
        :loading="authStore.loading"
        :disabled="authStore.loading"
        full-width
      >
        {{ $t('auth.createAccount') }}
      </PrimaryButton>
      
      <p class="text-center text-sm text-gray-600 dark:text-gray-400">
        {{ $t('auth.alreadyHaveAccount') }}
        <router-link to="/login" class="text-primary-600 hover:text-primary-500 font-medium">
          {{ $t('auth.login') }}
        </router-link>
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useNotificationsStore } from '@/stores/notifications'
import BaseInput from '@/components/base/forms/BaseInput.vue'
import PrimaryButton from '@/components/base/buttons/PrimaryButton.vue'
import { useI18n } from 'vue-i18n'
import { useForm } from 'vee-validate'
import { emailValidator, passwordValidator, nameValidator } from '@/utils/validators'
import * as yup from 'yup'

const router = useRouter()
const authStore = useAuthStore()
const notificationsStore = useNotificationsStore()
const { t } = useI18n()

const validationSchema = yup.object({
  displayName: nameValidator,
  email: emailValidator,
  password: passwordValidator,
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], t('validation.password.match'))
    .required(t('validation.password.required')),
})

const { errors, defineField, handleSubmit } = useForm({
  validationSchema,
})

const [displayName] = defineField('displayName', { initialValue: '' })
const [email] = defineField('email', { initialValue: '' })
const [password] = defineField('password', { initialValue: '' })
const [confirmPassword] = defineField('confirmPassword', { initialValue: '' })

const onSubmit = handleSubmit(async (values) => {
  const success = await authStore.register(values.email, values.password, values.displayName)
  
  if (success) {
    notificationsStore.showToast('success', t('auth.registerSuccess'))
    router.push('/calendar')
  } else {
    notificationsStore.showToast('error', authStore.error || 'Registration failed')
  }
})
</script>
