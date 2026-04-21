<template>
  <div class="mx-auto max-w-6xl p-6">
    <div class="mb-4">
      <BaseButton :to="backLink" variant="secondary">Back</BaseButton>
    </div>

    <h2 class="mb-6 text-center text-3xl font-semibold text-[var(--text-main)]">
      {{ pageTitle }}
    </h2>

    <div v-if="loading" class="mt-4 text-center text-[var(--text-main)]">Loading...</div>
    <div v-else-if="errorMessage" class="mt-4 text-center text-[var(--danger)]">
      {{ errorMessage }}
    </div>

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

      <section v-if="recommendations.length" class="space-y-4">
        <div class="text-center text-[var(--text-main)]">
          <h3 class="text-2xl font-semibold">Good recommendations</h3>
          <p class="mt-2 text-sm text-[var(--text-muted)]">
            These are the strongest general pairings for the selected item.
          </p>
        </div>

        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <article
            v-for="item in recommendations"
            :key="item.wine_id || item.recipe_id || item._id"
            class="glass-panel rounded-xl border border-[var(--line)] p-4 text-[var(--text-main)]"
          >
            <div
              v-if="item.probability >= 0.8"
              class="mb-3 inline-flex rounded-full bg-[var(--gold)] px-2.5 py-1 text-xs font-semibold text-[#2d1f1c]"
            >
              Top Pairing
            </div>

            <BaseButton :to="itemLink(item)" variant="simple" class="block text-lg font-semibold">
              {{ itemName(item) }}
            </BaseButton>

            <div class="mt-3 space-y-1 text-sm text-[var(--text-muted)]">
              <div><span class="font-semibold">Match:</span> {{ toPercent(item.probability) }}%</div>
              <div v-if="isWineMode">
                <span class="font-semibold">Categories:</span>
                {{ item.categories?.join(', ') || '—' }}
              </div>
              <div v-else>
                <span class="font-semibold">Wine type:</span>
                {{ item.type || '—' }}
              </div>
              <div v-if="isWineMode">
                <span class="font-semibold">Main ingredients:</span>
                —
              </div>
              <div v-else>
                <span class="font-semibold">Style:</span>
                {{ item.style || '—' }}
              </div>
            </div>

            <div class="mt-4 flex flex-wrap gap-3">
              <BaseButton
                variant="secondary"
                :disabled="feedbackLoading[itemFeedbackKey(item)]"
                @click="submitFeedback(item, 'good')"
              >
                Good match
              </BaseButton>
              <BaseButton
                variant="danger"
                :disabled="feedbackLoading[itemFeedbackKey(item)]"
                @click="submitFeedback(item, 'bad')"
              >
                Bad match
              </BaseButton>
            </div>

            <p
              v-if="feedbackStatus[itemFeedbackKey(item)]"
              class="mt-3 text-sm text-[var(--text-muted)]"
            >
              {{ feedbackStatus[itemFeedbackKey(item)] }}
            </p>
          </article>
        </div>
      </section>

      <div v-else class="mt-4 text-center text-[var(--text-main)]">
        No general recommendations are available for this item.
      </div>

      <section v-if="preferenceRecommendations.length" class="mt-10 space-y-4">
        <div class="text-center text-[var(--text-main)]">
          <h3 class="text-2xl font-semibold">Based on your preferences</h3>
          <p class="mt-2 text-sm text-[var(--text-muted)]">
            {{
              isWineMode
                ? 'These recipes were ranked by also taking your saved preferences into account.'
                : 'These wines were ranked by also taking your saved preferences into account.'
            }}
          </p>
        </div>

        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <article
            v-for="item in preferenceRecommendations"
            :key="`pref-${item.recipe_id || item.wine_id || item._id}`"
            class="glass-panel rounded-xl border border-[var(--gold)]/40 p-4 text-[var(--text-main)]"
          >
            <div
              class="mb-3 inline-flex rounded-full bg-[var(--gold)] px-2.5 py-1 text-xs font-semibold text-[#2d1f1c]"
            >
              Preference match
            </div>

            <BaseButton :to="itemLink(item)" variant="simple" class="block text-lg font-semibold">
              {{ itemName(item) }}
            </BaseButton>

            <div class="mt-3 space-y-1 text-sm text-[var(--text-muted)]">
              <div><span class="font-semibold">Match:</span> {{ toPercent(item.probability) }}%</div>
              <div v-if="isWineMode">
                <span class="font-semibold">Categories:</span>
                {{ item.categories?.join(', ') || '—' }}
              </div>
              <div v-else>
                <span class="font-semibold">Wine type:</span>
                {{ item.type || '—' }}
              </div>
              <div v-if="!isWineMode">
                <span class="font-semibold">Style:</span>
                {{ item.style || '—' }}
              </div>
            </div>

            <p class="mt-3 text-sm text-[var(--text-muted)]">
              {{ item.reason || 'Recommended based on your saved preferences.' }}
            </p>

            <div class="mt-4 flex flex-wrap gap-3">
              <BaseButton
                variant="secondary"
                :disabled="feedbackLoading[itemFeedbackKey(item)]"
                @click="submitFeedback(item, 'good')"
              >
                Good match
              </BaseButton>
              <BaseButton
                variant="danger"
                :disabled="feedbackLoading[itemFeedbackKey(item)]"
                @click="submitFeedback(item, 'bad')"
              >
                Bad match
              </BaseButton>
            </div>

            <p
              v-if="feedbackStatus[itemFeedbackKey(item)]"
              class="mt-3 text-sm text-[var(--text-muted)]"
            >
              {{ feedbackStatus[itemFeedbackKey(item)] }}
            </p>
          </article>
        </div>
      </section>

      <section
        v-else-if="authStore.user && !hasPreferenceSelections"
        class="mt-10 rounded-2xl border border-[var(--line)] bg-white/50 p-5 text-center text-[var(--text-main)]"
      >
        <h3 class="text-xl font-semibold">Based on your preferences</h3>
        <p class="mt-2 text-sm text-[var(--text-muted)]">
          {{
            isWineMode
              ? 'Save a few preferences in your profile to unlock personalized recipe recommendations here.'
              : 'Save a few wine preferences in your profile to unlock personalized wine recommendations here.'
          }}
        </p>
        <div class="mt-4">
          <BaseButton to="/preferences" variant="secondary">Open preferences</BaseButton>
        </div>
      </section>
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
import client from '../components/httpService/client'
import { useAuthStore } from '../stores/authStore'
import { useProfileStore } from '../stores/profileStore'
import { useRecipesStore } from '../stores/recipesStore'
import { useWinesStore } from '../stores/winesStore'

