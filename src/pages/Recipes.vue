<template>
  <div class="min-h-screen bg text-white p-4">
    <div v-if="recipesStore.loading" class="text-center py-10 animate-pulse">
      Receptek betöltése...
    </div>

    <ul v-else>
      <li
        v-for="recipe in recipesStore.confirmedRecipes"
        :key="recipe._id"
        class="px-4 py-2 border-b border-gray-700 last:border-b-0 hover:bg-gray-700 cursor-pointer"
      >
        <BaseButton variant="simple" :to="`/recipe/${recipe._id}`" class="block">
          {{ recipe.name }}
        </BaseButton>
      </li>
    </ul>

    <div v-if="!recipesStore.loading" class="flex justify-center py-4">
      <BaseButton variant="primary" to="/addRecipe">Új recept hozzáadása</BaseButton>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import BaseButton from '../components/ui/BaseButton.vue'
import { useRecipesStore } from '../stores/recipesStore'

const recipesStore = useRecipesStore()

// JAVÍTÁS: Amikor az oldal betölt, meghívjuk a backend lekérést
onMounted(() => {
  recipesStore.getAllRecipes()
})
</script>

<style scoped>
.bg {
  background-image: url('/src/assets/images/bgfood.jpg');
  background-size: cover;
  background-position: center;
}
</style>
