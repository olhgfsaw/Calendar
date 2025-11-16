<template>
  <div :class="avatarClasses">
    <img v-if="src" :src="src" :alt="alt" class="h-full w-full rounded-full object-cover" />
    <span v-else class="text-white font-medium">{{ initials }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  src?: string
  alt?: string
  name?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
})

const initials = computed(() => {
  if (!props.name) return '?'
  const parts = props.name.split(' ')
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  }
  return props.name.slice(0, 2).toUpperCase()
})

const avatarClasses = computed(() => {
  const base = 'inline-flex items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-700'
  
  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
    xl: 'h-16 w-16 text-lg',
  }
  
  return `${base} ${sizes[props.size]}`
})
</script>
