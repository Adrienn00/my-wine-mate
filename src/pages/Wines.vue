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
  const q = query?.toLowerCase() || ''

  searchResults.value = winesStore.confirmedWines.filter((wine) => {
    if (
      q &&
      !wine.name?.toLowerCase().includes(q) &&
      !wine.winery?.toLowerCase().includes(q) &&
      !wine.origin?.region?.toLowerCase().includes(q) &&
      !wine.origin?.country?.toLowerCase().includes(q)
    ) {
      return false
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
