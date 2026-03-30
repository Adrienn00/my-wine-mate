<template>
  <div
    class="rounded-xl border border-[var(--line)] bg-[rgba(255,248,239,0.82)] p-8 text-[var(--text-main)] shadow-sm"
  >
    <h2 class="mb-6 text-2xl font-semibold">Receptek kezelése</h2>

    <BaseButton class="mb-6" variant="secondary" @click="startAdd">Új recept hozzáadása</BaseButton>

    <div
      v-if="isEditing"
      class="mb-8 rounded-lg border border-[var(--line)] bg-[rgba(255,251,246,0.9)] p-6"
    >
      <h3 class="mb-4 text-xl text-[var(--wine)]">
        {{ editRecipe._id ? 'Recept szerkesztése' : 'Új recept hozzáadása' }}
      </h3>

      <div class="space-y-4">
        <BaseInput v-model="editRecipe.name" label="Név" />
        <BaseInput v-model="editRecipe.ingredients" label="Hozzávalók" />
        <BaseInput v-model="editRecipe.description" label="Leírás" />
      </div>

      <div class="mt-6 flex gap-3">
        <BaseButton variant="primary" @click="submitEdit">Mentés</BaseButton>
        <BaseButton variant="secondary" @click="cancelEdit">Mégse</BaseButton>
      </div>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full table-auto border-collapse text-left">
        <thead>
          <tr
            class="border-b border-[var(--line)] bg-[rgba(255,251,246,0.95)] text-[var(--text-main)]"
          >
            <th class="p-3">Név</th>
            <th class="p-3">Hozzávalók</th>
            <th class="p-3">Leírás</th>
            <th class="p-3 text-center">Műveletek</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="recipe in paginatedRecipes"
            :key="recipe._id"
            class="border-b border-[var(--line)] hover:bg-[rgba(237,215,212,0.28)]"
          >
            <td class="p-3 font-semibold">{{ recipe.name }}</td>
            <td class="p-3 text-sm text-[var(--text-muted)]">{{ recipe.ingredients }}</td>
            <td class="p-3 text-sm italic text-[var(--text-muted)]">{{ recipe.description }}</td>
            <td class="p-3">
              <div class="flex justify-center gap-2">
                <BaseButton variant="secondary" @click="startEdit(recipe)">Szerkesztés</BaseButton>
                <BaseButton variant="danger" @click="handleDelete(recipe._id)">Törlés</BaseButton>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="allRecipes.length === 0" class="p-10 text-center italic text-[var(--text-muted)]">
        Nincsenek receptek az adatbázisban.
      </div>

      <div v-if="allRecipes.length > pageSize" class="mt-6 flex items-center justify-center gap-4">
        <button class="pager-btn" :disabled="currentPage === 1" @click="currentPage--">←</button>
        <span class="text-sm text-[var(--text-muted)]">{{ currentPage }} / {{ totalPages }}</span>
        <button class="pager-btn" :disabled="currentPage === totalPages" @click="currentPage++">
          →
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue' // onMounted kell a betöltéshez!
import { useRecipesStore } from '../../stores/recipesStore'
import BaseInput from '../ui/BaseInput.vue'
import BaseButton from '../ui/BaseButton.vue'

const recipesStore = useRecipesStore()

const isEditing = ref(false)
const currentPage = ref(1)
const pageSize = 10
const editRecipe = ref({
  name: '',
  ingredients: '',
  description: '',
})

const allRecipes = computed(() => recipesStore.recipes || [])
const totalPages = computed(() => Math.max(1, Math.ceil(allRecipes.value.length / pageSize)))
const paginatedRecipes = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return allRecipes.value.slice(start, start + pageSize)
})

// --- ADATOK BETÖLTÉSE ---
onMounted(async () => {
  await recipesStore.getAllRecipes()
})

watch(allRecipes, () => {
  currentPage.value = 1
})

watch(totalPages, (nextTotal) => {
  if (currentPage.value > nextTotal) {
    currentPage.value = nextTotal
  }
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
      alert('A recept szerkesztése még nincs implementálva.')
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

<style scoped>
.pager-btn {
  border-radius: 0.75rem;
  border: 1px solid var(--line);
  background: rgba(255, 251, 246, 0.94);
  color: var(--text-main);
  padding: 0.35rem 0.8rem;
  font-size: 0.875rem;
  transition: 0.2s ease;
}

.pager-btn:hover:enabled {
  border-color: var(--accent);
  background: rgba(237, 215, 212, 0.52);
}

.pager-btn:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}
</style>
