<template>
  <div class="min-h-screen px-4 py-8 md:px-8 md:py-12">
    <div class="mx-auto max-w-6xl space-y-8">
      <div class="space-y-3">
        <transition name="fold-search">
          <div v-if="showSearchPanel">
            <WineSearchForm :filter-options="filterOptions" @search="handleSearch" />
          </div>
        </transition>

        <section
          v-if="searchHistory.length"
          class="glass-panel rounded-2xl border border-[var(--line)]"
        >
          <button
            class="history-toggle-btn"
            :aria-expanded="isHistoryOpen"
            @click="isHistoryOpen = !isHistoryOpen"
          >
            <span class="text-base font-semibold md:text-lg">
              Keresési előzmények ({{ searchHistory.length }})
            </span>
            <span class="history-chevron">{{ isHistoryOpen ? '▴' : '▾' }}</span>
          </button>

          <div v-if="isHistoryOpen" class="border-t border-[var(--line)] p-4 md:p-5">
            <div class="mb-3 flex items-center justify-end gap-4">
              <button class="history-clear-btn" @click="removeSearchHistory">
                Előzmények törlése
              </button>
            </div>

            <div class="space-y-2">
              <div
                v-for="entry in searchHistory"
                :key="entry.id"
                class="flex items-center justify-between gap-2 rounded-xl border border-[var(--line)] bg-[rgba(255,251,246,0.94)] p-2"
              >
                <button class="history-item-btn" @click="repeatSearch(entry.filters)">
                  {{ formatSearchLabel(entry.filters) }}
                </button>
                <button
                  class="history-item-delete-btn"
                  title="Előzmény törlése"
                  @click.stop="removeSingleHistoryEntry(entry.id)"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        </section>

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
import {
  addSearchHistoryEntry,
  clearSearchHistory,
  getSearchHistory,
  removeSearchHistoryEntry,
} from '../services/searchHistory'

const winesStore = useWinesStore()
const router = useRouter()

const results = ref([])
const hasSearched = ref(false)
const hasAnyFilter = ref(false)
const resultsSection = ref(null)
const showSearchPanel = ref(true)
const searchHistory = ref([])
const isHistoryOpen = ref(false)

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
  searchHistory.value = getSearchHistory()
})

async function handleSearch(filters) {
  hasSearched.value = true
  hasAnyFilter.value = Object.values(filters).some((val) => val !== '')
  searchHistory.value = addSearchHistoryEntry(filters)

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

function repeatSearch(filters) {
  handleSearch(filters)
}

function removeSearchHistory() {
  clearSearchHistory()
  searchHistory.value = []
  isHistoryOpen.value = false
}

function removeSingleHistoryEntry(entryId) {
  searchHistory.value = removeSearchHistoryEntry(entryId)
  if (!searchHistory.value.length) {
    isHistoryOpen.value = false
  }
}

function formatSearchLabel(filters) {
  const labels = []
  if (filters.query) labels.push(`"${filters.query}"`)
  if (filters.type) labels.push(filters.type)
  if (filters.style) labels.push(filters.style)
  if (filters.price) labels.push(filters.price)
  if (filters.flavor) labels.push(filters.flavor)
  return labels.length ? labels.join(' • ') : 'Üres keresés'
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

.history-toggle-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  border: none;
  border-radius: 1rem;
  background: transparent;
  color: var(--text-main);
  padding: 0.9rem 1rem;
  cursor: pointer;
}

.history-toggle-btn:hover {
  background: rgba(237, 215, 212, 0.26);
}

.history-chevron {
  font-size: 1.1rem;
  color: var(--wine);
}

.history-item-btn {
  width: 100%;
  text-align: left;
  border-radius: 0.75rem;
  border: 1px solid transparent;
  background: transparent;
  color: var(--text-main);
  font-size: 0.78rem;
  font-weight: 600;
  padding: 0.4rem 0.55rem;
  transition: 0.18s ease;
}

.history-item-btn:hover {
  border-color: var(--accent);
  color: var(--wine);
  background: rgba(237, 215, 212, 0.44);
}

.history-clear-btn {
  border-radius: 999px;
  border: 1px solid var(--line);
  background: transparent;
  color: var(--text-muted);
  font-size: 0.73rem;
  font-weight: 600;
  padding: 0.3rem 0.6rem;
  transition: 0.16s ease;
}

.history-clear-btn:hover {
  color: var(--danger);
  border-color: rgba(192, 76, 93, 0.42);
}

.history-item-delete-btn {
  border-radius: 999px;
  border: 1px solid var(--line);
  background: rgba(255, 247, 244, 0.92);
  color: var(--text-muted);
  font-size: 0.75rem;
  font-weight: 700;
  width: 1.8rem;
  height: 1.8rem;
  cursor: pointer;
  transition: 0.16s ease;
}

.history-item-delete-btn:hover {
  color: var(--danger);
  border-color: rgba(192, 76, 93, 0.42);
}
</style>
