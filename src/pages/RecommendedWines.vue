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

          <div v-if="wine.reasons?.length" class="pt-1 text-xs text-yellow-200">
            <span class="font-semibold">Miért ajánlott:</span>
            {{ wine.reasons.slice(0, 2).join(' • ') }}
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
import { getRecommendedWines } from '../services/recommendationEngine'
import { buildRecommendationCatalog } from '../services/recommendationCatalog'

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

const recommendedWines = computed(() => {
  const catalog = buildRecommendationCatalog(winesStore.wines, profileStore.selectedPreferences)
  return getRecommendedWines(profileStore.selectedPreferences, winesStore.wines, 6, catalog)
})
</script>
