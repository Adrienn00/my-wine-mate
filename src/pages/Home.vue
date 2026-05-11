<template>
  <div class="page-shell">
    <div class="page-frame grid gap-5 xl:grid-cols-[290px_minmax(0,1fr)]">
      <aside class="dashboard-panel paper-grid h-fit rounded-[1.7rem] p-5 md:p-6">
        <div class="flex items-center gap-4">
          <div
            class="flex h-14 w-14 items-center justify-center rounded-full border border-[var(--line)] bg-white/85 text-lg font-semibold text-[var(--wine)]"
          >
            {{ profileInitials }}
          </div>
          <div>
            <p class="text-sm text-[var(--text-muted)]">Welcome back,</p>
            <h2 class="text-2xl font-semibold">{{ profileName }}</h2>
          </div>
        </div>

        <div class="dashboard-divider my-5"></div>

        <section>
          <p class="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--wine)]">
            My Wine Cellar
          </p>
          <div class="space-y-2">
            <BaseButton to="/recipes" variant="simpleRose">Saved Recipes</BaseButton>
            <BaseButton to="/favorite" variant="simpleRose">Favorite Wines</BaseButton>
            <BaseButton to="/recommended" variant="simpleRose">Past Pairings</BaseButton>
          </div>
        </section>

        <div class="dashboard-divider my-5"></div>

        <section>
          <p class="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--wine)]">
            Snapshot
          </p>
          <div class="grid gap-3">
            <div class="rounded-2xl border border-[var(--line)] bg-white/80 p-4">
              <p class="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">Wines</p>
              <p class="mt-2 text-3xl font-semibold">{{ confirmedWineCount }}</p>
            </div>
            <div class="rounded-2xl border border-[var(--line)] bg-white/80 p-4">
              <p class="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">Recipes</p>
              <p class="mt-2 text-3xl font-semibold">{{ confirmedRecipeCount }}</p>
            </div>
          </div>
        </section>

        <div class="dashboard-divider my-5"></div>

        <section class="rounded-[1.35rem] bg-[linear-gradient(180deg,#5d1f32_0%,#6e2c43_100%)] p-4 text-[#f9ead7] shadow-[0_18px_28px_rgba(93,31,50,0.26)]">
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-[#f4dcb6]">
            AI Sommelier
          </p>
          <p class="mt-3 text-sm leading-6 text-[#faefe3]">
            Tell me a wine, a mood, or a dish, and I’ll point you to the best pairing route.
          </p>
          <BaseButton to="/pairing-assistant" variant="navPrimary" class="mt-4 w-full">
            Open Assistant
          </BaseButton>
        </section>
      </aside>

      <div class="page-stack">
        <section class="dashboard-panel hero-sheen rounded-[1.7rem] p-5 md:p-7">
          <div class="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span class="section-kicker">Explore</span>
              <h1 class="section-title max-w-3xl">A richer wine-and-recipe experience across the whole app.</h1>
              <p class="section-summary mt-3">
                Elegant navigation, warmer tones, dashboard structure, and faster scanning inspired
                by the reference layout.
              </p>
            </div>
            <div class="flex flex-wrap gap-2">
              <span class="dashboard-chip dashboard-chip--active">Curated Search</span>
              <span class="dashboard-chip">Recipes</span>
              <span class="dashboard-chip">Pairing</span>
            </div>
          </div>

          <div class="mt-5 flex flex-wrap gap-3">
            <BaseButton to="/pairing-assistant">Open AI Pairing Assistant</BaseButton>
            <BaseButton to="/foodPairing" variant="secondary">Classic Pairing View</BaseButton>
          </div>
        </section>

        <div class="space-y-3">
          <transition name="fold-search">
            <div v-if="showSearchPanel">
              <WineSearchForm :filter-options="filterOptions" @search="handleSearch" />
            </div>
          </transition>

          <section
            v-if="searchHistory.length"
            class="dashboard-panel rounded-[1.45rem] border border-[var(--line)]"
          >
            <button
              class="history-toggle-btn"
              :aria-expanded="isHistoryOpen"
              @click="isHistoryOpen = !isHistoryOpen"
            >
              <span class="text-base font-semibold md:text-lg">
                Search History ({{ searchHistory.length }})
              </span>
              <span class="history-chevron">{{ isHistoryOpen ? '▴' : '▾' }}</span>
            </button>

            <div v-if="isHistoryOpen" class="border-t border-[var(--line)] p-4 md:p-5">
              <div class="mb-3 flex items-center justify-end gap-4">
                <button class="history-clear-btn" @click="removeSearchHistory">
                  Clear History
                </button>
              </div>

              <div class="space-y-2">
                <div
                  v-for="entry in searchHistory"
                  :key="entry.id"
                  class="flex items-center justify-between gap-2 rounded-xl border border-[var(--line)] bg-white/80 p-2"
                >
                  <button class="history-item-btn" @click="repeatSearch(entry.filters)">
                    {{ formatSearchLabel(entry.filters) }}
                  </button>
                  <button
                    class="history-item-delete-btn"
                    title="Delete history entry"
                    @click.stop="removeSingleHistoryEntry(entry.id)"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          </section>

          <div v-if="hasSearched && !showSearchPanel" class="flex justify-end">
            <button class="search-toggle-btn" @click="expandSearchPanel">Edit Filters</button>
          </div>
        </div>

        <section ref="resultsSection" class="dashboard-panel rounded-[1.65rem] p-5 md:p-7">
          <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p class="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">Wine List</p>
              <h2 class="text-2xl font-semibold md:text-3xl">Results</h2>
            </div>
            <span class="dashboard-chip">{{ results.length }} items</span>
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
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { useProfileStore } from '../stores/profileStore'
import { useRecipesStore } from '../stores/recipesStore'
import { useWinesStore } from '../stores/winesStore'
import BaseButton from '../components/ui/BaseButton.vue'
import WineSearchForm from './WineSearchForm.vue'
import WineSearchResults from './WineSearchResults.vue'
import {
  addSearchHistoryEntry,
  clearSearchHistory,
  getSearchHistory,
  removeSearchHistoryEntry,
} from '../services/searchHistory'

const winesStore = useWinesStore()
const recipesStore = useRecipesStore()
const authStore = useAuthStore()
const profileStore = useProfileStore()
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

const profileName = computed(() => profileStore.fullName || authStore.user?.firstName || 'Guest')
const profileInitials = computed(() => {
  const value = profileName.value.trim()
  if (!value) return 'G'
  return value
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('')
})
const confirmedWineCount = computed(() => winesStore.confirmedWines.length)
const confirmedRecipeCount = computed(() => recipesStore.confirmedRecipes.length)

onMounted(async () => {
  await Promise.all([
    winesStore.wines.length ? Promise.resolve() : winesStore.getAllWines(),
    recipesStore.recipes.length ? Promise.resolve() : recipesStore.getAllRecipes(),
    authStore.token ? profileStore.fetchProfile() : Promise.resolve(),
  ])
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
  return labels.length ? labels.join(' • ') : 'Empty search'
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
