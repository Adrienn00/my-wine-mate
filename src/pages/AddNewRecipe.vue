<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router' // Navigációhoz
import { useRecipesStore } from '../stores/recipesStore'
import BaseButton from '../components/ui/BaseButton.vue'
import BaseInput from '../components/ui/BaseInput.vue'

const recipesStore = useRecipesStore()
const router = useRouter()

const recipe = ref({
  name: '',
  description: '',
  ingredients: [],
  // Opcionálisan hozzáadhatod a többi mezőt a modell alapján:
  instructions: [],
  imageUrl: '',
})

const ingredientsInput = ref('')

async function submitRecipe() {
  // Alapvető validáció
  if (
    !recipe.value.name.trim() ||
    !ingredientsInput.value.trim() ||
    !recipe.value.description.trim()
  ) {
    alert('Kérlek, tölts ki minden mezőt!')
    return
  }

  // Hozzávalók feldolgozása tömbbé (ahogy a modell kéri)
  recipe.value.ingredients = ingredientsInput.value
    .split(',')
    .map((i) => i.trim())
    .filter(Boolean)

  try {
    // A store-on keresztül küldjük a backendnek
    const success = await recipesStore.addNewRecipe({ ...recipe.value })

    if (success) {
      alert('Recept sikeresen beküldve jóváhagyásra!')
      // Tisztítás
      recipe.value = { name: '', ingredients: [], description: '' }
      ingredientsInput.value = ''
      // Visszairányítás a listához
      router.push('/recipes')
    }
  } catch (error) {
    alert('Hiba történt a mentés során: ' + error.message)
  }
}
</script>
