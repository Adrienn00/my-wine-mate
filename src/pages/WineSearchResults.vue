<template>
  <div>
    <!-- RENDEZÉS -->
    <div v-if="results.length" class="flex justify-end mb-4">
      <select v-model="sort" class="bg-gray-800 border border-gray-700 px-3 py-1 rounded text-sm">
        <option value="">Rendezés</option>
        <option value="name">Név (A-Z)</option>
        <option value="priceAsc">Ár növekvő</option>
        <option value="priceDesc">Ár csökkenő</option>
        <option value="ratingDesc">Legjobb értékelés</option>
      </select>
    </div>

    <!-- LOADING -->
    <div v-if="loading" class="text-sm text-gray-400 mb-4 animate-pulse">Betöltés...</div>

    <!-- TALÁLATOK -->
    <div v-else-if="sortedResults.length" class="space-y-2">
      <div
        v-for="wine in sortedResults"
        :key="wine._id"
        class="px-4 py-2 border-b border-gray-700 last:border-b-0 hover:bg-gray-700 cursor-pointer transition-colors"
        @click="emitSelect(wine._id)"
      >
        {{ wine.name }}
      </div>
    </div>

    <!-- NINCS TALÁLAT -->
    <p v-else-if="showEmptyState" class="text-sm text-gray-400 mb-4">Nincs találat.</p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
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

const sort = ref('')

function emitSelect(wineId) {
  emit('select-wine', wineId)
}

const sortedResults = computed(() => {
  let list = [...props.results]

  const priceOrder = {
    '0-20': 1,
    '20-50': 2,
    '50-80': 3,
    '80-130': 4,
    '>130': 5,
  }

  if (sort.value === 'name') {
    list.sort((a, b) => a.name.localeCompare(b.name))
  }

  if (sort.value === 'priceAsc') {
    list.sort((a, b) => priceOrder[a.priceRange] - priceOrder[b.priceRange])
  }

  if (sort.value === 'priceDesc') {
    list.sort((a, b) => priceOrder[b.priceRange] - priceOrder[a.priceRange])
  }

  if (sort.value === 'ratingDesc') {
    list.sort((a, b) => {
      const ratingA = a.ratings?.length
        ? a.ratings.reduce((s, r) => s + (Number(r.rating) || 0), 0) / a.ratings.length
        : 0

      const ratingB = b.ratings?.length
        ? b.ratings.reduce((s, r) => s + (Number(r.rating) || 0), 0) / b.ratings.length
        : 0

      return ratingB - ratingA
    })
  }

  return list
})
</script>
