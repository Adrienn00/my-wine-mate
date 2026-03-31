<template>
  <div class="min-h-screen px-4 py-8 md:px-8 md:py-12">
    <main class="mx-auto flex w-full max-w-6xl flex-1 justify-start">
      <div v-if="loading" class="animate-pulse text-xl font-medium text-[var(--text-main)]">
        Loading recipe...
      </div>

      <div
        v-else-if="currentRecipe"
        class="glass-panel w-full max-w-2xl rounded-2xl border border-[var(--line)] p-6 text-left text-[var(--text-main)] shadow-lg"
      >
        <h3 class="mb-4 text-3xl font-bold text-[var(--wine)]">{{ currentRecipe.name }}</h3>

        <div
          v-if="currentRecipe.recipeCategories?.length"
          class="mb-4 flex flex-wrap gap-2 text-sm font-semibold"
        >
          <span
            v-for="category in currentRecipe.recipeCategories"
            :key="category"
            class="rounded-full bg-[rgba(122,32,56,0.1)] px-3 py-1 text-[var(--wine)]"
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
          <RatingDisplay :rating="Number(averageRating)" :notes="comments" />
          <AddRatingForm @submit="handleNewRating" />
        </div>

        <div class="mt-8 flex flex-wrap gap-3">
          <BaseButton to="/recipes" variant="secondary">Back</BaseButton>
          <BaseButton :to="`/foodPairing?recipeId=${currentRecipe._id}`" variant="secondary">
            Wine Pairing
          </BaseButton>
          <BaseButton :variant="isFavorite ? 'primary' : 'secondary'" @click="toggleFavorite">
            {{ isFavorite ? 'Remove from Favorites' : 'Add to Favorites' }}
          </BaseButton>
        </div>
      </div>

      <div
        v-else
        class="rounded-xl border border-[var(--line)] bg-[rgba(255,251,246,0.92)] p-6 text-[var(--danger)]"
      >
        The recipe could not be found or an error occurred while loading it.
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useProfileStore } from '../stores/profileStore'
import { useRecipesStore } from '../stores/recipesStore'
import client from '../components/httpService/client'

import BaseButton from '../components/ui/BaseButton.vue'
import RatingDisplay from '../components/RatingDisplay.vue'
import AddRatingForm from '../components/AddRatingForm.vue'

const props = defineProps({
  recipe: {
    type: Object,
    default: null,
  },
})

const route = useRoute()
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

// Extract comments.
const comments = computed(() => {
  const ratings = currentRecipe.value?.ratings || []
  return ratings.map((r) => r.comment).filter(Boolean)
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

// Submit a new rating.
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
</script>
