<template>
  <div class="p-8 bg-gray-900 rounded-xl shadow text-white">
    <h2 class="text-2xl font-semibold mb-6 text-yellow-100">Receptek kezelése</h2>

    <BaseButton variant="secondary" @click="startAdd" class="mb-6">Új recept hozzáadása</BaseButton>

    <div v-if="isEditing" class="bg-gray-800 p-6 rounded-lg mb-8 border border-gray-700">
      <h3 class="text-xl mb-4 text-orange-200">
        {{ editRecipe._id ? 'Recept szerkesztése' : 'Új recept hozzáadása' }}
      </h3>

      <div class="space-y-4">
        <BaseInput v-model="editRecipe.name" label="Név" />
        <BaseInput v-model="editRecipe.ingredients" label="Hozzávalók" />
        <BaseInput v-model="editRecipe.description" label="Leírás" />
      </div>

      <div class="flex gap-3 mt-6">
        <BaseButton variant="primary" @click="submitEdit">Mentés</BaseButton>
        <BaseButton variant="secondary" @click="cancelEdit">Mégse</BaseButton>
      </div>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full table-auto border-collapse text-left">
        <thead>
          <tr class="border-b border-gray-600 text-yellow-100 bg-gray-800">
            <th class="p-3">Név</th>
            <th class="p-3">Hozzávalók</th>
            <th class="p-3">Leírás</th>
            <th class="p-3 text-center">Műveletek</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="recipe in allRecipes"
            :key="recipe._id"
            class="border-b border-gray-800 hover:bg-gray-800/50"
          >
            <td class="p-3 font-semibold">{{ recipe.name }}</td>
            <td class="p-3 text-sm text-gray-300">{{ recipe.ingredients }}</td>
            <td class="p-3 text-sm text-gray-400 italic">{{ recipe.description }}</td>
            <td class="p-3">
              <div class="flex justify-center gap-2">
                <BaseButton variant="secondary" @click="startEdit(recipe)">Szerkesztés</BaseButton>
                <BaseButton variant="danger" @click="handleDelete(recipe._id)">Törlés</BaseButton>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="allRecipes.length === 0" class="p-10 text-center text-gray-500 italic">
        Nincsenek receptek az adatbázisban.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue' // onMounted kell a betöltéshez!
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

const allRecipes = computed(() => recipesStore.recipes || [])

// --- ADATOK BETÖLTÉSE ---
onMounted(async () => {
  await recipesStore.getAllRecipes()
})

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
  // MongoDB objektum másolása
  editRecipe.value = { ...recipe }
}

function cancelEdit() {
  isEditing.value = false
}

async function submitEdit() {
  const { name, ingredients, description } = editRecipe.value

  if (!name || !ingredients || !description) {
    alert('Kérlek, tölts ki minden mezőt!')
    return
  }

  try {
    if (editRecipe.value._id) {
      // Itt a store-ban kellene egy update funkció, ha nincs, hívd az add-ot
      console.log('Szerkesztés folyamatban...', editRecipe.value._id)
    } else {
      await recipesStore.addNewRecipe({ ...editRecipe.value, is_confirmed: true })
    }
    isEditing.value = false
    await recipesStore.getAllRecipes() // Lista frissítése mentés után
  } catch (err) {
    console.error('Mentési hiba:', err)
  }
}

// JAVÍTÁS: deleteRecipes helyett deleteRecipe
async function handleDelete(id) {
  if (!id) return
  if (confirm('Biztosan törlöd ezt a receptet?')) {
    const success = await recipesStore.deleteRecipe(id)
    if (success) {
      await recipesStore.getAllRecipes() // Frissítés törlés után
    } else {
      alert('Hiba történt a törlés során!')
    }
  }
}
</script>
