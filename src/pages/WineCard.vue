<template>
  <div v-if="wine" class="min-h-screen px-4 py-8 md:px-8 md:py-12">
    <main class="mx-auto flex w-full max-w-6xl justify-start">
      <div
        class="glass-panel w-full max-w-2xl space-y-4 rounded-2xl border border-[var(--line)] p-6 text-left text-[var(--text-main)]"
      >
        <h3 class="text-3xl font-bold">{{ wine.name }}</h3>
        <p class="italic text-[var(--text-muted)]">{{ wine.winery }}</p>

        <img
          v-if="wine.imageUrl"
          :src="wine.imageUrl"
          alt="Wine image"
          class="my-4 w-full max-w-sm rounded-lg border border-[var(--line)] shadow-md"
        />

        <p><strong>Leírás:</strong> {{ wine.description }}</p>
        <p><strong>Szőlőfajta:</strong> {{ wine.grapeVarieties?.join(', ') }}</p>
        <p><strong>Stílus:</strong> {{ wine.style }}</p>
        <p><strong>Évjárat:</strong> {{ wine.year }}</p>
        <p><strong>Alkohol:</strong> {{ wine.alcohol }}%</p>
        <p><strong>Árkategória:</strong> {{ wine.priceRange }}</p>
        <p><strong>Ízvilág:</strong> {{ wine.flavorProfiles?.join(', ') }}</p>
        <p>
          <strong>Származási hely:</strong> {{ wine.origin?.country }}, {{ wine.origin?.region }}
        </p>
        <p><strong>Címkék:</strong> {{ wine.tags?.join(', ') }}</p>
        <p><strong>Ételpárosítási javaslatok:</strong> {{ wine.foodPairingHints?.join(', ') }}</p>

        <div class="mt-6 space-y-4">
          <RatingDisplay :rating="averageRating" :notes="comments" />

          <AddRatingForm v-if="profileStore.hasProfile" @submit="handleNewRating" />

          <p v-if="!profileStore.hasProfile" class="italic text-[var(--text-muted)]">
            Értékeléshez
            <router-link to="/login" class="text-[var(--wine)] underline">
              jelentkezz be </router-link
            >.
          </p>
        </div>

        <div class="mt-6 flex space-x-5">
          <BaseButton :to="backLink" variant="secondary">Vissza</BaseButton>
          <BaseButton to="/foodPairing" variant="secondary">Étel ajánló</BaseButton>
          <BaseButton v-if="profileStore.hasProfile" variant="secondary" @click="toggleFavorite">
            {{ isFavorite ? 'Eltávolítás a kedvencekből' : 'Kedvencekhez adom' }}
          </BaseButton>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useProfileStore } from '../stores/profileStore'
import { useWinesStore } from '../stores/winesStore'

import BaseButton from '../components/ui/BaseButton.vue'
import RatingDisplay from '../components/RatingDisplay.vue'
import AddRatingForm from '../components/AddRatingForm.vue'
onMounted(() => {
  winesStore.getAllWines()
})
const props = defineProps({
  wine: Object,
})

const route = useRoute()
const winesStore = useWinesStore()
const profileStore = useProfileStore()
const wine = computed(() => {
  if (props.wine) return props.wine

  const id = route.params.id
  return winesStore.wines.find((w) => w._id === id)
})

const isFavorite = computed(() => profileStore.isFavoriteWine(wine.value))

const averageRating = computed(() => {
  const ratings = wine.value?.ratings || []

  if (!ratings.length) return 0

  const total = ratings.reduce((sum, r) => {
    const rating = Number(r.rating)
    return sum + (isNaN(rating) ? 0 : rating)
  }, 0)

  const avg = total / ratings.length

  return isNaN(avg) ? 0 : avg.toFixed(1)
})

const comments = computed(() => {
  const ratings = wine.value?.ratings || []
  return ratings.map((r) => r.comment).filter(Boolean)
})

async function handleNewRating({ rating, comment }) {
  try {
    await winesStore.addRating(wine.value._id, rating, comment)
  } catch (error) {
    console.error(error)
  }
}

function toggleFavorite() {
  if (isFavorite.value) {
    profileStore.removeFavoriteWine(wine.value)
  } else {
    profileStore.addFavoriteWine(wine.value)
  }
}
const backLink = computed(() => {
  const from = route.query.from
  const map = {
    home: '/',
    favorites: '/favorite',
    recommended: '/recommended',
  }
  return map[from]
})
</script>
