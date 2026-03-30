<template>
  <div class="min-h-screen px-4 py-8 md:px-8 md:py-12">
    <div class="mx-auto max-w-6xl space-y-8">
      <div class="space-y-3">
        <transition name="fold-search">
          <div v-if="showSearchPanel">
            <WineSearchForm :filter-options="filterOptions" @search="handleSearch" />
          </div>
        </transition>

        <div v-if="hasSearched && !showSearchPanel" class="flex justify-end">
          <button class="search-toggle-btn" @click="expandSearchPanel">Szűrők szerkesztése</button>
        </div>
      </div>

      <section ref="resultsSection" class="glass-panel rounded-2xl p-5 md:p-7">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-2xl font-semibold md:text-3xl">Találatok 🍇</h2>
          <span class="text-xs uppercase tracking-widest text-[var(--text-muted)]">
            {{ results.length }} db
          </span>
        </div>

        <WineSearchResults
          :results="results"
          :loading="winesStore.loading"
          :show-empty-state="hasSearched && hasAnyFilter"
          @select-wine="goToDetails"
        />
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useWinesStore } from '../stores/winesStore'
import WineSearchForm from './WineSearchForm.vue'
import WineSearchResults from './WineSearchResults.vue'

const winesStore = useWinesStore()
const router = useRouter()

const results = ref([])
const hasSearched = ref(false)
const hasAnyFilter = ref(false)
const resultsSection = ref(null)
const showSearchPanel = ref(true)

const uniqueValues = (array) => [...new Set(array.filter(Boolean))]

const filterOptions = computed(() => {
  const wines = winesStore.confirmedWines || []
  return {
    types: uniqueValues(wines.map((wine) => wine.type)),
    styles: uniqueValues(wines.map((wine) => wine.style)),
    prices: uniqueValues(wines.map((wine) => wine.priceRange)),
    flavors: uniqueValues(wines.flatMap((wine) => wine.flavorProfiles || [])),
  }
})

onMounted(async () => {
  if (!winesStore.wines.length) {
    await winesStore.getAllWines()
  }
})

async function handleSearch(filters) {
  hasSearched.value = true
  hasAnyFilter.value = Object.values(filters).some((val) => val !== '')

  const wines = await winesStore.getAllWines()

  results.value = wines.filter((wine) => {
    const isConfirmed = wine.is_confirmed === true
    const matchesName = filters.query
      ? wine.name.toLowerCase().includes(filters.query.toLowerCase())
      : true
    const matchesType = filters.type ? wine.type === filters.type : true
    const matchesStyle = filters.style ? wine.style === filters.style : true
    const matchesPrice = filters.price ? wine.priceRange === filters.price : true
    const matchesFlavor = filters.flavor ? wine.flavorProfiles.includes(filters.flavor) : true

    return (
      isConfirmed && matchesName && matchesType && matchesStyle && matchesPrice && matchesFlavor
    )
  })

  await nextTick()
  showSearchPanel.value = false
  resultsSection.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function goToDetails(wineId) {
  router.push({
    name: 'wine-details',
    params: { id: wineId },
    query: { from: 'home' },
  })
}

function expandSearchPanel() {
  showSearchPanel.value = true
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<style scoped>
.search-toggle-btn {
  border: 1px solid var(--line);
  border-radius: 999px;
  background: linear-gradient(135deg, var(--wine), var(--wine-soft));
  color: #fff7ef;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  padding: 0.45rem 0.95rem;
  transition: 0.2s ease;
  box-shadow: 0 10px 24px rgba(122, 32, 56, 0.24);
}

.search-toggle-btn:hover {
  border-color: var(--accent);
  transform: translateY(-1px);
}

.fold-search-enter-active,
.fold-search-leave-active {
  transition: all 0.35s ease;
}

.fold-search-enter-from,
.fold-search-leave-to {
  opacity: 0;
  transform: translateY(-12px) scale(0.98);
}
</style>
