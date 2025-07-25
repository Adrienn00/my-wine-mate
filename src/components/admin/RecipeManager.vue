<template>
  <div class="p-8 bg-gray-900 rounded-xl shadow text-white">
    <h2 class="text-2xl font-semibold mb-6">Receptek kezelése</h2>

    <BaseButton variant="secondary" @click="startAdd">Új recept hozzáadása</BaseButton>

    <div v-if="isEditing" class="bg-gray-800 p-4 rounded mb-6 mt-4">
      <h3 class="text-xl mb-2">
        {{ editRecipe.id ? 'Recept szerkesztése' : 'Új recept hozzáadása' }}
      </h3>

      <BaseInput v-model="editRecipe.name" label="Név" />
      <BaseInput v-model="editRecipe.ingredients" label="Hozzávalók" />
      <BaseInput v-model="editRecipe.description" label="Leírás" />

      <div class="flex gap-2 mt-4">
        <BaseButton variant="secondary" @click="submitEdit">Mentés</BaseButton>
        <BaseButton variant="secondary" @click="cancelEdit">Mégse</BaseButton>
      </div>
    </div>

    <table class="w-full table-auto border-collapse text-left">
      <thead>
        <tr class="border-b border-gray-600 text-yellow-100">
          <th class="pb-2">Név</th>
          <th>Név</th>
          <th>Hozzávalók</th>
          <th>Leírás</th>
          <th>Műveletek</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="recipe in allRecipes" :key="recipe.id" class="border-b border-gray-700">
          <td class="py-2">{{ recipe.name }}</td>
          <td>{{ recipe.name }}</td>
          <td>{{ recipe.ingredients }}</td>
          <td>{{ recipe.description }}</td>
          <td class="space-x-2">
            <BaseButton variant="secondary" @click="startEdit(recipe)">Szerkesztés</BaseButton>
            <BaseButton variant="secondary" @click="deleteRecipe(recipe.id)">Törlés</BaseButton>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRecipesStore } from '../../stores/recipesStore'
import BaseInput from '../ui/BaseInput.vue'
import BaseButton from '../ui/BaseButton.vue'

const recipesStore = useRecipesStore()

const isEditing = ref(false)

const editRecipe = ref({
  name: '',
  ingredients: '',
  description: '',
})

const allRecipes = computed(() => recipesStore.recipes)

function startAdd() {
  isEditing.value = true
  editRecipe.value = {
    name: '',
    ingredients: '',
    description: '',
  }
}

function startEdit(recipe) {
  isEditing.value = true
  editRecipe.value = { ...recipe }
}

function cancelEdit() {
  isEditing.value = false
}

function submitEdit() {
  const { name, ingredients, description } = editRecipe.value

  if (
    !name?.toString().trim() ||
    !ingredients?.toString().trim() ||
    !description?.toString().trim()
  ) {
    alert('Kérlek, tölts ki minden mezőt!')
    return
  }

  if (editRecipe.value.id != null) {
    recipesStore.updateRecipes(editRecipe.value)
  } else {
    recipesStore.addNewRecipe({ ...editRecipe.value, is_confirmed: true })
  }

  isEditing.value = false
}

function deleteRecipe(id) {
  if (confirm('Biztosan törlöd ezt a receptet?')) {
    recipesStore.deleteRecipes(id)
  }
}
</script>
