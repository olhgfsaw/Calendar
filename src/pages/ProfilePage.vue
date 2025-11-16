<template>
  <div class="max-w-4xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        {{ t('profile.title') }}
      </h1>
      <p class="text-gray-600 dark:text-gray-300 mt-1">
        {{ t('profile.description') }}
      </p>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <form @submit="onSubmit" class="space-y-6">
        <div class="space-y-4">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white border-b dark:border-gray-700 pb-2">
            {{ t('profile.personalInfo') }}
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <BaseInput
              :model-value="values.displayName"
              @update:model-value="setFieldValue('displayName', $event)"
              :label="t('profile.displayName')"
              :error="errors.displayName"
              required
            />

            <BaseInput
              :model-value="values.email"
              @update:model-value="setFieldValue('email', $event)"
              :label="t('profile.email')"
              type="email"
              :error="errors.email"
              required
            />
          </div>

          <BaseInput
            :model-value="values.photoURL"
            @update:model-value="setFieldValue('photoURL', $event)"
            :label="t('profile.photoURL')"
            :error="errors.photoURL"
            :placeholder="t('profile.photoURLPlaceholder')"
          />
        </div>

        <div class="space-y-4">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white border-b dark:border-gray-700 pb-2">
            {{ t('profile.preferences') }}
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <BaseSelect
              :model-value="values.preferredLanguage"
              @update:model-value="setFieldValue('preferredLanguage', $event)"
              :label="t('profile.preferredLanguage')"
              :options="languageOptions"
              :error="errors.preferredLanguage"
            />

            <BaseSelect
              :model-value="values.theme"
              @update:model-value="setFieldValue('theme', $event)"
              :label="t('profile.theme')"
              :options="themeOptions"
              :error="errors.theme"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <BaseSelect
              :model-value="values.timezone"
              @update:model-value="setFieldValue('timezone', $event)"
              :label="t('profile.timezone')"
              :options="timezoneOptions"
              :error="errors.timezone"
            />

            <BaseSelect
              :model-value="values.timeFormat"
              @update:model-value="setFieldValue('timeFormat', $event)"
              :label="t('profile.timeFormat')"
              :options="timeFormatOptions"
              :error="errors.timeFormat"
            />
          </div>
        </div>

        <div class="space-y-4">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white border-b dark:border-gray-700 pb-2">
            {{ t('profile.notifications') }}
          </h2>

          <div class="space-y-3">
            <BaseSwitch
              :model-value="values.emailNotifications"
              @update:model-value="setFieldValue('emailNotifications', $event)"
              :label="t('profile.emailNotifications')"
            />

            <BaseSwitch
              :model-value="values.pushNotifications"
              @update:model-value="setFieldValue('pushNotifications', $event)"
              :label="t('profile.pushNotifications')"
            />
          </div>
        </div>

        <div class="flex gap-3 pt-4">
          <PrimaryButton
            type="submit"
            :loading="loading"
          >
            {{ t('common.save') }}
          </PrimaryButton>
          
          <button
            type="button"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            @click="handleCancel"
          >
            {{ t('common.cancel') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import * as yup from 'yup'
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/user'
import { useNotificationsStore } from '@/stores/notifications'
import BaseInput from '@/components/base/forms/BaseInput.vue'
import BaseSelect from '@/components/base/forms/BaseSelect.vue'
import BaseSwitch from '@/components/base/forms/BaseSwitch.vue'
import PrimaryButton from '@/components/base/buttons/PrimaryButton.vue'
import { updateDoc, doc } from 'firebase/firestore'
import { db } from '@/services/firebase'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()
const userStore = useUserStore()
const notificationsStore = useNotificationsStore()
const loading = ref(false)

const profileSchema = yup.object({
  displayName: yup.string().required(t('validation.displayName.required')),
  email: yup.string().email(t('validation.email.invalid')).required(t('validation.email.required')),
  photoURL: yup.string().url(t('validation.url.invalid')).nullable(),
  preferredLanguage: yup.string().oneOf(['en', 'es', 'ru']).required(),
  theme: yup.string().oneOf(['light', 'dark', 'auto']).required(),
  timezone: yup.string().required(),
  timeFormat: yup.string().oneOf(['12h', '24h']).required(),
  emailNotifications: yup.boolean().required(),
  pushNotifications: yup.boolean().required(),
})

const { values, errors, handleSubmit, resetForm, setFieldValue } = useForm({
  validationSchema: toTypedSchema(profileSchema),
  initialValues: {
    displayName: '',
    email: '',
    photoURL: '',
    preferredLanguage: 'en' as 'en' | 'es' | 'ru',
    theme: 'light' as 'light' | 'dark' | 'auto',
    timezone: 'UTC',
    timeFormat: '24h' as '12h' | '24h',
    emailNotifications: true,
    pushNotifications: false,
  },
})

watch(() => authStore.currentUser, (user) => {
  if (user) {
    resetForm({
      values: {
        displayName: user.displayName || '',
        email: user.email,
        photoURL: user.photoURL || '',
        preferredLanguage: userStore.settings.preferredLanguage,
        theme: userStore.settings.theme,
        timezone: userStore.settings.timezone,
        timeFormat: userStore.settings.timeFormat,
        emailNotifications: userStore.settings.emailNotifications,
        pushNotifications: userStore.settings.pushNotifications,
      }
    })
  }
}, { immediate: true })

const languageOptions = computed(() => [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'ru', label: 'Русский' },
])

const themeOptions = computed(() => [
  { value: 'light', label: t('profile.themeLight') },
  { value: 'dark', label: t('profile.themeDark') },
  { value: 'auto', label: t('profile.themeAuto') },
])

const timezoneOptions = computed(() => [
  { value: 'UTC', label: 'UTC' },
  { value: 'America/New_York', label: 'Eastern Time (US)' },
  { value: 'America/Chicago', label: 'Central Time (US)' },
  { value: 'America/Denver', label: 'Mountain Time (US)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (US)' },
  { value: 'Europe/London', label: 'London' },
  { value: 'Europe/Paris', label: 'Paris' },
  { value: 'Europe/Moscow', label: 'Moscow' },
  { value: 'Asia/Tokyo', label: 'Tokyo' },
  { value: 'Asia/Shanghai', label: 'Shanghai' },
])

const timeFormatOptions = computed(() => [
  { value: '12h', label: t('profile.timeFormat12h') },
  { value: '24h', label: t('profile.timeFormat24h') },
])

const onSubmit = handleSubmit(async (values) => {
  if (!authStore.currentUser) return
  
  loading.value = true
  
  try {
    await updateDoc(doc(db, 'users', authStore.currentUser.uid), {
      displayName: values.displayName,
      email: values.email,
      photoURL: values.photoURL || null,
      settings: {
        preferredLanguage: values.preferredLanguage,
        theme: values.theme,
        timezone: values.timezone,
        timeFormat: values.timeFormat,
        emailNotifications: values.emailNotifications,
        pushNotifications: values.pushNotifications,
      },
      updatedAt: new Date(),
    })

    await authStore.loadUserProfile(authStore.currentUser.uid)
    await userStore.loadUserSettings()

    if (values.preferredLanguage !== userStore.settings.preferredLanguage) {
      localStorage.setItem('locale', values.preferredLanguage)
      location.reload()
    }

    if (values.theme !== userStore.settings.theme) {
      localStorage.setItem('theme', values.theme)
      userStore.applyTheme(values.theme)
    }

    notificationsStore.addNotification({
      type: 'success',
      userId: authStore.currentUser.uid,
      title: t('profile.updateSuccess'),
      message: t('profile.updateSuccessMessage'),
    })

    router.push('/calendar')
  } catch (error) {
    console.error('Error updating profile:', error)
    notificationsStore.addNotification({
      type: 'error',
      userId: authStore.currentUser?.uid || '',
      title: t('profile.updateError'),
      message: t('profile.updateErrorMessage'),
    })
  } finally {
    loading.value = false
  }
})

const handleCancel = () => {
  router.push('/calendar')
}
</script>
