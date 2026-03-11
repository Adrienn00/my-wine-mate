<template>
  <div>
    <div v-if="loading" class="text-sm text-gray-400 mb-4 animate-pulse">Betöltés...</div>

    <div v-else-if="results.length" class="space-y-2">
      <div
        v-for="wine in results"
        :key="wine._id"
        class="px-4 py-2 border-b border-gray-700 last:border-b-0 hover:bg-gray-700 cursor-pointer transition-colors"
        @click="emitSelect(wine._id)"
      >
        {{ wine.name }}
      </div>
    </div>

    <p v-else-if="showEmptyState" class="text-sm text-gray-400 mb-4">Nincs találat.</p>
  </div>
</template>

<script setup>
defineProps({
  results: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  showEmptyState: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['select-wine'])

function emitSelect(wineId) {
  emit('select-wine', wineId)
}
</script>
