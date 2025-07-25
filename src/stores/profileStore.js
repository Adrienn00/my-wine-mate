import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useProfileStore = defineStore('profile', () => {
  const user = ref({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    location: '',
    postalCode: '',
  })

  const wineType = ref({
    wineTypes: ['Vörös', 'Fehér', 'Rosé', 'Pezsgő'],
    flavourProfile: ['Száraz', 'Félédes', 'Gyümölcsös', 'Fűszeres'],
    regions: ['Tokaj', 'Villány', 'Eger', 'Sopron'],
    alcoholLevels: ['Alacsony', 'Közepes', 'Magas'],
    foodPreferences: ['Vegetáriánus', 'Vegán', 'Hal', 'Desszert', 'Húsos'],
    wineYears: [2023, 2022, 2021, 2020, 2019],
    priceRanges: ['0-50 Ron', '50-80 Ron', '80-130 Ron', '>130 Ron'],
  })
  const selectedPreferences = ref({
    wineTypes: [],
    flavourProfile: [],
    regions: [],
    alcoholLevels: '',
    foodPreferences: [],
    wineYears: '',
    priceRanges: '',
  })

  const favoriteWines = ref([])
  const favoriteRecipes = ref([])
  function addFavoriteWine(wine) {
    if (!favoriteWines.value.find((w) => w.id === wine.id)) {
      favoriteWines.value.push(wine)
    }
  }

  function removeFavoriteWine(wine) {
    favoriteWines.value = favoriteWines.value.filter((w) => w.id !== wine.id)
  }

  function addFavoriteRecipe(recipe) {
    if (!favoriteRecipes.value.find((r) => r.id === recipe.id)) {
      favoriteRecipes.value.push(recipe)
    }
  }

  function removeFavoriteRecipe(recipe) {
    favoriteRecipes.value = favoriteRecipes.value.filter((r) => r.id !== recipe.id)
  }

  function isFavoriteWine(wine) {
    return favoriteWines.value.some((w) => w.id === wine.id)
  }
  function isFavoriteRecipe(recipe) {
    return favoriteRecipes.value.some((r) => r.id === recipe.id)
  }

  return {
    favoriteWines,
    favoriteRecipes,
    addFavoriteRecipe,
    addFavoriteWine,
    removeFavoriteRecipe,
    removeFavoriteWine,
    user,
    wineType,
    selectedPreferences,
    isFavoriteRecipe,
    isFavoriteWine,
  }
})
