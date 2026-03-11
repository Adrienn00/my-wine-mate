import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import client from '../components/httpService/client'
import { useAuthStore } from './authStore'

export const useProfileStore = defineStore('profile', () => {
  const auth = useAuthStore()

  const favoriteWines = ref([])
  const favoriteRecipes = ref([])
  const notifications = ref([])
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

  const loading = ref(false)
  const error = ref(null)

  const API_BASE = 'users'

  // --- Helper függvény ---
  const toId = (x) => (x && (x._id || x.id)) || x

  // --- PROFIL BETÖLTÉS ---
  async function fetchProfile() {
    if (!auth.token) return null
    loading.value = true
    try {
      const data = await client.get(`${API_BASE}/profile`)
      auth.user = data
      favoriteWines.value = data.favoriteWines || []
      favoriteRecipes.value = data.favoriteRecipes || []
      notifications.value = data.notifications || []
      const prefs = data.preferences || {}
      selectedPreferences.value = {
        wineTypes: prefs.wineTypes || [],
        style: prefs.style || [],
        flavourProfile: prefs.flavourProfile || [],
        regions: prefs.regions || [],
        alcoholLevels: prefs.alcoholLevels || [],
        foodPreferences: prefs.foodPreferences || [],
        wineYears: prefs.wineYears || '',
        priceRanges: prefs.priceRanges || [],
      }
      return data
    } catch (err) {
      console.error('Error fetching profile:', err)
      error.value = err.message
      return null
    } finally {
      loading.value = false
    }
  }

  // --- PROFIL FRISSÍTÉS ---
  async function updateProfile(updatedData) {
    console.log('UPDATE PROFILE payload:', updatedData)
    try {
      const updated = await client.put(`${API_BASE}/profile`, updatedData)
      auth.user = updated

      // SZINKRONIZÁLJUK a selectedPreferences-t is
      const prefs = updated.preferences || {}
      selectedPreferences.value = {
        wineTypes: prefs.wineTypes || [],
        style: prefs.style || [],
        flavourProfile: prefs.flavourProfile || [],
        regions: prefs.regions || [],
        alcoholLevels: prefs.alcoholLevels || [],
        foodPreferences: prefs.foodPreferences || [],
        wineYears: prefs.wineYears || '',
        priceRanges: prefs.priceRanges || [],
      }

      return updated
    } catch (err) {
      console.error('Error updating profile:', err)
      error.value = err.message
      return null
    }
  }

  // --- KEDVENC BOROK ---
  async function addFavoriteWine(wine) {
    try {
      const res = await client.post(`${API_BASE}/favorite/wines`, {
        wineId: toId(wine),
      })
      favoriteWines.value = res
      return res
    } catch (err) {
      console.error('Error adding favorite wine:', err)
      error.value = err.message
    }
  }

  async function removeFavoriteWine(wine) {
    try {
      const res = await client.delete(`${API_BASE}/favorite/wines/${toId(wine)}`)
      favoriteWines.value = res
      return res
    } catch (err) {
      console.error('Error removing favorite wine:', err)
      error.value = err.message
    }
  }

  // --- KEDVENC RECEPTEK ---
  async function addFavoriteRecipe(recipe) {
    try {
      const res = await client.post(`${API_BASE}/favorite/recipes`, {
        recipeId: toId(recipe),
      })
      favoriteRecipes.value = res
      return res
    } catch (err) {
      console.error('Error adding favorite recipe:', err)
      error.value = err.message
    }
  }

  async function removeFavoriteRecipe(recipe) {
    try {
      const res = await client.delete(`${API_BASE}/favorite/recipes/${toId(recipe)}`)
      favoriteRecipes.value = res
      return res
    } catch (err) {
      console.error('Error removing favorite recipe:', err)
      error.value = err.message
    }
  }

  // --- HELPER FUNKCIÓK ---
  function isFavoriteWine(wine) {
    const id = toId(wine)
    return favoriteWines.value.some((w) => toId(w).toString() === id.toString())
  }

  function isFavoriteRecipe(recipe) {
    const id = toId(recipe)
    return favoriteRecipes.value.some((r) => toId(r).toString() === id.toString())
  }

  const hasProfile = computed(() => !!auth.user)
  const fullName = computed(() =>
    auth.user ? `${auth.user.firstName || ''} ${auth.user.lastName || ''}`.trim() : ''
  )

  return {
    loading,
    error,
    favoriteWines,
    favoriteRecipes,
    notifications,
    selectedPreferences,
    wineType,
    hasProfile,
    fullName,

    fetchProfile,
    updateProfile,
    addFavoriteWine,
    removeFavoriteWine,
    addFavoriteRecipe,
    removeFavoriteRecipe,
    isFavoriteWine,
    isFavoriteRecipe,
  }
})
