<template>
  <div class="min-h-screen px-4 py-8 md:px-8 md:py-12">
    <main class="mx-auto flex w-full max-w-7xl flex-1 justify-start">
      <div v-if="loading" class="animate-pulse text-xl font-medium text-[var(--text-main)]">
        Loading recipe...
      </div>

      <div v-else-if="currentRecipe" class="grid w-full gap-6 xl:grid-cols-[minmax(0,1.1fr)_380px]">
        <BaseCard padding="p-6" class="text-left">
          <div class="mb-6 overflow-hidden rounded-2xl border border-[var(--line)] shadow-md">
            <img
              :src="recipeImageFor(currentRecipe)"
              :alt="`${currentRecipe.name} image`"
              class="h-72 w-full object-cover"
            />
          </div>

          <h3 class="mb-4 text-3xl font-bold text-[var(--wine)]">{{ currentRecipe.name }}</h3>

          <div
            v-if="currentRecipe.recipeCategories?.length"
            class="mb-4 flex flex-wrap gap-2 text-sm font-semibold"
          >
            <span
              v-for="category in currentRecipe.recipeCategories"
              :key="category"
              class="rounded-full bg-[rgba(107,45,62,0.08)] px-3 py-1 text-[var(--wine)]"
            >
              {{ category }}
            </span>
          </div>

          <div v-if="currentRecipe.ingredients && currentRecipe.ingredients.length" class="mb-4">
            <strong class="text-lg">Ingredients:</strong>
            <p class="mt-1 text-[var(--text-muted)]">
              {{
                Array.isArray(currentRecipe.ingredients)
                  ? currentRecipe.ingredients.join(', ')
                  : currentRecipe.ingredients
              }}
            </p>
          </div>

          <div class="mb-6">
            <strong class="mb-2 block border-b border-[var(--line)] pb-1 text-lg">Instructions:</strong>

            <div v-if="currentRecipe.instructions && currentRecipe.instructions.length">
              <ol
                v-if="Array.isArray(currentRecipe.instructions)"
                class="list-inside list-decimal space-y-2 text-[var(--text-muted)]"
              >
                <li
                  v-for="(step, index) in currentRecipe.instructions"
                  :key="index"
                  class="leading-relaxed"
                >
                  {{ step }}
                </li>
              </ol>
              <p v-else class="italic text-[var(--text-muted)]">{{ currentRecipe.instructions }}</p>
            </div>

            <p v-else class="italic text-[var(--text-muted)]">No preparation instructions were provided.</p>
          </div>

          <div class="mt-8 space-y-6 border-t border-[var(--line)] pt-6">
            <RatingDisplay
              :rating="Number(averageRating)"
              :comment-entries="commentEntries"
              :is-admin="isAdmin"
              @delete-comment="handleDeleteComment"
            />
            <AddRatingForm @submit="handleNewRating" />
          </div>

          <div class="mt-8 flex flex-wrap gap-3">
            <BaseButton :to="backLink" variant="secondary">Back</BaseButton>
            <BaseButton :variant="isFavorite ? 'primary' : 'secondary'" @click="toggleFavorite">
              {{ isFavorite ? 'Remove from Favorites' : 'Add to Favorites' }}
            </BaseButton>
          </div>
        </BaseCard>

        <PairingRecommendationsPanel :recipe-id="currentRecipe._id" />
      </div>

      <div
        v-else
        class="rounded-xl border border-[var(--line)] bg-white p-6 text-[var(--danger)]"
      >
        The recipe could not be found or an error occurred while loading it.
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { useProfileStore } from '../stores/profileStore'
import { useRecipesStore } from '../stores/recipesStore'
import client from '../components/httpService/client'

import BaseButton from '../components/ui/BaseButton.vue'
import BaseCard from '../components/ui/BaseCard.vue'
import RatingDisplay from '../components/RatingDisplay.vue'
import AddRatingForm from '../components/AddRatingForm.vue'
import PairingRecommendationsPanel from '../components/PairingRecommendationsPanel.vue'
import { recipeImageFor } from '../services/imageFallbacks'

const props = defineProps({
  recipe: {
    type: Object,
    default: null,
  },
})

const route = useRoute()
const authStore = useAuthStore()
const recipesStore = useRecipesStore()
const profileStore = useProfileStore()

const fetchedRecipe = ref(null)
const loading = ref(false)
// Use either the passed recipe prop or the recipe fetched by id.
const currentRecipe = computed(() => props.recipe || fetchedRecipe.value)

// Favorite state.
const isFavorite = computed(() => {
  return currentRecipe.value ? profileStore.isFavoriteRecipe(currentRecipe.value) : false
})

// Average rating.
const averageRating = computed(() => {
  const ratings = currentRecipe.value?.ratings || []
  if (!ratings.length) return 0
  const total = ratings.reduce((sum, r) => sum + (Number(r.rating) || 0), 0)
  return (total / ratings.length).toFixed(1)
})

const isAdmin = computed(() => Boolean(authStore.user?.isAdmin))

const commentEntries = computed(() => {
  const ratings = currentRecipe.value?.ratings || []
  return ratings
    .filter((r) => String(r?.comment || '').trim())
    .map((r, index) => ({
      id: String(r?.ratingId || r?._id || `idx-${index}`).trim(),
      text: String(r.comment || '').trim(),
      author: String(r?.userName || '').trim() || 'Anonymous',
    }))
})

// Load the recipe using the MongoDB id from the URL.
onMounted(async () => {
  if (!props.recipe) {
    loading.value = true
    try {
      const id = route.params.id
      fetchedRecipe.value = await client.get(`recipes/${id}`)
    } catch (error) {
      console.error('Error while loading recipe:', error)
    } finally {
      loading.value = false
    }
  }
})

async function handleDeleteComment(entry) {
  if (!isAdmin.value || !entry?.id || !currentRecipe.value?._id) return
  const ok = window.confirm('Are you sure you want to delete this comment?')
  if (!ok) return
  try {
    const updated = await recipesStore.deleteRating(currentRecipe.value._id, entry.id)
    if (updated) fetchedRecipe.value = updated
  } catch (error) {
    console.error(error)
  }
}

async function handleNewRating({ rating, comment }) {
  if (!currentRecipe.value) return
  try {
    const updated = await recipesStore.addRating(currentRecipe.value._id, rating, comment)
    if (updated) fetchedRecipe.value = updated
  } catch (error) {
    console.error('Rating error:', error)
  }
}

// Toggle favorite state.
function toggleFavorite() {
  if (!currentRecipe.value) return
  if (isFavorite.value) {
    profileStore.removeFavoriteRecipe(currentRecipe.value)
  } else {
    profileStore.addFavoriteRecipe(currentRecipe.value)
  }
}

const backLink = computed(() => {
  const from = route.query.from
  if (from === 'pairing-browser') return '/foodPairing'
  return '/recipes'
})
</script>
