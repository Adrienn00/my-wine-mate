<template>
  <PageFrame max-width="max-w-6xl">
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

const router = useRouter()
const winesStore = useWinesStore()

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
