<template>
  <div class="p-6">
    <h2 class="text-2xl font-semibold text-yellow-100 mb-6 text-center">Ajánlott borok számodra</h2>

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
</template>

<script setup>
import { computed, ref } from 'vue'
import { useWinesStore } from '../stores/winesStore'
import { useProfileStore } from '../stores/profileStore'
const profileStore = useProfileStore()
const winesStore = useWinesStore()

const recommendedWines = computed(() => {
  return winesStore.wines.filter((wine) => {
    const prefs = profileStore.selectedPreferences

    const matchesType = prefs.wineTypes.length === 0 || prefs.wineTypes.includes(wine.type)

    const matchesStyle =
      prefs.flavourProfile.length === 0 || prefs.flavourProfile.includes(wine.flavor)

    const matchesPrice =
      prefs.priceRange === '' || wine.price.includes(prefs.priceRange.replace(' Ron', ''))
    return matchesType && matchesStyle && matchesPrice
  })
})
</script>
<style scoped>
.bg {
  background-image: url('/home/adrienn/www/my-wine-mate/src/assets/images/bg.jpg');
  background-size: cover;
}
</style>
