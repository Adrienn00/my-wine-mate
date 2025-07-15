<template>
  <NavBar />
  <div class="min-h-screen bg">
    <div class="flex items-center justify-center max-w-6xl mx-auto px-4 py-12">
      <div class="flex flex-col gap-y-5 w-1/2">
        <div class="text-center px-6 py-16">
          <h1 class="text-3xl md:text-5xl font-light mb-6 leading-snug text-yellow-100">
            Találd meg a hozzád illő bort
          </h1>
          <input
            v-model="query"
            type="text"
            placeholder="Bor neve..."
            class="w-full px-4 py-2 border rounded bg-gray-900 text-white border-gray-700 focus:outline-none focus:ring focus:border-yellow-300 mb-6"
          />
          <div class="flex flex-wrap justify-center gap-4 my-6">
            <select
              v-model="selectedType"
              class="bg-gray-900 border border-gray-700 px-4 py-2 rounded"
            >
              <option value="">Szőlőfajta</option>
              <option>Vörös</option>
              <option>Fehér</option>
              <option>Rozé</option>
            </select>

            <select
              v-model="selectedStyle"
              class="bg-gray-900 border border-gray-700 px-4 py-2 rounded"
            >
              <option value="">Stílus</option>
              <option>Száraz</option>
              <option>Félszáraz</option>
              <option>Édes</option>
              <option>Félédes</option>
            </select>

            <select
              v-model="selectedPrice"
              class="bg-gray-900 border border-gray-700 px-4 py-2 rounded"
            >
              <option value="">Ár</option>
              <option>20-50</option>
              <option>50-80</option>
              <option>80-130</option>
              <option>>130</option>
            </select>

            <select
              v-model="selectedFlavor"
              class="bg-gray-900 border border-gray-700 px-4 py-2 rounded"
            >
              <option value="">Ízvilág</option>
              <option>Gyümölcsös</option>
              <option>Fűszeres</option>
              <option>Virágos</option>
              <option>Földes</option>
              <option>Egyéb</option>
            </select>
          </div>

          <div class="flex justify-center gap-4 mb-6">
            <BaseButton variant="secondary" @click="searchWines">Keresés</BaseButton>
            <BaseButton variant="secondary">Fotó alapján keresek</BaseButton>
            <BaseButton to="/addWine" variant="secondary">Új bor hozzáadása</BaseButton>
          </div>
          <div v-if="results.length" class="space-y-2">
            <div
              v-for="wine in results"
              :key="wine.name"
              class="px-4 py-2 border-b border-gray-700 last:border-b-0 hover:bg-gray-700 cursor-pointer"
              @click="goToDetails(wine.name)"
            >
              {{ wine.name }}
            </div>
          </div>
          <p
            v-else-if="hasSearched && hasAnyFilter && results.length === 0"
            class="text-sm text-gray-400 mb-4"
          >
            Nincs találat.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useWinesStore } from '../stores/winesStore'
import { useRouter } from 'vue-router'
import NavBar from '../components/NavBar.vue'
import BaseButton from '../components/BaseButton.vue'

const winesStore = useWinesStore()
const router = useRouter()
const query = ref('')
const selectedType = ref('')
const selectedStyle = ref('')
const selectedPrice = ref('')
const selectedFlavor = ref('')
const results = ref([])
const hasSearched = ref(false)

const hasAnyFilter = computed(() => {
  return (
    query.value ||
    selectedType.value ||
    selectedStyle.value ||
    selectedPrice.value ||
    selectedFlavor.value
  )
})

const searchWines = () => {
  hasSearched.value = true
  const wines = winesStore.getAllWines

  results.value = wines.filter((wine) => {
    const matchesName = query.value
      ? wine.name.toLowerCase().includes(query.value.toLowerCase())
      : true
    const matchesType = selectedType.value ? wine.type === selectedType.value : true
    const matchesStyle = selectedStyle.value ? wine.style === selectedStyle.value : true
    const matchesPrice = selectedPrice.value ? wine.price === selectedPrice.value : true
    const matchesFlavor = selectedFlavor.value ? wine.flavor === selectedFlavor.value : true

    return matchesName && matchesType && matchesStyle && matchesPrice && matchesFlavor
  })
}

const goToDetails = (wineName) => {
  router.push({ name: 'wine-details', params: { name: wineName } })
}
</script>

<style scoped>
.bg {
  background-image: url('/home/adrienn/www/my-wine-mate/src/assets/images/bg.jpg');
  background-size: cover;
}
</style>
