<template>
  <div
    class="glass-panel mx-auto max-w-4xl rounded-2xl border border-[var(--line)] p-8 text-[var(--text-main)]"
  >
    <h2 class="mb-8 text-center text-3xl font-semibold">Recipes Awaiting Approval</h2>

    <div v-if="pendingRecipes.length === 0" class="text-center text-[var(--text-muted)]">
      There are no recipes awaiting approval.
    </div>

    <ul class="space-y-6">
      <li
        v-for="recipe in pendingRecipes"
        :key="recipe._id || recipe.id"
        class="rounded-xl border border-[var(--line)] bg-[rgba(255,251,246,0.9)] p-6 shadow-sm"
      >
        <div v-if="editId === (recipe._id || recipe.id)" class="space-y-4">
          <BaseInput
            id="name"
            v-model="editRecipe.name"
            label="Recipe name"
            placeholder="Recipe name"
          />
          <BaseInput
            id="ingredients"
            v-model="editRecipe.ingredientsInput"
            label="Ingredients"
            placeholder="Ingredients"
            textarea
          />
          <BaseInput
            id="instructions"
            v-model="editRecipe.instructionsInput"
            label="Instructions"
            placeholder="Steps on separate lines"
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
          <div class="flex space-x-4">
            <BaseButton variant="secondary" @click="saveEdit(recipe._id || recipe.id)">
              Save
            </BaseButton>
            <BaseButton variant="secondary" @click="cancelEdit"> Cancel </BaseButton>
          </div>
        </div>

        <div v-else class="flex justify-between items-start">
          <div>
            <h3 class="text-xl font-bold mb-2">{{ recipe.name }}</h3>
            <p><strong>Ingredients:</strong> {{ formatArray(recipe.ingredients) }}</p>
            <p><strong>Instructions:</strong> {{ formatArray(recipe.instructions) }}</p>
            <p><strong>Categories:</strong> {{ formatArray(recipe.recipeCategories) }}</p>
          </div>

          <div class="flex flex-col space-y-3">
            <BaseButton variant="secondary" @click="startEdit(recipe)"> Edit </BaseButton>
            <BaseButton variant="secondary" @click="approveRecipe(recipe._id || recipe.id)">
              Approve
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
import BaseMultiselect from '../ui/BaseMultiselect.vue'
import { useRecipesStore } from '../../stores/recipesStore'
import { RECIPE_DIET_CATEGORIES, asRecipeCategoryArray } from '../../services/recipeCategories'
const recipesStore = useRecipesStore()
const pendingRecipes = computed(() => recipesStore.pendingRecipes)
const recipeDietCategories = RECIPE_DIET_CATEGORIES

const editId = ref(null)
const editRecipe = ref({
  name: '',
  ingredientsInput: '',
  instructionsInput: '',
  recipeCategories: [],
})

async function approveRecipe(id) {
  await recipesStore.approveRecipe(id)
}

function startEdit(recipe) {
  editId.value = recipe._id || recipe.id
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

async function saveEdit(id) {
  const payload = {
    name: editRecipe.value.name,
    ingredients: editRecipe.value.ingredientsInput
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean),
    instructions: editRecipe.value.instructionsInput
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean),
    recipeCategories: asRecipeCategoryArray(editRecipe.value.recipeCategories),
  }
  await recipesStore.updateRecipe(id, payload)
  editId.value = null
}

function cancelEdit() {
  editId.value = null
}

function formatArray(value) {
  if (!value || value.length === 0) return '—'
  return Array.isArray(value) ? value.join(', ') : String(value)
}
</script>
