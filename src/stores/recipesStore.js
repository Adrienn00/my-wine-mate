import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useRecipesStore = defineStore('recipes', () => {
  const recipes = ref([
    {
      id: 0,
      name: 'Rántotta',
      ingredients: ['tojás', 'só', 'olaj'],
      description: 'A tojásokat felverjük, megsózzuk, és olajon megsütjük.',
      ratings: [],
      is_confirmed: true,
    },
    {
      id: 1,
      name: 'Tejfölös gombapaprikás',
      ingredients: ['gomba', 'hagyma', 'paprika', 'tejföl', 'só'],
      description:
        'A hagymát megdinszteljük, hozzáadjuk a paprikát, gombát, majd tejföllel sűrítjük.',
      ratings: [],
      is_confirmed: true,
    },
    {
      id: 2,
      name: 'Sajtos melegszendvics',
      ingredients: ['kenyér', 'vaj', 'sajt'],
      description: 'A kenyeret megvajazzuk, sajtot teszünk rá, és megsütjük.',
      ratings: [],
      is_confirmed: true,
    },
    {
      id: 3,
      name: 'Banánturmix',
      ingredients: ['banán', 'tej', 'méz'],
      description: 'Minden hozzávalót összeturmixolunk.',
      ratings: [],
      is_confirmed: true,
    },
    {
      id: 4,
      name: 'Paradicsomos tészta',
      ingredients: ['tészta', 'paradicsomszósz', 'fokhagyma', 'só'],
      description: 'A tésztát kifőzzük, majd paradicsomszósszal összeforgatjuk.',
      ratings: [],
      is_confirmed: true,
    },
  ])
  const nextId = ref(recipes.value.length)
  function addRating(recipeName, rating, comment) {
    const recipe = recipes.value.find((r) => r.name === recipeName)
    if (recipe) {
      recipe.ratings.push({ rating, comment })
    }
  }
  function getAllRecipes() {
    return recipes.value
  }

  function addNewRecipe(recipe) {
    const newRecipe = {
      id: nextId.value++,
      ...recipe,
      ratings: [],
      is_confirmed: recipe.is_confirmed ?? false,
    }
    recipes.value.push(newRecipe)
  }

  function approveRecipe(id) {
    const recipe = recipes.value.find((r) => r.id === id)
    if (recipe) recipe.is_confirmed = true
  }

  function rejectRecipe(id) {
    recipes.value = recipes.value.find((r) => r.id !== id)
  }

  const confirmedRecipes = computed(() => recipes.value.filter((r) => r.is_confirmed))
  const pendingRecipes = computed(() => recipes.value.filter((r) => !r.is_confirmed))

  function updateRecipes(updatedRecipes) {
    const index = recipes.value.findIndex((r) => r.id === updatedRecipes.id)
    if (index !== -1) {
      recipes.value[index] = { ...updatedRecipes, is_confirmed: true }
    }
  }

  function deleteRecipes(id) {
    const index = recipes.value.findIndex((w) => w.id === id)
    if (index !== -1) {
      recipes.value.splice(index, 1)
    }
  }

  return {
    recipes,
    addRating,
    addNewRecipe,
    approveRecipe,
    rejectRecipe,
    getAllRecipes,
    confirmedRecipes,
    pendingRecipes,
    updateRecipes,
    deleteRecipes,
  }
})
