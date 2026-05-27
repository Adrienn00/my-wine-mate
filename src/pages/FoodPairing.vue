<template>
  <PageFrame max-width="max-w-6xl">
    <div>
      <BaseButton :to="backLink" variant="secondary">Back</BaseButton>
    </div>

    <h2 class="text-center text-3xl font-semibold text-[var(--text-main)]">
      {{ pageTitle }}
    </h2>

    <div v-if="loading" class="py-12 text-center text-[var(--text-muted)]">Loading...</div>
    <div v-else-if="errorMessage" class="py-8 text-center text-[var(--danger)]">
      {{ errorMessage }}
    </div>

    <template v-else-if="sourceItem">
      <BaseCard as="section">
        <SectionHeader
          variant="card"
          title-tag="h3"
          :kicker="sourceLabel"
          :title="sourceItem.name"
          :description="sourceSummary"
        />
      </BaseCard>

      <!-- General recommendations -->
      <section v-if="recommendations.length" class="space-y-4">
        <div class="text-center">
          <h3 class="text-2xl font-semibold">Good recommendations</h3>
          <p class="mt-2 text-sm text-[var(--text-muted)]">
            These are the strongest general pairings for the selected item.
          </p>
        </div>
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <PairingRecommendationCard
            v-for="item in recommendations"
            :key="item.wine_id || item.recipe_id || item._id"
            :item="item"
            :is-wine-mode="isWineMode"
            :feedback-loading="feedbackLoading[feedbackKey(item)]"
            :feedback-status="feedbackStatus[feedbackKey(item)]"
            @feedback="({ item: i, type }) => submitFeedback(i, type)"
          />
        </div>
      </section>
      <div v-else class="py-6 text-center text-[var(--text-muted)]">
        No general recommendations are available for this item.
      </div>

      <!-- Preference recommendations -->
      <section v-if="preferenceRecommendations.length" class="mt-6 space-y-4">
        <div class="text-center">
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
          <PairingRecommendationCard
            v-for="item in preferenceRecommendations"
            :key="`pref-${item.recipe_id || item.wine_id || item._id}`"
            :item="item"
            :is-wine-mode="isWineMode"
            :is-preference="true"
            :feedback-loading="feedbackLoading[feedbackKey(item)]"
            :feedback-status="feedbackStatus[feedbackKey(item)]"
            @feedback="({ item: i, type }) => submitFeedback(i, type)"
          />
        </div>
      </section>

      <!-- No preferences prompt -->
      <BaseCard
        v-else-if="authStore.user && !hasPreferenceSelections"
        as="section"
        class="mt-6 border border-[var(--line)] text-center"
        padding="p-5"
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
      </BaseCard>
    </template>

    <!-- Browse mode (no source item) -->
    <PairingBrowser v-else />
  </PageFrame>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import BaseButton from '../components/ui/BaseButton.vue'
import BaseCard from '../components/ui/BaseCard.vue'
import PageFrame from '../components/ui/PageFrame.vue'
import SectionHeader from '../components/ui/SectionHeader.vue'
import PairingRecommendationCard from '../components/PairingRecommendationCard.vue'
import PairingBrowser from '../components/PairingBrowser.vue'
import client from '../components/httpService/client'
import { useAuthStore } from '../stores/authStore'
import { useProfileStore } from '../stores/profileStore'

const route = useRoute()
const authStore = useAuthStore()
const profileStore = useProfileStore()

const loading = ref(true)
const errorMessage = ref('')
const recommendations = ref([])
const preferenceRecommendations = ref([])
const fetchedWine = ref(null)
const fetchedRecipe = ref(null)
const feedbackLoading = ref({})
const feedbackStatus = ref({})

onMounted(async () => {
  try {
    await Promise.all([
      ensureSourceItem(),
      authStore.token ? profileStore.fetchProfile() : Promise.resolve(null),
    ])
    await loadRecommendations()
  } catch {
    errorMessage.value = 'Could not load AI recommendations. Please try again later.'
  } finally {
    loading.value = false
  }
})

