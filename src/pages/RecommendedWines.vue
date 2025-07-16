<template>
  <div class="min-h-screen bg">
    <div class="p-6">
      <h2 class="text-2xl font-semibold text-yellow-100 mb-6 text-center">
        Ajánlott borok számodra
      </h2>

      <div
        v-if="recommendedWines.length"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <div
          v-for="(wine, index) in recommendedWines"
          :key="index"
          class="bg-gray-800 text-white p-4 rounded-lg shadow-md border border-gray-400"
        >
          <h3 class="text-xl font-bold mb-1">{{ wine.name }}</h3>
          <p><span class="font-medium">Stílus:</span> {{ wine.style }}</p>
          <p><span class="font-medium">Szőlőfajta:</span> {{ wine.type }}</p>
          <p><span class="font-medium">Ízprofil:</span> {{ wine.flavor }}</p>
          <p><span class="font-medium">Ár:</span>{{ wine.price }}</p>
        </div>
      </div>

      <div v-else class="text-white text-center mt-4">
        <p>Nincs elérhető ajánlás a megadott preferenciák alapján.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const wines = [
  {
    name: 'Cabernet Sauvignon',
    type: 'Vörös',
    style: 'Száraz',
    price: '80-130',
    flavor: 'Fűszeres',
  },
  {
    name: 'Chardonnay',
    type: 'Fehér',
    style: 'Félszáraz',
    price: '50-80',
    flavor: 'Gyümölcsös',
  },
  {
    name: 'Tokaji Aszú',
    type: 'Fehér',
    style: 'Édes',
    price: '>130',
    flavor: 'Egyéb',
  },
  {
    name: 'Kékfrankos Rosé',
    type: 'Rozé',
    style: 'Száraz',
    price: '20-50',
    flavor: 'Virágos',
  },
  {
    name: 'Merlot',
    type: 'Vörös',
    style: 'Félédes',
    price: '50-80',
    flavor: 'Földes',
  },
]

const userPreferences = {
  type: 'Fehér',
  style: 'Félszáraz',
  flavor: 'Gyümölcsös',
}
const recommendedWines = computed(() => {
  return wines.filter((wine) => {
    const matchesStyle = wine.style === userPreferences.style
    const matchesGrape = wine.grape === userPreferences.grape
    const matchesFlavor = wine.flavor === userPreferences.flavor
    return matchesStyle && matchesGrape && matchesFlavor
  })
})
</script>
<style scoped>
.bg {
  background-image: url('/home/adrienn/www/my-wine-mate/src/assets/images/bg.jpg');
  background-size: cover;
}
</style>
