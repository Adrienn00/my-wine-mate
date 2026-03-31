import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import client from '../components/httpService/client' // A backend hívásokhoz használt kliens

export const useRecipesStore = defineStore('recipes', () => {
  const recipes = ref([]) // Üres tömbbel indulunk, az adatokat a backendtől kérjük le
  const loading = ref(false)
  const error = ref(null)

  const replaceRecipeInStore = (id, nextRecipe) => {
    const index = recipes.value.findIndex(
      (recipe) => recipe && (recipe._id === id || recipe.id === id)
    )
    if (index !== -1) {
      recipes.value[index] = nextRecipe
      return
    }
    recipes.value.push(nextRecipe)
  }

  // --- SZŰRT LISTÁK (A WineStore mintájára) ---
  const pendingRecipes = computed(() => recipes.value.filter((r) => r && r.is_confirmed === false))
  const confirmedRecipes = computed(() => recipes.value.filter((r) => r && r.is_confirmed === true))

  // --- ÖSSZES RECEPT LEKÉRÉSE ---
  async function getAllRecipes() {
    try {
      loading.value = true
      const response = await client.get('recipes') // Meghívja a backend GET /recipes útvonalát [cite: 163]
      recipes.value = Array.isArray(response) ? response : (response?.data ?? [])
      return recipes.value
    } catch (err) {
      console.error('Hiba a receptek betöltésekor:', err)
      error.value = err.message
      recipes.value = []
      return []
    } finally {
      loading.value = false
    }
  }

  // --- ÚJ RECEPT HOZZÁADÁSA ---
  async function addNewRecipe(recipeData) {
    try {
      // Beküldi az adatokat a backend POST /recipes útvonalára [cite: 163]
      const newRecipe = await client.post('recipes', recipeData)
      recipes.value.push(newRecipe)
      return newRecipe
    } catch (err) {
      console.error('Hiba a recept mentésekor:', err)
      return null
    }
  }

  async function updateRecipe(id, recipeData) {
    try {
      const updatedRecipe = await client.put(`recipes/${id}`, recipeData)
      replaceRecipeInStore(id, updatedRecipe)
      return updatedRecipe
    } catch (err) {
      console.error('Hiba a recept frissítésekor:', err)
      return null
    }
  }

  // --- ÉRTÉKELÉS HOZZÁADÁSA ---
  async function addRating(id, rating, comment) {
    try {
      // Backend: POST /recipes/:id/rating [cite: 163]
      const response = await client.post(`recipes/${id}/rating`, { rating, comment })
      replaceRecipeInStore(id, response)
      return response
    } catch (err) {
      console.error('Hiba az értékelés küldésekor:', err)
      return null
    }
  }

  // --- ADMIN: JÓVÁHAGYÁS ---
  async function approveRecipe(id) {
    try {
      // Backend: PUT /recipes/:id (is_confirmed: true) [cite: 163]
      const updatedRecipe = await client.put(`recipes/${id}`, { is_confirmed: true })
      replaceRecipeInStore(id, updatedRecipe)
      return updatedRecipe
    } catch (err) {
      console.error('Hiba a jóváhagyáskor:', err)
      return null
    }
  }

  // --- ADMIN: ELUTASÍTÁS (TÖRLÉS VAGY REJECT) ---
  async function deleteRecipe(id) {
    try {
      // Backend: DELETE /recipes/:id [cite: 163]
      await client.delete(`recipes/${id}`)
      const index = recipes.value.findIndex((r) => r._id === id)
      if (index !== -1) {
        recipes.value.splice(index, 1)
      }
      return true
    } catch (err) {
      console.error('Hiba a törléskor:', err)
      return false
    }
  }

  return {
    recipes,
    loading,
    error,
    confirmedRecipes,
    pendingRecipes,
    getAllRecipes,
    addNewRecipe,
    updateRecipe,
    addRating,
    approveRecipe,
    deleteRecipe,
  }
})
