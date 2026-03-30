<template>
  <div class="mx-auto max-w-6xl p-6">
    <div class="mb-4">
      <BaseButton to="/profile" variant="secondary">Vissza</BaseButton>
    </div>

    <h2 class="mb-6 text-center text-3xl font-semibold text-[var(--text-main)]">
      Ajánlott borok számodra
    </h2>

    <div v-if="loading" class="mt-4 text-center text-[var(--text-main)]">Betöltés...</div>

    <div
      v-else-if="recommendedWines.length"
      class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      <div
        v-for="wine in recommendedWines"
        :key="wine._id"
        class="glass-panel relative rounded-xl border border-[var(--line)] p-4 text-[var(--text-main)]"
      >
        <div
          v-if="wine.matchPercent >= 80"
          class="absolute top-2 right-2 rounded bg-[var(--gold)] px-2 py-1 text-xs font-semibold text-[#2d1f1c]"
        >
          Best Match
        </div>

        <BaseButton :to="`/wine/${wine._id}?from=recommended`" variant="simple">
          {{ wine.name }}
        </BaseButton>

        <div class="mt-3 space-y-1 text-sm text-[var(--text-muted)]">
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

          <div v-if="wine.reasons?.length" class="pt-1 text-xs text-[var(--wine)]">
            <span class="font-semibold">Miért ajánlott:</span>
            {{ wine.reasons.slice(0, 2).join(' • ') }}
          </div>
        </div>
      </div>
    </div>

    <div v-else class="mt-4 text-center text-[var(--text-main)]">
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
