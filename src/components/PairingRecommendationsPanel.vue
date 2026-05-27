<template>
  <section class="dashboard-panel h-fit rounded-xl p-5 text-[var(--text-main)]">
    <div class="mb-4">
      <p class="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Pairing Suggestions</p>
      <h3 class="mt-2 text-2xl font-semibold">
        {{ isWineMode ? 'Recipes for this wine' : 'Wines for this recipe' }}
      </h3>
    </div>

    <div v-if="loading" class="text-sm text-[var(--text-muted)]">Loading pairings...</div>
    <div v-else-if="errorMessage" class="text-sm text-[var(--danger)]">{{ errorMessage }}</div>
    <div v-else class="space-y-8">
      <section v-if="recommendations.length" class="space-y-3">
        <div class="flex items-center justify-between gap-3">
          <h4 class="text-lg font-semibold">Recommended</h4>
          <span class="dashboard-chip">{{ recommendations.length }} items</span>
        </div>

        <div class="space-y-3">
          <article
            v-for="item in recommendations"
            :key="item.wine_id || item.recipe_id || item._id"
            class="rounded-xl border border-[var(--line)] bg-white/80 p-4"
          >
            <BaseButton :to="itemLink(item)" variant="simple" class="block px-0 text-lg font-semibold">
              {{ itemName(item) }}
            </BaseButton>
            <div
              class="mt-2 inline-flex rounded-full border border-[var(--line)] bg-white/70 px-2.5 py-1 text-xs font-semibold text-[var(--wine)]"
            >
              {{ item.recommendationLabel || 'Smart recommendation' }}
            </div>
            <div class="mt-3 space-y-1 text-sm text-[var(--text-muted)]">
              <div><span class="font-semibold">Match:</span> {{ toPercent(item.probability) }}%</div>
              <div v-if="isWineMode">
                <span class="font-semibold">Categories:</span>
                {{ item.categories?.join(', ') || '—' }}
              </div>
              <div v-else>
                <span class="font-semibold">Type:</span>
                {{ item.type || '—' }}
              </div>
              <div v-if="!isWineMode">
                <span class="font-semibold">Style:</span>
                {{ item.style || '—' }}
              </div>
            </div>
          </article>
        </div>
      </section>

      <section v-if="preferenceRecommendations.length" class="space-y-3">
        <div class="flex items-center justify-between gap-3">
          <h4 class="text-lg font-semibold">Based on your preferences</h4>
          <span class="dashboard-chip">{{ preferenceRecommendations.length }} items</span>
        </div>

        <div class="space-y-3">
          <article
            v-for="item in preferenceRecommendations"
            :key="`pref-${item.recipe_id || item.wine_id || item._id}`"
            class="rounded-xl border border-[rgba(184,149,90,0.3)] bg-white/80 p-4"
          >
            <BaseButton :to="itemLink(item)" variant="simple" class="block px-0 text-lg font-semibold">
              {{ itemName(item) }}
            </BaseButton>
            <p class="mt-2 text-sm text-[var(--text-muted)]">
              {{ item.reason || 'Recommended from your saved preferences.' }}
            </p>
          </article>
        </div>
      </section>

      <p
        v-if="!recommendations.length && !preferenceRecommendations.length && !loading"
        class="text-sm text-[var(--text-muted)]"
      >
        No pairings are available for this item right now.
      </p>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import BaseButton from './ui/BaseButton.vue'
import client from './httpService/client'

const props = defineProps({
  recipeId: {
    type: String,
    default: '',
  },
  wineId: {
    type: String,
    default: '',
  },
})

const loading = ref(false)
const errorMessage = ref('')
const recommendations = ref([])
const preferenceRecommendations = ref([])

const isWineMode = computed(() => Boolean(props.wineId))
const sourceQuery = computed(() =>
  props.wineId ? `wineId=${props.wineId}` : props.recipeId ? `recipeId=${props.recipeId}` : ''
)

async function loadRecommendations() {
  if (!sourceQuery.value) return

  loading.value = true
  errorMessage.value = ''

  try {
    const response = await client.get(
      `pairings/recommend-bundle?${sourceQuery.value}&topK=6&includePreferences=false`
    )
    recommendations.value = response.general?.results || []
    preferenceRecommendations.value = response.preference?.results || []
  } catch (error) {
    errorMessage.value = error.message || 'Could not load pairings.'
    recommendations.value = []
    preferenceRecommendations.value = []
  } finally {
    loading.value = false
  }
}

function itemName(item) {
  return item.wine_name || item.recipe_name || item.name || 'Open details'
}

function itemLink(item) {
  if (isWineMode.value) return `/recipe/${item.recipe_id || item._id}`
  return `/wine/${item.wine_id || item._id}`
}

function toPercent(probability) {
  const numeric = Number(probability)
  if (!Number.isFinite(numeric)) return 0
  return Math.round(numeric * 100)
}

onMounted(loadRecommendations)
watch(sourceQuery, loadRecommendations)
</script>
