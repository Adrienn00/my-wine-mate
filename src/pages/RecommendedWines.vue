```vue
<template>
  <div class="p-6">
    <h2 class="text-2xl font-semibold text-yellow-100 mb-6 text-center">Ajánlott borok számodra</h2>

    <div v-if="loading" class="text-white text-center mt-4">Betöltés...</div>

    <div
      v-else-if="recommendedWines.length"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <div
        v-for="wine in recommendedWines"
        :key="wine._id"
        class="relative bg-gray-800 text-white p-4 rounded-lg shadow-md border border-gray-400"
      >
        <div
          v-if="wine.matchPercent >= 80"
          class="absolute top-2 right-2 bg-yellow-400 text-black text-xs px-2 py-1 rounded font-semibold"
        >
          Best Match
        </div>

        <BaseButton :to="`/wine/${wine._id}?from=recommended`" variant="simple">
          {{ wine.name }}
        </BaseButton>

        <div class="mt-3 text-sm text-gray-300 space-y-1">
          <div>
            <span class="font-semibold">Match:</span>
            {{ wine.matchPercent }}%
          </div>

          <div>
            <span class="font-semibold">Típus:</span>
            {{ wine.type || '—' }}
          </div>

          <div>
            <span class="font-semibold">Stílus:</span>
            {{ wine.style || '—' }}
          </div>

          <div>
            <span class="font-semibold">Ízprofil:</span>
            {{ wine.flavorProfiles?.join(', ') || '—' }}
          </div>

          <div>
            <span class="font-semibold">Ár:</span>
            {{ wine.priceRange || '—' }}
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-white text-center mt-4">
      <p>Nincs elérhető ajánlás a megadott preferenciák alapján.</p>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useWinesStore } from '../stores/winesStore'
import { useProfileStore } from '../stores/profileStore'
import BaseButton from '../components/ui/BaseButton.vue'

const profileStore = useProfileStore()
const winesStore = useWinesStore()

const loading = ref(true)

onMounted(async () => {
  try {
    await profileStore.fetchProfile()
    await winesStore.getAllWines()
  } finally {
    loading.value = false
  }
})

const norm = (x) => (x ?? '').toString().trim().toLowerCase()

const recommendedWines = computed(() => {
  const prefs = profileStore.selectedPreferences || {}
  const wines = winesStore.wines || []

  const prefTypes = (prefs.wineTypes || []).map(norm)
  const prefStyles = (prefs.style || []).map(norm)
  const prefFlavours = (prefs.flavourProfile || []).map(norm)
  const prefRegions = (prefs.regions || []).map(norm)
  const prefFood = (prefs.foodPreferences || []).map(norm)
  const prefPrices = prefs.priceRanges || []
  const prefAlcohol = prefs.alcoholLevels || []
  const prefYear = prefs.wineYears

  const maxScore = 10

  return wines
    .map((wine) => {
      let score = 0

      const wineType = norm(wine.type)
      const wineStyle = norm(wine.style)
      const wineRegion = norm(wine.origin?.region)

      if (prefTypes.includes(wineType)) score += 3
      if (prefStyles.includes(wineStyle)) score += 2

      if (wine.flavorProfiles?.some((f) => prefFlavours.includes(norm(f)))) score += 2

      if (prefRegions.includes(wineRegion)) score += 1

      if (prefPrices.includes(wine.priceRange)) score += 1

      if (prefAlcohol.length && wine.alcohol) {
        const level = parseFloat(wine.alcohol)

        if (prefAlcohol.includes('low') && level < 11) score += 1
        if (prefAlcohol.includes('medium') && level >= 11 && level <= 13.5) score += 1
        if (prefAlcohol.includes('high') && level > 13.5) score += 1
      }

      if (wine.foodPairingHints?.some((f) => prefFood.includes(norm(f)))) score += 1

      if (prefYear && wine.year) {
        if (wine.year.toString().includes(prefYear)) score += 1
      }

      const matchPercent = Math.round((score / maxScore) * 100)

      return { ...wine, score, matchPercent }
    })
    .filter((w) => w.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
})
</script>