const route = useRoute()
const authStore = useAuthStore()
const profileStore = useProfileStore()
const winesStore = useWinesStore()
const recipesStore = useRecipesStore()
const loading = ref(true)
const recommendations = ref([])
const preferenceRecommendations = ref([])
const errorMessage = ref('')
const fetchedWine = ref(null)
const fetchedRecipe = ref(null)
const feedbackLoading = ref({})
const feedbackStatus = ref({})

onMounted(async () => {
  try {
    await Promise.all([
      winesStore.getAllWines(),
      recipesStore.getAllRecipes(),
      authStore.token ? profileStore.fetchProfile() : Promise.resolve(null),
    ])
    await ensureSourceItem()
    await loadRecommendations()
  } catch (error) {
    errorMessage.value = error.message || 'Failed to load AI recommendations.'
  } finally {
    loading.value = false
  }
})

const wineId = computed(() => String(route.query.wineId || '').trim())
const recipeId = computed(() => String(route.query.recipeId || '').trim())
const isWineMode = computed(() => Boolean(wineId.value))
const hasRecipePreferenceSelections = computed(() => {
  const prefs = profileStore.selectedPreferences || {}
  return [prefs.foodPreferences, prefs.recipeCategories, prefs.recipeMeatTypes, prefs.recipeDishTypes, prefs.recipeMainIngredients].some(
    (value) => (Array.isArray(value) ? value.length > 0 : Boolean(String(value || '').trim()))
  )
})
const hasWinePreferenceSelections = computed(() => {
  const prefs = profileStore.selectedPreferences || {}
  return [prefs.wineTypes, prefs.style, prefs.flavourProfile, prefs.regions, prefs.alcoholLevels, prefs.foodPreferences, prefs.wineYears, prefs.priceRanges].some(
    (value) => (Array.isArray(value) ? value.length > 0 : Boolean(String(value || '').trim()))
  )
})
const hasPreferenceSelections = computed(() =>
  isWineMode.value ? hasRecipePreferenceSelections.value : hasWinePreferenceSelections.value
)
const canLoadPreferenceRecommendations = computed(
  () => Boolean(authStore.user?._id) && hasPreferenceSelections.value
)

const sourceWine = computed(() =>
  winesStore.confirmedWines.find((wine) => wine._id === wineId.value) || fetchedWine.value
)
const sourceRecipe = computed(() =>
  recipesStore.confirmedRecipes.find((recipe) => recipe._id === recipeId.value) || fetchedRecipe.value
)
const sourceItem = computed(() => sourceWine.value || sourceRecipe.value || null)

