<template>
  <div>
    <!-- Sorting -->
    <div v-if="results.length" class="mb-4 flex justify-end">
      <select v-model="sort" class="result-select">
        <option value="">Sort</option>
        <option value="name">Name (A-Z)</option>
        <option value="priceAsc">Price: Low to High</option>
        <option value="priceDesc">Price: High to Low</option>
        <option value="ratingDesc">Top Rated</option>
      </select>
    </div>

    <!-- LOADING -->
    <div v-if="loading" class="mb-4 animate-pulse text-sm font-medium text-[var(--text-main)]">
      Loading...
    </div>

    <!-- Results -->
    <div v-else-if="paginatedResults.length" class="space-y-4">
      <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div
          v-for="(wine, index) in paginatedResults"
          :key="wine._id"
          class="anim-fade-up group cursor-pointer rounded-xl border border-[var(--line)] bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(107,45,62,0.4)] hover:shadow-[0_12px_32px_rgba(28,15,19,0.12)]"
          :style="{ animationDelay: `${index * 0.06}s` }"
          @click="emitSelect(wine._id)"
        >
          <div class="mb-3 overflow-hidden rounded-lg border border-[var(--line)]">
            <img
              :src="wineImageFor(wine)"
              :alt="`${wine.name} image`"
              class="h-36 w-full object-cover transition duration-500 group-hover:scale-[1.06]"
              loading="lazy"
            />
          </div>

          <div class="flex items-start justify-between gap-3">
            <div>
              <h3 class="text-lg font-semibold">{{ wine.name }}</h3>
              <p class="text-xs uppercase tracking-wide text-[var(--text-muted)]">
                {{ wine.type || 'Unknown type' }} • {{ wine.style || 'N/A' }}
              </p>
            </div>
            <div
              class="rounded-full border border-[var(--line)] bg-[var(--surface)] px-2 py-1 text-xs text-[var(--accent)]"
            >
              {{ wine.priceRange || 'N/A' }}
            </div>
          </div>

          <p class="mt-2 text-sm text-[var(--text-muted)]">
            {{ wine.description || 'Open the details page to view the full wine profile.' }}
          </p>
        </div>
      </div>

      <div v-if="totalPages > 1" class="flex items-center justify-between gap-4 pt-2">
        <button class="pager-btn" :disabled="currentPage === 1" @click="currentPage--">
          Previous
        </button>
        <p class="text-sm text-[var(--text-muted)]">{{ currentPage }} / {{ totalPages }} pages</p>
        <button class="pager-btn" :disabled="currentPage === totalPages" @click="currentPage++">
          Next
        </button>
      </div>
    </div>

    <!-- Empty state -->
    <p v-else-if="showEmptyState" class="mb-4 text-sm text-[var(--text-muted)]">No results found.</p>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { wineImageFor } from '../services/imageFallbacks'

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
const currentPage = ref(1)
const pageSize = 10

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
        ? a.ratings.reduce((s, r) => {
            const value = Number.isFinite(Number(r?.overall)) ? Number(r.overall) : Number(r?.rating)
            return s + (Number.isFinite(value) ? value : 0)
          }, 0) / a.ratings.length
        : 0

      const ratingB = b.ratings?.length
        ? b.ratings.reduce((s, r) => {
            const value = Number.isFinite(Number(r?.overall)) ? Number(r.overall) : Number(r?.rating)
            return s + (Number.isFinite(value) ? value : 0)
          }, 0) / b.ratings.length
        : 0

      return ratingB - ratingA
    })
  }

  return list
})

const totalPages = computed(() => Math.max(1, Math.ceil(sortedResults.value.length / pageSize)))

const paginatedResults = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return sortedResults.value.slice(start, start + pageSize)
})

watch([() => props.results, sort], () => {
  currentPage.value = 1
})

watch(totalPages, (nextTotal) => {
  if (currentPage.value > nextTotal) {
    currentPage.value = nextTotal
  }
})
</script>

<style scoped>
.result-select {
  border-radius: 0.65rem;
  border: 1px solid var(--line);
  background: var(--surface);
  color: var(--text-main);
  padding: 0.45rem 0.7rem;
  font-size: 0.875rem;
  outline: none;
}

.result-select:focus {
  border-color: var(--wine);
  box-shadow: 0 0 0 2px rgba(93, 31, 50, 0.12);
}

.pager-btn {
  border-radius: 0.65rem;
  border: 1px solid var(--line);
  background: var(--surface);
  color: var(--text-main);
  padding: 0.45rem 0.9rem;
  font-size: 0.875rem;
  font-weight: 600;
  transition: 0.2s ease;
}

.pager-btn:hover:enabled {
  border-color: var(--wine);
  color: var(--wine);
}

.pager-btn:disabled {
  cursor: not-allowed;
  opacity: 0.4;
}
</style>
