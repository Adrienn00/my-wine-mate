import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import client from '../components/httpService/client'

export const useRecipesStore = defineStore('recipes', () => {
  const recipes = ref([])
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

  const pendingRecipes = computed(() => recipes.value.filter((r) => r && r.is_confirmed === false))
  const confirmedRecipes = computed(() => recipes.value.filter((r) => r && r.is_confirmed === true))

  async function getAllRecipes() {
    try {
      loading.value = true
      const response = await client.get('recipes')
      recipes.value = Array.isArray(response) ? response : (response?.data ?? [])
      return recipes.value
    } catch (err) {
      console.error('Error while loading recipes:', err)
      error.value = err.message
      recipes.value = []
      return []
    } finally {
      loading.value = false
    }
  }

  async function addNewRecipe(recipeData) {
    try {
      const newRecipe = await client.post('recipes', recipeData)
      recipes.value.push(newRecipe)
      return newRecipe
    } catch (err) {
      console.error('Error while saving recipe:', err)
      return null
    }
  }

  async function updateRecipe(id, recipeData) {
    try {
      const updatedRecipe = await client.put(`recipes/${id}`, recipeData)
      replaceRecipeInStore(id, updatedRecipe)
      return updatedRecipe
    } catch (err) {
      console.error('Error while updating recipe:', err)
      return null
    }
  }

  async function addRating(id, rating, comment) {
    try {
      const response = await client.post(`recipes/${id}/rating`, { rating, comment })
      replaceRecipeInStore(id, response)
      return response
    } catch (err) {
      console.error('Error while submitting rating:', err)
      return null
    }
  }

  async function approveRecipe(id) {
    try {
      const updatedRecipe = await client.put(`recipes/${id}`, { is_confirmed: true })
      replaceRecipeInStore(id, updatedRecipe)
      return updatedRecipe
    } catch (err) {
      console.error('Error while approving recipe:', err)
      return null
    }
  }

  async function deleteRecipe(id) {
    try {
      await client.delete(`recipes/${id}`)
      const index = recipes.value.findIndex((r) => r._id === id)
      if (index !== -1) {
        recipes.value.splice(index, 1)
      }
      return true
    } catch (err) {
      console.error('Error while deleting recipe:', err)
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
