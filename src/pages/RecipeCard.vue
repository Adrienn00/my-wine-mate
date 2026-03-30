<template>
  <div class="min-h-screen px-4 py-8 md:px-8 md:py-12">
    <main class="mx-auto flex w-full max-w-6xl flex-1 justify-start">
      <div v-if="loading" class="animate-pulse text-xl font-medium text-[var(--text-main)]">
        Recept betöltése...
      </div>

      <div
        v-else-if="currentRecipe"
        class="glass-panel w-full max-w-2xl rounded-2xl border border-[var(--line)] p-6 text-left text-[var(--text-main)] shadow-lg"
      >
        <h3 class="mb-4 text-3xl font-bold text-[var(--wine)]">{{ currentRecipe.name }}</h3>

        <div v-if="currentRecipe.ingredients && currentRecipe.ingredients.length" class="mb-4">
          <strong class="text-lg">Hozzávalók:</strong>
          <p class="mt-1 text-[var(--text-muted)]">
            {{
              Array.isArray(currentRecipe.ingredients)
                ? currentRecipe.ingredients.join(', ')
                : currentRecipe.ingredients
            }}
          </p>
        </div>

        <div class="mb-6">
          <strong class="mb-2 block border-b border-[var(--line)] pb-1 text-lg">Elkészítés:</strong>

          <div v-if="currentRecipe.instructions && currentRecipe.instructions.length">
            <ol
              v-if="Array.isArray(currentRecipe.instructions)"
              class="list-inside list-decimal space-y-2 text-[var(--text-muted)]"
            >
              <li
                v-for="(step, index) in currentRecipe.instructions"
                :key="index"
                class="leading-relaxed"
              >
                {{ step }}
              </li>
            </ol>
            <p v-else class="italic text-[var(--text-muted)]">{{ currentRecipe.instructions }}</p>
          </div>

          <p v-else class="italic text-[var(--text-muted)]">Nincs elkészítési útmutató megadva.</p>
        </div>

        <div class="mt-8 space-y-6 border-t border-[var(--line)] pt-6">
          <RatingDisplay :rating="Number(averageRating)" :notes="comments" />
          <AddRatingForm @submit="handleNewRating" />
        </div>

        <div class="mt-8 flex flex-wrap gap-3">
          <BaseButton to="/recipes" variant="secondary">Vissza</BaseButton>
          <BaseButton to="/foodpairing" variant="secondary">Bor ajánló</BaseButton>
          <BaseButton :variant="isFavorite ? 'primary' : 'secondary'" @click="toggleFavorite">
            {{ isFavorite ? 'Eltávolítás a kedvencekből' : 'Kedvencekhez adom' }}
          </BaseButton>
        </div>
      </div>

      <div
        v-else
        class="rounded-xl border border-[var(--line)] bg-[rgba(255,251,246,0.92)] p-6 text-[var(--danger)]"
      >
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
