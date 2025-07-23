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

  const favorites = ref([])

  function addFavorite(wine) {
    if (!favorites.value.find((w) => w.id === wine.id)) {
      favorites.value.push(wine)
    }
  }

  function removeFavorite(wine) {
    favorites.value = favorites.value.filter((w) => w.id !== wine.id)
  }

  function isFavorite(wine) {
    return favorites.value.some((w) => w.id === wine.id)
  }

  return { favorites, addFavorite, removeFavorite, isFavorite, user, wineType, selectedPreferences }
})
