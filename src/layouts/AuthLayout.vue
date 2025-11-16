<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl mb-4">
          <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Salon Calendar</h1>
      </div>
      
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <router-view />
      </div>
      
      <div class="mt-4 text-center">
        <div class="flex items-center justify-center gap-4">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ThemeToggle from '@/components/base/layoutPieces/ThemeToggle.vue'
import LanguageSwitcher from '@/components/base/layoutPieces/LanguageSwitcher.vue'
</script>
