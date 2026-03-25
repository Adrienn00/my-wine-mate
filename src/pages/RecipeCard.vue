<template>
  <div class="min-h-screen bg flex flex-col">
    <main class="flex flex-1 justify-start px-6 py-8 max-w-6xl mx-auto w-full">
      <div v-if="loading" class="text-yellow-100 animate-pulse text-xl">Recept betöltése...</div>

      <div
        v-else-if="currentRecipe"
        class="text-left bg-gray-800 text-yellow-100 p-6 rounded-xl shadow-2xl max-w-md w-full border border-gray-700"
      >
        <h3 class="text-3xl font-bold mb-4 text-orange-200">{{ currentRecipe.name }}</h3>

        <div v-if="currentRecipe.ingredients && currentRecipe.ingredients.length" class="mb-4">
          <strong class="text-lg">Hozzávalók:</strong>
          <p class="text-gray-300 mt-1">
            {{
              Array.isArray(currentRecipe.ingredients)
                ? currentRecipe.ingredients.join(', ')
                : currentRecipe.ingredients
            }}
          </p>
        </div>

        <div class="mb-6">
          <strong class="text-lg block mb-2 border-b border-gray-600 pb-1">Elkészítés:</strong>

          <div v-if="currentRecipe.instructions && currentRecipe.instructions.length">
            <ol
              v-if="Array.isArray(currentRecipe.instructions)"
              class="list-decimal list-inside space-y-2 text-gray-300"
            >
              <li
                v-for="(step, index) in currentRecipe.instructions"
                :key="index"
                class="leading-relaxed"
              >
                {{ step }}
              </li>
            </ol>
            <p v-else class="text-gray-300 italic">{{ currentRecipe.instructions }}</p>
          </div>

          <p v-else class="text-gray-500 italic">Nincs elkészítési útmutató megadva.</p>
        </div>

        <div class="mt-8 pt-6 border-t border-gray-700 space-y-6">
          <RatingDisplay :rating="Number(averageRating)" :notes="comments" />
          <AddRatingForm @submit="handleNewRating" />
        </div>

        <div class="flex flex-wrap gap-3 mt-8">
          <BaseButton to="/recipes" variant="secondary">Vissza</BaseButton>
          <BaseButton to="/foodpairing" variant="secondary">Bor ajánló</BaseButton>
          <BaseButton :variant="isFavorite ? 'primary' : 'secondary'" @click="toggleFavorite">
            {{ isFavorite ? 'Eltávolítás a kedvencekből' : 'Kedvencekhez adom' }}
          </BaseButton>
        </div>
      </div>

      <div v-else class="text-red-400 bg-gray-800 p-6 rounded">
        A recept nem található vagy hiba történt a betöltés közben.
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useProfileStore } from '../stores/profileStore'
import { useRecipesStore } from '../stores/recipesStore'
import client from '../components/httpService/client'

import BaseButton from '../components/ui/BaseButton.vue'
import RatingDisplay from '../components/RatingDisplay.vue'
import AddRatingForm from '../components/AddRatingForm.vue'

const props = defineProps({
  recipe: Object,
})

const route = useRoute()
const recipesStore = useRecipesStore()
const profileStore = useProfileStore()

const fetchedRecipe = ref(null)
const loading = ref(false)

// Kiszámított recept: props-ból (ha listából jövünk) vagy a lekérésből
const currentRecipe = computed(() => props.recipe || fetchedRecipe.value)

// Kedvencek kezelése
const isFavorite = computed(() => {
  return currentRecipe.value ? profileStore.isFavoriteRecipe(currentRecipe.value) : false
})

// Átlagos pontszám számítása
const averageRating = computed(() => {
  const ratings = currentRecipe.value?.ratings || []
  if (!ratings.length) return 0
  const total = ratings.reduce((sum, r) => sum + (Number(r.rating) || 0), 0)
  return (total / ratings.length).toFixed(1)
})

// Kommentek kigyűjtése
const comments = computed(() => {
  const ratings = currentRecipe.value?.ratings || []
  return ratings.map((r) => r.comment).filter(Boolean)
})

// Adatok betöltése az URL-ben lévő MongoDB ID alapján
onMounted(async () => {
  if (!props.recipe) {
    loading.value = true
    try {
      const id = route.params.id
      // Most már az /api/recipes/:id végponton kapjuk meg az adatot
      fetchedRecipe.value = await client.get(`recipes/${id}`)
    } catch (error) {
      console.error('Hiba a recept betöltésekor:', error)
    } finally {
      loading.value = false
    }
  }
})

// Új értékelés beküldése
async function handleNewRating({ rating, comment }) {
  if (!currentRecipe.value) return
  try {
    const updated = await recipesStore.addRating(currentRecipe.value._id, rating, comment)
    if (updated) fetchedRecipe.value = updated
  } catch (error) {
    console.error('Értékelési hiba:', error)
  }
}

// Kedvenc állapot váltása
function toggleFavorite() {
  if (!currentRecipe.value) return
  if (isFavorite.value) {
    profileStore.removeFavoriteRecipe(currentRecipe.value)
  } else {
    profileStore.addFavoriteRecipe(currentRecipe.value)
  }
}
</script>

<style scoped>
.bg {
  background-image: url('/src/assets/images/bgfood.jpg');
  background-size: cover;
  background-position: center;
}
</style>
