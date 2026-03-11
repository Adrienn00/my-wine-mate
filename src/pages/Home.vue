<template>
  <div class="min-h-screen bg">
    <div class="flex items-center justify-center max-w-6xl mx-auto px-4 py-12">
      <div class="flex flex-col gap-y-5 w-1/2">
        <div class="text-center px-6 py-16">
          <WineSearchForm @search="handleSearch" />

          <WineSearchResults
            :results="results"
            :loading="winesStore.loading"
            :show-empty-state="hasSearched && hasAnyFilter"
            @select-wine="goToDetails"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useWinesStore } from '../stores/winesStore'
import WineSearchForm from './WineSearchForm.vue'
import WineSearchResults from './WineSearchResults.vue'
const winesStore = useWinesStore()
const router = useRouter()

const results = ref([])
const hasSearched = ref(false)
const hasAnyFilter = ref(false)

async function handleSearch(filters) {
  hasSearched.value = true

  // Ellenőrizzük, hogy van-e egyáltalán aktív szűrő megadva
  hasAnyFilter.value = Object.values(filters).some((val) => val !== '')

  // Lekérjük az összes bort (vagy lehetne a store-on keresztül egy filteres lekérés is)
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
}

function goToDetails(wineId) {
  router.push({
    name: 'wine-details',
    params: { id: wineId },
    query: { from: 'home' },
  })
}
</script>

<style scoped>
.bg {
  /* Ügyelj az elérési útra, lehet érdemes alias-t (pl. @/assets/...) használni */
  background-image: url('/home/adrienn/www/my-wine-mate/src/assets/images/bg.jpg');
  background-size: cover;
}
</style>
