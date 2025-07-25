<template>
  <div class="min-h-screen bg">
    <div class="flex items-center justify-between max-w-6xl mx-auto px-4 py-12">
      <div class="flex flex-col gap-y-5 w-100">
        <h1 class="text-center text-3xl md:text-5xl font-light mb-6 leading-snug text-yellow-100">
          Adj hozzá új receptet
        </h1>
        <div class="flex flex-col gap-y-5 max-w-md">
          <BaseInput id="recipeName" v-model="recipe.name" placeholder="Add meg a recept nevét" />

          <BaseInput
            id="ingredients"
            v-model="ingredientsInput"
            placeholder="Add meg a hozzávalókat, vesszővel elválasztva"
          />

          <textarea
            id="description"
            v-model="recipe.description"
            placeholder="Írd le a recept leírását"
            rows="4"
            class="p-2 rounded bg-gray-700 text-yellow-100 resize-none"
          ></textarea>

          <BaseButton variant="secondary" @click="submitRecipe">Recept hozzáadása</BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import BaseButton from '../components/ui/BaseButton.vue'
import BaseInput from '../components/ui/BaseInput.vue'
import { ref } from 'vue'
import { useRecipesStore } from '../stores/recipesStore'

const recipesStore = useRecipesStore()

const recipe = ref({
  name: '',
  ingredients: [],
  description: '',
})

const ingredientsInput = ref('')

function submitRecipe() {
  if (
    recipe.value.name.trim() !== '' &&
    ingredientsInput.value.trim() !== '' &&
    recipe.value.description.trim() !== ''
  ) {
    recipe.value.ingredients = ingredientsInput.value
      .split(',')
      .map((i) => i.trim())
      .filter(Boolean)

    recipesStore.addNewRecipe({ ...recipe.value })
    recipe.value = { name: '', ingredients: [], description: '' }
    ingredientsInput.value = ''

    alert('Sikeresen hozzáadva a recept!')
  } else {
    alert('Kérlek, tölts ki minden mezőt!')
  }
}
</script>

<style scoped>
.bg {
  background-image: url('/src/assets/images/bgfood.jpg');
  background-size: cover;
}
</style>
