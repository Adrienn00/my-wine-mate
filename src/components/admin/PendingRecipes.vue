<template>
  <div class="max-w-4xl mx-auto bg-gray-900 rounded-lg shadow-lg p-8 border-2 text-yellow-100">
    <h2 class="text-3xl font-semibold mb-8 text-center">Jóváhagyásra váró receptek</h2>

    <div v-if="pendingRecipes.length === 0" class="text-gray-400 text-center">
      Nincs jóváhagyásra váró recept.
    </div>

    <ul class="space-y-6">
      <li
        v-for="recipe in pendingRecipes"
        :key="recipe.id"
        class="bg-gray-800 p-6 rounded-lg shadow-md border"
      >
        <div v-if="editId === recipe.id" class="space-y-4">
          <BaseInput
            id="name"
            label="Recept neve"
            v-model="editRecipe.name"
            placeholder="Recept neve"
          />
          <BaseInput
            id="ingredients"
            label="Hozzavalok"
            v-model="editRecipe.ingredients"
            placeholder="Hozzavalok"
          />
          <BaseInput
            id="description"
            label="Leiras"
            v-model="editRecipe.description"
            placeholder="Leiras"
          />
          <div class="flex space-x-4">
            <BaseButton variant="secondary" @click="saveEdit(recipe.id)"> Mentés </BaseButton>
            <BaseButton variant="secondary" @click="cancelEdit"> Mégse </BaseButton>
          </div>
        </div>

        <div v-else class="flex justify-between items-start">
          <div>
            <h3 class="text-xl font-bold mb-2">{{ recipe.name }}</h3>
            <p><strong>Hozzavalok:</strong> {{ recipe.ingredients }}</p>
            <p><strong>Leiras:</strong> {{ recipe.description }}</p>
          </div>

          <div class="flex flex-col space-y-3">
            <BaseButton variant="secondary" @click="startEdit(recipe)"> Szerkesztés </BaseButton>
            <BaseButton variant="secondary" @click="approveRecipe(recipe.id)">
              Jóváhagyás
            </BaseButton>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import BaseInput from '../ui/BaseInput.vue'
import BaseButton from '../ui/BaseButton.vue'
import { useRecipesStore } from '../../stores/recipesStore'
const recipesStore = useRecipesStore()
const pendingRecipes = computed(() => recipesStore.pendingRecipes)

const editId = ref(null)
const editRecipe = ref({
  name: '',
  ingredients: '',
  description: '',
})

function approveRecipe(id) {
  recipesStore.approveRecipe(id)
}

function startEdit(recipe) {
  editId.value = recipe.id
  Object.assign(editRecipe.value, recipe)
}

function saveEdit(id) {
  const recipe = recipesStore.recipes.find((r) => r.id === id)
  if (recipe) {
    recipe.name = editRecipe.value.name
    recipe.ingredients = editRecipe.value.ingredients
    recipe.description = editRecipe.value.description
  }
  editId.value = null
}

function cancelEdit() {
  editId.value = null
}
</script>