const wineId = computed(() => String(route.query.wineId || '').trim())
const recipeId = computed(() => String(route.query.recipeId || '').trim())
const isWineMode = computed(() => Boolean(wineId.value))

const hasPreferenceSelections = computed(() => {
  const prefs = profileStore.selectedPreferences || {}
  const wineKeys = [
    'wineTypes',
    'style',
    'flavourProfile',
    'regions',
    'alcoholLevels',
    'foodPreferences',
    'wineYears',
    'priceRanges',
  ]
  const recipeKeys = [
    'foodPreferences',
    'recipeCategories',
    'recipeMeatTypes',
    'recipeDishTypes',
    'recipeMainIngredients',
  ]
  const keys = isWineMode.value ? recipeKeys : wineKeys
  return keys.some((k) =>
    Array.isArray(prefs[k]) ? prefs[k].length > 0 : Boolean(String(prefs[k] || '').trim())
  )
})

const canLoadPreferences = computed(() => Boolean(authStore.user?._id) && hasPreferenceSelections.value)

const sourceItem = computed(() => fetchedWine.value || fetchedRecipe.value || null)

const pageTitle = computed(() => {
  if (!sourceItem.value) return 'Classic pairing browser'
  return fetchedWine.value
    ? 'AI recipe recommendations for this wine'
    : 'AI wine recommendations for this recipe'
})

const sourceLabel = computed(() => (fetchedWine.value ? 'Selected wine' : 'Selected recipe'))

const sourceSummary = computed(() => {
  if (fetchedWine.value)
    return fetchedWine.value.foodPairingHints?.length
      ? `Food pairing hints: ${fetchedWine.value.foodPairingHints.join(', ')}`
      : 'Recipes are recommended by the AI model for this wine.'
  if (fetchedRecipe.value)
    return fetchedRecipe.value.recipeCategories?.length
      ? `Recipe categories: ${fetchedRecipe.value.recipeCategories.join(', ')}`
      : 'Wines are recommended by the AI model for this recipe.'
  return ''
})

const backLink = computed(() => {
  if (fetchedWine.value) return `/wine/${fetchedWine.value._id}`
  if (fetchedRecipe.value) return `/recipe/${fetchedRecipe.value._id}`
  return '/'
})

async function ensureSourceItem() {
  if (recipeId.value) fetchedRecipe.value = await client.get(`recipes/${recipeId.value}`)
  else if (wineId.value) fetchedWine.value = await client.get(`wines/${wineId.value}`)
}

async function loadRecommendations() {
  const sourceQuery = wineId.value
    ? `wineId=${wineId.value}`
    : recipeId.value
      ? `recipeId=${recipeId.value}`
      : ''
  if (!sourceQuery) return
  const response = await client.get(
    `pairings/recommend-bundle?${sourceQuery}&topK=6&includePreferences=${canLoadPreferences.value}`
  )
  recommendations.value = response.general?.results || []
  preferenceRecommendations.value = response.preference?.results || []
}

function feedbackKey(item) {
  return String(item.wine_id || item.recipe_id || item._id || '')
}

async function submitFeedback(item, feedback) {
  const key = feedbackKey(item)
  feedbackLoading.value = { ...feedbackLoading.value, [key]: true }
  feedbackStatus.value = { ...feedbackStatus.value, [key]: '' }

  try {
    await client.post('pairings/feedback', {
      direction: isWineMode.value ? 'wine_to_recipe' : 'recipe_to_wine',
      feedback,
      recommendationScore: Number(item.probability ?? 0),
      recipeId: isWineMode.value ? item.recipe_id || item._id : recipeId.value,
      wineId: isWineMode.value ? wineId.value : item.wine_id || item._id,
    })
    feedbackStatus.value = {
      ...feedbackStatus.value,
      [key]: authStore.user
        ? 'Thanks, your feedback was saved.'
        : 'Thanks, your anonymous feedback was saved.',
    }
  } catch (error) {
    feedbackStatus.value = { ...feedbackStatus.value, [key]: error.message || 'Could not save feedback.' }
  } finally {
    feedbackLoading.value = { ...feedbackLoading.value, [key]: false }
  }
}
</script>
