<template>
  <div class="min-h-screen px-4 py-8 md:px-8 md:py-12">
    <section
      class="glass-panel mx-auto max-w-3xl rounded-2xl border border-[var(--line)] p-6 text-[var(--text-main)] shadow-lg md:p-8"
    >
      <div class="mb-6 flex items-center justify-between gap-4">
        <h1 class="text-3xl font-semibold md:text-4xl">Új recept beküldése</h1>
        <BaseButton to="/recipes" variant="secondary">Vissza</BaseButton>
      </div>

      <div class="space-y-4">
        <BaseInput v-model="recipe.name" label="Recept neve" placeholder="Pl. Gombás rizottó" />

        <BaseInput
          v-model="ingredientsInput"
          label="Hozzávalók"
          placeholder="Pl. rizs, gomba, vaj, parmezán"
          textarea
        />

        <BaseInput
          v-model="instructionsInput"
          label="Elkészítés"
          placeholder="Írd a lépéseket külön sorokba."
          textarea
        />

        <div>
          <label class="mb-1.5 block text-sm font-medium text-[var(--text-muted)]">
            Recept kategóriák
          </label>
          <BaseMultiselect
            v-model="recipe.recipeCategories"
            :options="recipeDietCategories"
            :multiple="true"
            placeholder="Válaszd ki a recept kategóriáit"
          />
        </div>
      </div>

      <div class="mt-8 flex flex-wrap gap-3">
        <BaseButton variant="primary" @click="submitRecipe">Beküldés</BaseButton>
        <BaseButton variant="secondary" to="/recipes">Mégse</BaseButton>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useRecipesStore } from '../stores/recipesStore'
import { RECIPE_DIET_CATEGORIES } from '../services/recipeCategories'
import BaseButton from '../components/ui/BaseButton.vue'
import BaseInput from '../components/ui/BaseInput.vue'
import BaseMultiselect from '../components/ui/BaseMultiselect.vue'

const recipesStore = useRecipesStore()
const router = useRouter()
const recipeDietCategories = RECIPE_DIET_CATEGORIES

const initialRecipe = () => ({
  name: '',
  ingredients: [],
  instructions: [],
  imageUrl: '',
  recipeCategories: [],
})

const recipe = ref(initialRecipe())
const ingredientsInput = ref('')
const instructionsInput = ref('')

async function submitRecipe() {
  if (
    !recipe.value.name.trim() ||
    !ingredientsInput.value.trim() ||
    !instructionsInput.value.trim()
  ) {
    alert('Kérlek, tölts ki minden kötelező mezőt!')
    return
  }

  const payload = {
    ...recipe.value,
    ingredients: ingredientsInput.value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean),
    instructions: instructionsInput.value
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean),
  }

  try {
    const success = await recipesStore.addNewRecipe(payload)

    if (success) {
      alert('Recept sikeresen beküldve jóváhagyásra!')
      recipe.value = initialRecipe()
      ingredientsInput.value = ''
      instructionsInput.value = ''
      router.push('/recipes')
    }
  } catch (error) {
    alert(`Hiba történt a mentés során: ${error.message}`)
  }
}
</script>
