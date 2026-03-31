<template>
  <div class="mx-auto max-w-6xl p-6">
    <div class="mb-4">
      <BaseButton :to="backLink" variant="secondary">Back</BaseButton>
    </div>

    <h2 class="mb-6 text-center text-3xl font-semibold text-[var(--text-main)]">
      {{ pageTitle }}
    </h2>

    <div v-if="loading" class="mt-4 text-center text-[var(--text-main)]">Loading...</div>

    <template v-else-if="sourceItem">
      <section
        class="glass-panel mb-6 rounded-2xl border border-[var(--line)] p-6 text-[var(--text-main)]"
      >
        <p class="text-sm uppercase tracking-[0.2em] text-[var(--text-muted)]">
          {{ sourceLabel }}
        </p>
        <h3 class="mt-2 text-2xl font-semibold">{{ sourceItem.name }}</h3>
        <p v-if="sourceSummary" class="mt-2 text-sm text-[var(--text-muted)]">
          {{ sourceSummary }}
        </p>
      </section>

      <div
        v-if="recommendations.length"
        class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        <article
          v-for="item in recommendations"
          :key="item._id"
          class="glass-panel rounded-xl border border-[var(--line)] p-4 text-[var(--text-main)]"
        >
          <div
            v-if="item.matchPercent >= 80"
            class="mb-3 inline-flex rounded-full bg-[var(--gold)] px-2.5 py-1 text-xs font-semibold text-[#2d1f1c]"
          >
            Top Pairing
          </div>

          <BaseButton :to="itemLink(item)" variant="simple" class="block text-lg font-semibold">
            {{ item.name }}
          </BaseButton>

          <div class="mt-3 space-y-1 text-sm text-[var(--text-muted)]">
            <div><span class="font-semibold">Match:</span> {{ item.matchPercent }}%</div>
            <div v-if="isWineMode">
              <span class="font-semibold">Categories:</span>
              {{ item.recipeCategories?.join(', ') || '—' }}
            </div>
            <div v-else>
              <span class="font-semibold">Wine type:</span>
              {{ item.type || '—' }}
            </div>
            <div v-if="isWineMode">
              <span class="font-semibold">Main ingredients:</span>
              {{ recipeMainIngredientPreview(item) }}
            </div>
            <div v-else>
              <span class="font-semibold">Food pairing:</span>
              {{ item.foodPairingHints?.join(', ') || '—' }}
            </div>
            <div v-if="item.reasons?.length" class="pt-1 text-xs text-[var(--wine)]">
              <span class="font-semibold">Why it is recommended:</span>
              {{ item.reasons.slice(0, 2).join(' • ') }}
            </div>
          </div>
        </article>
      </div>

      <div v-else class="mt-4 text-center text-[var(--text-main)]">
        No general recommendations are available for this item.
      </div>
    </template>

    <div v-else class="mt-4 text-center text-[var(--text-main)]">
      Open a wine or recipe first, then launch the recommender from there.
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import BaseButton from '../components/ui/BaseButton.vue'
import { useRecipesStore } from '../stores/recipesStore'
import { useWinesStore } from '../stores/winesStore'
import { detectRecipeMainIngredients } from '../services/recipeCategories'
import {
  getRecommendedRecipesForWine,
  getRecommendedWinesForRecipe,
} from '../services/generalPairingEngine'

const route = useRoute()
const winesStore = useWinesStore()
const recipesStore = useRecipesStore()
const loading = ref(true)

onMounted(async () => {
  try {
    await Promise.all([winesStore.getAllWines(), recipesStore.getAllRecipes()])
  } finally {
    loading.value = false
  }
})

const wineId = computed(() => String(route.query.wineId || '').trim())
const recipeId = computed(() => String(route.query.recipeId || '').trim())
const isWineMode = computed(() => Boolean(wineId.value))

const sourceWine = computed(() =>
  winesStore.confirmedWines.find((wine) => wine._id === wineId.value)
)
const sourceRecipe = computed(() =>
  recipesStore.confirmedRecipes.find((recipe) => recipe._id === recipeId.value)
)
const sourceItem = computed(() => sourceWine.value || sourceRecipe.value || null)

const recommendations = computed(() => {
  if (sourceWine.value) {
    return getRecommendedRecipesForWine(sourceWine.value, recipesStore.confirmedRecipes, 6)
  }
  if (sourceRecipe.value) {
    return getRecommendedWinesForRecipe(sourceRecipe.value, winesStore.confirmedWines, 6)
  }
  return []
})

const pageTitle = computed(() =>
  sourceWine.value
    ? 'General recipe recommendations for this wine'
    : 'General wine recommendations for this recipe'
)

const sourceLabel = computed(() => (sourceWine.value ? 'Selected wine' : 'Selected recipe'))

const sourceSummary = computed(() => {
  if (sourceWine.value) {
    return sourceWine.value.foodPairingHints?.length
      ? `Food pairing hints: ${sourceWine.value.foodPairingHints.join(', ')}`
      : 'Recipes are recommended for this wine based on its general style and type.'
  }

  if (sourceRecipe.value) {
    return sourceRecipe.value.recipeCategories?.length
      ? `Recipe categories: ${sourceRecipe.value.recipeCategories.join(', ')}`
      : 'Wines are recommended for this recipe based on its ingredients and categories.'
  }

  return ''
})

const backLink = computed(() => {
  if (sourceWine.value) return `/wine/${sourceWine.value._id}`
  if (sourceRecipe.value) return `/recipe/${sourceRecipe.value._id}`
  return '/'
})

function itemLink(item) {
  if (isWineMode.value) return `/recipe/${item._id}`
  return `/wine/${item._id}`
}

function recipeMainIngredientPreview(recipe) {
  const values = detectRecipeMainIngredients(recipe)
  return values.length ? values.join(', ') : '—'
}
</script>
