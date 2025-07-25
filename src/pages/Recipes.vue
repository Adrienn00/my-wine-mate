<template>
  <div class="min-h-screen bg text-white p-4">
    <ul>
      <li
        v-for="recipe in recipesStore.confirmedRecipes"
        :key="recipe.id"
        class="px-4 py-2 border-b border-gray-700 last:border-b-0 hover:bg-gray-700 cursor-pointer"
      >
        <BaseButton variant="simple" :to="`/recipe/${recipe.id}`" class="block">
          {{ recipe.name }}
        </BaseButton>
      </li>
    </ul>
    <div class="flex justify-center :py-4">
      <BaseButton variant="primary" to="/addRecipe">Új recept hozzáadása</BaseButton>
    </div>
  </div>
</template>

<script setup>
import BaseButton from '../components/ui/BaseButton.vue'
import { useRecipesStore } from '../stores/recipesStore'

const recipesStore = useRecipesStore()
</script>

<style scoped>
.bg {
  background-image: url('/src/assets/images/bgfood.jpg');
  background-size: cover;
}
</style>
