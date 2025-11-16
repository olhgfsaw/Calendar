<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
    <div v-if="loading" class="p-8 text-center text-gray-500">
      {{ t('common.loading') }}
    </div>

    <div v-else-if="paginatedData.length === 0" class="p-8 text-center text-gray-500">
      {{ emptyMessage || t('common.noData') }}
    </div>

    <div v-else>
      <div v-if="viewMode === 'table'" class="overflow-x-auto">
        <div class="min-w-full">
          <div class="grid bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700" :style="gridTemplateColumns">
            <div
              v-for="column in columns"
              :key="column.key"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              :class="{ 'text-right': column.align === 'right' }"
              @click="column.sortable !== false && handleSort(column.key)"
            >
              <div class="flex items-center gap-2" :class="{ 'justify-end': column.align === 'right' }">
                <span>{{ column.label }}</span>
                <div v-if="column.sortable !== false" class="flex flex-col">
                  <svg
                    class="w-3 h-3 -mb-1"
                    :class="sortKey === column.key && sortOrder === 'asc' ? 'text-blue-600' : 'text-gray-400'"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L10 6.414l-3.293 3.293a1 1 0 01-1.414 0z" />
                  </svg>
                  <svg
                    class="w-3 h-3"
                    :class="sortKey === column.key && sortOrder === 'desc' ? 'text-blue-600' : 'text-gray-400'"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L10 13.586l3.293-3.293a1 1 0 011.414 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div class="divide-y divide-gray-200 dark:divide-gray-700">
            <div
              v-for="(item, index) in paginatedData"
              :key="item[rowKey] || index"
              class="grid hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
              :class="{ 'cursor-pointer': clickable }"
              :style="gridTemplateColumns"
              @click="clickable && handleRowClick(item)"
            >
              <div
                v-for="column in columns"
                :key="column.key"
                class="px-6 py-4"
                :class="{ 'text-right': column.align === 'right' }"
              >
                <slot :name="`cell-${column.key}`" :item="item" :value="item[column.key]">
                  <span class="text-sm text-gray-900 dark:text-gray-100">
                    {{ item[column.key] }}
                  </span>
                </slot>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="viewMode === 'grid'" class="grid gap-6 p-6" :class="gridClass">
        <slot name="grid-item" v-for="(item, index) in paginatedData" :key="item[rowKey] || index" :item="item">
          <div class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            {{ item }}
          </div>
        </slot>
      </div>

      <div v-if="totalPages > 1" class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div class="text-sm text-gray-600 dark:text-gray-400">
          {{ t('pagination.showing') }}
          <span class="font-medium">{{ startIndex + 1 }}</span>
          {{ t('pagination.to') }}
          <span class="font-medium">{{ endIndex }}</span>
          {{ t('pagination.of') }}
          <span class="font-medium">{{ sortedData.length }}</span>
          {{ t('pagination.results') }}
        </div>

        <div class="flex items-center gap-2">
          <button
            :disabled="currentPage === 1"
            class="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            @click="goToPage(currentPage - 1)"
          >
            {{ t('pagination.previous') }}
          </button>

          <div class="flex gap-1">
            <button
              v-for="page in visiblePages"
              :key="page"
              class="px-3 py-1 text-sm border rounded-md transition-colors"
              :class="
                page === currentPage
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
              "
              @click="goToPage(page)"
            >
              {{ page }}
            </button>
          </div>

          <button
            :disabled="currentPage === totalPages"
            class="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            @click="goToPage(currentPage + 1)"
          >
            {{ t('pagination.next') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'

interface Column {
  key: string
  label: string
  sortable?: boolean
  align?: 'left' | 'right'
  width?: string
}

interface Props {
  columns: Column[]
  data: any[]
  loading?: boolean
  emptyMessage?: string
  rowKey?: string
  clickable?: boolean
  pageSize?: number
  viewMode?: 'table' | 'grid'
  gridClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  rowKey: 'id',
  clickable: true,
  pageSize: 10,
  viewMode: 'table',
  gridClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
})

const emit = defineEmits<{
  rowClick: [item: any]
}>()

const { t } = useI18n()

const sortKey = ref<string>('')
const sortOrder = ref<'asc' | 'desc'>('asc')
const currentPageInput = ref(1)

const gridTemplateColumns = computed(() => {
  if (props.columns.length === 0) return 'grid-template-columns: 1fr'
  
  const widths = props.columns.map(col => col.width || '1fr').join(' ')
  return `grid-template-columns: ${widths}`
})

const sortedData = computed(() => {
  if (!sortKey.value) return props.data

  return [...props.data].sort((a, b) => {
    const aVal = a[sortKey.value]
    const bVal = b[sortKey.value]

    if (aVal == null && bVal == null) return 0
    if (aVal == null) return 1
    if (bVal == null) return -1

    let comparison = 0
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      comparison = aVal.localeCompare(bVal, undefined, { sensitivity: 'base' })
    } else {
      if (aVal > bVal) comparison = 1
      if (aVal < bVal) comparison = -1
    }

    return sortOrder.value === 'asc' ? comparison : -comparison
  })
})

const totalPages = computed(() => Math.ceil(sortedData.value.length / props.pageSize))

const currentPage = computed(() => {
  if (totalPages.value === 0) return 1
  if (currentPageInput.value > totalPages.value) return totalPages.value
  if (currentPageInput.value < 1) return 1
  return currentPageInput.value
})

const startIndex = computed(() => (currentPage.value - 1) * props.pageSize)
const endIndex = computed(() => Math.min(startIndex.value + props.pageSize, sortedData.value.length))

const paginatedData = computed(() => {
  return sortedData.value.slice(startIndex.value, endIndex.value)
})

const visiblePages = computed(() => {
  const pages: number[] = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)

  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

const handleSort = (key: string) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
  currentPageInput.value = 1
}

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPageInput.value = page
  }
}

const handleRowClick = (item: any) => {
  emit('rowClick', item)
}
</script>
