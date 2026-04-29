<template>
  <div
    class="rounded-xl border border-[var(--line)] bg-[rgba(255,248,239,0.82)] p-8 text-[var(--text-main)] shadow-sm"
  >
    <h2 class="mb-6 text-2xl font-semibold">Recipe Management</h2>

    <BaseButton class="mb-6" variant="secondary" @click="startAdd">Add New Recipe</BaseButton>

    <div
      v-if="isEditing"
      class="mb-8 rounded-lg border border-[var(--line)] bg-[rgba(255,251,246,0.9)] p-6"
    >
      <h3 class="mb-4 text-xl text-[var(--wine)]">
        {{ editRecipe._id ? 'Edit Recipe' : 'Add New Recipe' }}
      </h3>

      <div class="space-y-4">
        <BaseInput v-model="editRecipe.name" label="Name" />
        <BaseInput
          v-model="editRecipe.ingredientsInput"
          label="Ingredients"
          placeholder="Comma separated"
          textarea
        />
        <BaseInput
          v-model="editRecipe.instructionsInput"
          label="Instructions"
          placeholder="One step per line"
          textarea
        />
        <div>
          <label class="mb-1.5 block text-sm font-medium text-[var(--text-muted)]">
            Recipe categories
          </label>
          <BaseMultiselect
            v-model="editRecipe.recipeCategories"
            :options="recipeDietCategories"
            :multiple="true"
            placeholder="Select categories"
          />
        </div>
      </div>

      <div class="mt-6 flex gap-3">
        <BaseButton variant="primary" @click="submitEdit">Save</BaseButton>
        <BaseButton variant="secondary" @click="cancelEdit">Cancel</BaseButton>
      </div>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full table-auto border-collapse text-left">
        <thead>
          <tr
            class="border-b border-[var(--line)] bg-[rgba(255,251,246,0.95)] text-[var(--text-main)]"
          >
            <th class="p-3">Name</th>
            <th class="p-3">Ingredients</th>
            <th class="p-3">Instructions</th>
            <th class="p-3">Categories</th>
            <th class="p-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="recipe in paginatedRecipes"
            :key="recipe._id"
            class="border-b border-[var(--line)] hover:bg-[rgba(237,215,212,0.28)]"
          >
            <td class="p-3 font-semibold">{{ recipe.name }}</td>
            <td class="p-3 text-sm text-[var(--text-muted)]">
              {{ formatArray(recipe.ingredients) }}
            </td>
            <td class="p-3 text-sm italic text-[var(--text-muted)]">
              {{ formatArray(recipe.instructions) }}
            </td>
            <td class="p-3 text-sm text-[var(--text-muted)]">
              {{ formatArray(recipe.recipeCategories) }}
            </td>
            <td class="p-3">
              <div class="flex justify-center gap-2">
                <BaseButton variant="secondary" @click="startEdit(recipe)">Edit</BaseButton>
                <BaseButton variant="danger" @click="handleDelete(recipe._id)">Delete</BaseButton>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="allRecipes.length === 0" class="p-10 text-center italic text-[var(--text-muted)]">
        There are no recipes in the database.
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
import { ref, computed, onMounted, watch } from 'vue'
import { useRecipesStore } from '../../stores/recipesStore'
import { RECIPE_DIET_CATEGORIES, asRecipeCategoryArray } from '../../services/recipeCategories'
import BaseInput from '../ui/BaseInput.vue'
import BaseButton from '../ui/BaseButton.vue'
import BaseMultiselect from '../ui/BaseMultiselect.vue'

const recipesStore = useRecipesStore()
const recipeDietCategories = RECIPE_DIET_CATEGORIES

const isEditing = ref(false)
const currentPage = ref(1)
const pageSize = 10
const editRecipe = ref({
  name: '',
  ingredientsInput: '',
  instructionsInput: '',
  recipeCategories: [],
})

const allRecipes = computed(() => recipesStore.recipes || [])
const totalPages = computed(() => Math.max(1, Math.ceil(allRecipes.value.length / pageSize)))
const paginatedRecipes = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return allRecipes.value.slice(start, start + pageSize)
})

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
    ingredientsInput: '',
    instructionsInput: '',
    recipeCategories: [],
  }
}

function startEdit(recipe) {
  isEditing.value = true
  editRecipe.value = {
    ...recipe,
    ingredientsInput: Array.isArray(recipe.ingredients)
      ? recipe.ingredients.join(', ')
      : (recipe.ingredients ?? ''),
    instructionsInput: Array.isArray(recipe.instructions)
      ? recipe.instructions.join('\n')
      : (recipe.instructions ?? ''),
    recipeCategories: asRecipeCategoryArray(recipe.recipeCategories),
  }
}

function cancelEdit() {
  isEditing.value = false
}

async function submitEdit() {
  const { _id, name, ingredientsInput, instructionsInput, recipeCategories } = editRecipe.value

  if (!name || !ingredientsInput || !instructionsInput) {
    alert('Please fill in all fields.')
    return
  }

  const payload = {
    ...editRecipe.value,
    ingredients: ingredientsInput
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean),
    instructions: instructionsInput
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean),
    recipeCategories: asRecipeCategoryArray(recipeCategories),
    is_confirmed: true,
  }

  try {
    if (_id) {
      await recipesStore.updateRecipe(_id, payload)
    } else {
      await recipesStore.addNewRecipe(payload)
    }
    isEditing.value = false
    await recipesStore.getAllRecipes()
  } catch (err) {
    console.error('Save error:', err)
  }
}

async function handleDelete(id) {
  if (!id) return
  if (confirm('Are you sure you want to delete this recipe?')) {
    const success = await recipesStore.deleteRecipe(id)
    if (success) {
      await recipesStore.getAllRecipes()
    } else {
      alert('An error occurred while deleting the recipe.')
    }
  }
}

function formatArray(value) {
  if (!value || value.length === 0) return '—'
  return Array.isArray(value) ? value.join(', ') : String(value)
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
