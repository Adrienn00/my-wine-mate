<template>
  <PageFrame max-width="max-w-6xl">
    <section class="anim-fade-up relative mb-6 overflow-hidden rounded-[1.8rem] p-6 text-white shadow-[0_24px_48px_rgba(93,31,50,0.2)] md:p-8">
      <img
        :src="HERO_IMAGES.wines"
        alt="Wine cellar"
        class="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
      />
      <div class="absolute inset-0 bg-[linear-gradient(105deg,rgba(38,21,20,0.82),rgba(93,31,50,0.62)_56%,rgba(199,163,103,0.25))]"></div>
      <div class="anim-float absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/15 blur-2xl"></div>

      <div class="relative max-w-3xl">
        <p class="text-xs font-semibold uppercase tracking-[0.24em] text-[#f4dcb6]">Wine Library</p>
        <h1 class="mt-3 text-4xl font-semibold leading-none md:text-5xl">
          Browse bottles with a little more atmosphere.
        </h1>
        <p class="mt-4 max-w-2xl text-sm leading-7 text-[#fff1e2] md:text-base">
          Search by style, flavor, origin, price range, or simply explore the cellar visually.
        </p>
        <div class="mt-5 flex flex-wrap gap-2">
          <span class="dashboard-chip !border-white/20 !bg-white/15 !text-white">
            {{ winesStore.confirmedWines.length }} wines
          </span>
          <span class="dashboard-chip !border-white/20 !bg-white/15 !text-white">
            AI pairing ready
          </span>
        </div>
      </div>
    </section>

    <WineSearchForm :filter-options="filterOptions" @search="handleSearch" />
    <WineSearchResults
      :results="searchResults"
      :loading="loading"
      :show-empty-state="searched"
      @select-wine="(id) => router.push(`/wine/${id}`)"
    />
  </PageFrame>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import PageFrame from '../components/ui/PageFrame.vue'
import WineSearchForm from './WineSearchForm.vue'
import WineSearchResults from './WineSearchResults.vue'
import { useWinesStore } from '../stores/winesStore'
import { useAuthStore } from '../stores/authStore'
import { HERO_IMAGES } from '../services/imageFallbacks'
import client from '../components/httpService/client'

const router = useRouter()
const winesStore = useWinesStore()
const authStore = useAuthStore()

const loading = ref(false)
const searched = ref(false)
const searchResults = ref([])
const activeFilters = ref(null)

const filterOptions = computed(() => {
  const wines = winesStore.confirmedWines
  return {
    types: [...new Set(wines.map((w) => w.type).filter(Boolean))],
    styles: [...new Set(wines.map((w) => w.style).filter(Boolean))],
    prices: [...new Set(wines.map((w) => w.priceRange).filter(Boolean))],
    flavors: [...new Set(wines.flatMap((w) => w.flavorProfiles || []).filter(Boolean))],
  }
})

function handleSearch(filters) {
  activeFilters.value = filters
  searched.value = true
  loading.value = true

  const { query, type, style, price, flavor } = filters
  const tokens = (query || '')
    .toLowerCase()
    .split(/[\s,]+/)
    .filter(Boolean)

  searchResults.value = winesStore.confirmedWines.filter((wine) => {
    if (tokens.length) {
      const haystack = [
        wine.name,
        wine.winery,
        wine.origin?.region,
        wine.origin?.country,
        String(wine.year ?? ''),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      if (!tokens.every((t) => haystack.includes(t))) return false
    }
    if (type && wine.type !== type) return false
    if (style && wine.style !== style) return false
    if (price && wine.priceRange !== price) return false
    if (flavor && !(wine.flavorProfiles || []).includes(flavor)) return false
    return true
  })

  loading.value = false

  if (authStore.token && (query || type || style || price || flavor)) {
    const searchType = type ? 'wine' : 'general'
    const searchQuery = [query, type, style, price, flavor].filter(Boolean).join(', ')
    client.post('users/search-history', { query: searchQuery, type: searchType }).catch(() => {})
  }
}

onMounted(async () => {
  if (!winesStore.wines.length) {
    loading.value = true
    await winesStore.getAllWines()
    loading.value = false
  }
  handleSearch({ query: '', type: '', style: '', price: '', flavor: '' })
})
</script>
