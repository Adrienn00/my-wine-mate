<template>
  <div class="min-h-screen bg flex flex-col">
    <main class="flex flex-1 justify-start px-6 py-8 max-w-6xl mx-auto w-full">
      <div class="text-left bg-gray-800 text-yellow-100 p-6 rounded max-w-md w-full">
        <h3 class="text-2xl font-semibold mb-2">{{ wine.name }}</h3>
        <p><strong>Szőlőfajta: </strong>{{ wine.type }}</p>
        <p><strong>Stílus:</strong> {{ wine.style }}</p>
        <p><strong>Ár: </strong>{{ wine.price }}</p>
        <p><strong>Ízvilág: </strong>{{ wine.flavor }}</p>

        <div class="mt-6 space-y-4">
          <WineRating :rating="averageRating" :notes="comments" />
          <AddRatingForm @submit="handleNewRating" />
        </div>
        <div class="flex space-x-5 mt-6">
          <BaseButton to="/" variant="secondary">Vissza a találatokhoz</BaseButton>
          <BaseButton to="/foodPairing" variant="secondary">Étel ajánló</BaseButton>
          <BaseButton variant="secondary" @click="toggleFavorite">
            {{ isFavorite ? 'Eltávolítás a kedvencekből' : 'Kedvencekhez adom' }}
          </BaseButton>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useProfileStore } from '../stores/profileStore'
import { useWinesStore } from '../stores/winesStore'

import BaseButton from '../components/ui/BaseButton.vue'
import WineRating from '../components/WineRating.vue'
import AddRatingForm from '../components/AddRatingForm.vue'

const props = defineProps({
  wine: Object,
})

const route = useRoute()
const winesStore = useWinesStore()
const favoritesStore = useProfileStore()

const wine = computed(() => {
  if (props.wine) return props.wine
  return winesStore.getAllWines.find((w) => w.name === route.params.name)
})

const isFavorite = computed(() => favoritesStore.isFavorite(wine.value))

const averageRating = computed(() => {
  const ratings = wine.value?.ratings || []
  if (!ratings.length) return 0
  const total = ratings.reduce((sum, r) => sum + r.rating, 0)
  return (total / ratings.length).toFixed(1)
})

const comments = computed(() => {
  const ratings = wine.value?.ratings || []
  return ratings.map((r) => r.comment).filter(Boolean)
})

function handleNewRating({ rating, comment }) {
  winesStore.addRating(wine.value.name, rating, comment)
}

function toggleFavorite() {
  if (isFavorite.value) {
    favoritesStore.removeFavorite(wine.value)
  } else {
    favoritesStore.addFavorite(wine.value)
  }
}
</script>

<style scoped>
.bg {
  background-image: url('/home/adrienn/www/my-wine-mate/src/assets/images/bg.jpg');
  background-size: cover;
}
</style>
