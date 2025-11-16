<template>
  <router-link to="/" class="flex items-center gap-2">
    <div class="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
      <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
      </svg>
    </div>
    <span v-if="!collapsed" class="text-xl font-bold text-gray-900 dark:text-white">
      {{ $t('common.appName') || 'Salon Calendar' }}
    </span>
  </router-link>
</template>

<script setup lang="ts">
interface Props {
  collapsed?: boolean
}

withDefaults(defineProps<Props>(), {
  collapsed: false,
})
</script>
