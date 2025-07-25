<template>
  <div class="min-h-screen bg flex flex-col">
    <main class="flex flex-1 justify-start px-6 py-8 max-w-6xl mx-auto w-full">
      <div class="text-left bg-gray-800 text-yellow-100 p-6 rounded max-w-md w-full">
        <h3 class="text-2xl font-semibold mb-2">{{ recipe.name }}</h3>
        <p>{{ recipe.ingredients }}</p>

        <p class="mb-4"><strong>Leírás:</strong> {{ recipe.description }}</p>

        <div class="mt-6 space-y-4">
          <RatingDisplay :rating="averageRating" :notes="comments" />
          <AddRatingForm @submit="handleNewRating" />
        </div>

        <div class="flex space-x-5 mt-6">
          <BaseButton to="/recipes" variant="secondary">Vissza a receptekhez</BaseButton>
          <BaseButton to="/foodpairing" variant="secondary">Bor ajánló</BaseButton>
          <BaseButton variant="secondary" @click="toggleFavorite">
            {{ isFavorite ? 'Eltávolítás a kedvencekből' : 'Kedvencekhez adom' }}
          </BaseButton>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useProfileStore } from '../stores/profileStore'
import { useRecipesStore } from '../stores/recipesStore'

import BaseButton from '../components/ui/BaseButton.vue'
import RatingDisplay from '../components/RatingDisplay.vue'
import AddRatingForm from '../components/AddRatingForm.vue'

const props = defineProps({
  recipe: Object,
})

const route = useRoute()
const recipesStore = useRecipesStore()
const profileStore = useProfileStore()
const allRecipes = recipesStore.recipes

const recipe = computed(() => {
  if (props.recipe) return props.recipe

  const id = Number(route.params.id)
  return allRecipes.find((r) => r.id === id)
})

const isFavorite = computed(() => profileStore.isFavoriteRecipe(recipe.value))

const averageRating = computed(() => {
  const ratings = recipe.value?.ratings || []
  if (!ratings.length) return 0
  const total = ratings.reduce((sum, r) => sum + r.rating, 0)
  return (total / ratings.length).toFixed(1)
})

const comments = computed(() => {
  const ratings = recipe.value?.ratings || []
  return ratings.map((r) => r.comment).filter(Boolean)
})

function handleNewRating({ rating, comment }) {
  recipesStore.addRating(recipe.value.name, rating, comment)
}

function toggleFavorite() {
  if (isFavorite.value) {
    profileStore.removeFavoriteRecipe(recipe.value)
  } else {
    profileStore.addFavoriteRecipe(recipe.value)
  }
}
</script>

<style scoped>
.bg {
  background-image: url('/src/assets/images/bgfood.jpg');
  background-size: cover;
}
</style>
