import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useWinesStore } from './winesStore'

export const useProfileStore = defineStore('profile', () => {
  const user = ref({
    firstName: 'Keresztnév',
    lastName: 'Vezetéknév',
    email: 'borimado@example.com',
    phone: '071234567',
    location: 'Székelyudvarhely',
    postalCode: '535600',
    img: '',
  })

  const wineType = ref({
    wineTypes: ['Vörös', 'Fehér', 'Rozé', 'Pezsgő'],
    style: ['Száraz', 'Félszáraz', 'Félédes', 'Édes'],
    flavourProfile: ['Virágos', 'Földes', 'Gyümölcsös', 'Fűszeres', 'Egyéb'],
    regions: ['Tokaj', 'Villány', 'Eger', 'Sopron'],
    alcoholLevels: ['Alacsony', 'Közepes', 'Magas'],
    foodPreferences: ['Vegetáriánus', 'Vegán', 'Hal', 'Desszert', 'Húsos'],
    wineYears: [2023, 2022, 2021, 2020, 2019],
    priceRanges: ['0-50', '50-80', '80-130', '>130'],
  })
  const selectedPreferences = ref({
    wineTypes: [],
    style: [],
    flavourProfile: [],
    regions: [],
    alcoholLevels: [],
    foodPreferences: [],
    wineYears: '',
    priceRanges: [],
  })
  const keyMap = {
    wineTypes: 'type',
    style: 'style',
    flavourProfile: 'flavor',
    regions: 'region',
    alcoholLevels: 'alcohol',
    foodPreferences: 'food',
    wineYears: 'year',
    priceRanges: 'price',
  }
  const favorites = ref([])
  const wineStore = useWinesStore()

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
  function wineMatchesPreferences(wine, prefs, keyMap) {
    return Object.entries(prefs).every(([prefKey, selected]) => {
      const wineKey = keyMap[prefKey]
      if (!wineKey || !selected || (Array.isArray(selected) && selected.length === 0)) return true

      if (Array.isArray(selected)) {
        return selected.includes(wine[wineKey])
      }

      return wine[wineKey] === selected
    })
  }
  const recommendedWines = computed(() => {
    const wines = wineStore.wines
    const prefs = selectedPreferences.value
    return wines.filter((wine) => wineMatchesPreferences(wine, prefs, keyMap))
  })

  function setUser(newUser) {
    user.value = { ...user.value, ...newUser }
  }

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    user,
    wineType,
    selectedPreferences,
    recommendedWines,
    setUser,
  }
})