const pageTitle = computed(() =>
  sourceWine.value
    ? 'AI recipe recommendations for this wine'
    : 'AI wine recommendations for this recipe'
)

const sourceLabel = computed(() => (sourceWine.value ? 'Selected wine' : 'Selected recipe'))

const sourceSummary = computed(() => {
  if (sourceWine.value) {
    return sourceWine.value.foodPairingHints?.length
      ? `Food pairing hints: ${sourceWine.value.foodPairingHints.join(', ')}`
      : 'Recipes are recommended by the backend AI model for this wine.'
  }

  if (sourceRecipe.value) {
    return sourceRecipe.value.recipeCategories?.length
      ? `Recipe categories: ${sourceRecipe.value.recipeCategories.join(', ')}`
      : 'Wines are recommended by the backend AI model for this recipe.'
  }

  return ''
})

const backLink = computed(() => {
  if (sourceWine.value) return `/wine/${sourceWine.value._id}`
  if (sourceRecipe.value) return `/recipe/${sourceRecipe.value._id}`
  return '/'
})

function itemLink(item) {
  if (isWineMode.value) return `/recipe/${item.recipe_id || item._id}`
  return `/wine/${item.wine_id || item._id}`
}

async function loadRecommendations() {
  if (wineId.value) {
    const recommendResponse = await client.get(`pairings/recommend?wineId=${wineId.value}&topK=6`)
    recommendations.value = recommendResponse.results || []

    if (canLoadPreferenceRecommendations.value) {
      const preferenceResponse = await client.get(
        `pairings/recommend?wineId=${wineId.value}&topK=6&usePreferences=true&engine=llm&userId=${authStore.user._id}`
      )
      preferenceRecommendations.value = preferenceResponse.results || []
    } else {
      preferenceRecommendations.value = []
    }
    return
  }

  if (recipeId.value) {
    const response = await client.get(`pairings/recommend?recipeId=${recipeId.value}&topK=6`)
    recommendations.value = response.results || []
    if (canLoadPreferenceRecommendations.value) {
      const preferenceResponse = await client.get(
        `pairings/recommend?recipeId=${recipeId.value}&topK=6&usePreferences=true&engine=llm&userId=${authStore.user._id}`
      )
      preferenceRecommendations.value = preferenceResponse.results || []
    } else {
      preferenceRecommendations.value = []
    }
    return
  }

  recommendations.value = []
  preferenceRecommendations.value = []
}

async function ensureSourceItem() {
  if (recipeId.value && !sourceRecipe.value) {
    fetchedRecipe.value = await client.get(`recipes/${recipeId.value}`)
  }

  if (wineId.value && !sourceWine.value) {
    fetchedWine.value = await winesStore.getSelectedWine(wineId.value)
  }
}

function itemName(item) {
  return item.wine_name || item.recipe_name || item.name || 'Open details'
}

function itemFeedbackKey(item) {
  return String(item.wine_id || item.recipe_id || item._id || itemName(item))
}

function toPercent(probability) {
  const numeric = Number(probability)
  if (!Number.isFinite(numeric)) return 0
  return Math.round(numeric * 100)
}

function normalizeText(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

async function submitFeedback(item, feedback) {
  const key = itemFeedbackKey(item)

  feedbackLoading.value = {
    ...feedbackLoading.value,
    [key]: true,
  }

  feedbackStatus.value = {
    ...feedbackStatus.value,
    [key]: '',
  }

  try {
    const payload = {
      direction: isWineMode.value ? 'wine_to_recipe' : 'recipe_to_wine',
      feedback,
      recommendationScore: Number(item.probability ?? 0),
      recipeId: isWineMode.value ? item.recipe_id || item._id : recipeId.value,
      wineId: isWineMode.value ? wineId.value : item.wine_id || item._id,
    }

    await client.post('pairings/feedback', payload)

    feedbackStatus.value = {
      ...feedbackStatus.value,
      [key]: authStore.user
        ? 'Thanks, your feedback was saved and will help improve future recommendations.'
        : 'Thanks, your anonymous feedback was saved and will help improve future recommendations.',
    }
  } catch (error) {
    feedbackStatus.value = {
      ...feedbackStatus.value,
      [key]: error.message || 'Could not save feedback.',
    }
  } finally {
    feedbackLoading.value = {
      ...feedbackLoading.value,
      [key]: false,
    }
  }
}
</script>
