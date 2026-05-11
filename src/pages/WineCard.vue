<template>
  <div v-if="wine" class="min-h-screen px-4 py-8 md:px-8 md:py-12">
    <main class="mx-auto flex w-full max-w-6xl justify-start">
      <div
        class="dashboard-panel w-full max-w-2xl space-y-4 rounded-xl p-6 text-left text-[var(--text-main)]"
      >
        <h3 class="text-3xl font-bold">{{ wine.name }}</h3>
        <p class="italic text-[var(--text-muted)]">{{ wine.winery }}</p>

        <img
          v-if="wine.imageUrl"
          :src="wine.imageUrl"
          alt="Wine image"
          class="my-4 w-full max-w-sm rounded-lg border border-[var(--line)] shadow-md"
        />

        <p><strong>Description:</strong> {{ wine.description }}</p>
        <p><strong>Grape varieties:</strong> {{ wine.grapeVarieties?.join(', ') }}</p>
        <p><strong>Style:</strong> {{ wine.style }}</p>
        <p><strong>Vintage:</strong> {{ wine.year }}</p>
        <p><strong>Alcohol:</strong> {{ wine.alcohol }}%</p>
        <p><strong>Price range:</strong> {{ wine.priceRange }}</p>
        <p><strong>Flavor profile:</strong> {{ wine.flavorProfiles?.join(', ') }}</p>
        <p><strong>Origin:</strong> {{ wine.origin?.country }}, {{ wine.origin?.region }}</p>
        <p><strong>Tags:</strong> {{ wine.tags?.join(', ') }}</p>
        <p><strong>Food pairing hints:</strong> {{ wine.foodPairingHints?.join(', ') }}</p>

        <WinePurchaseOptions :wine="wine" :wine-id="wineId" :is-logged-in="isLoggedIn" />

        <div class="mt-6 space-y-3">
          <details
            class="rounded-xl border border-[var(--line)] bg-white p-2"
            open
          >
            <summary
              class="cursor-pointer select-none px-2 py-1 text-sm font-semibold text-[var(--text-main)]"
            >
              Community Ratings
            </summary>
            <div class="px-2 pb-2 pt-3">
              <RatingDisplay
                :rating="averageRating"
                :notes="comments"
                :comment-entries="commentEntries"
                :criteria-averages="criteriaAverages"
                :criteria-labels="ratingCriteriaLabels"
                :is-admin="isAdmin"
                @delete-comment="handleDeleteComment"
              />
            </div>
          </details>

          <details class="rounded-xl border border-[var(--line)] bg-white p-2">
            <summary
              class="cursor-pointer select-none px-2 py-1 text-sm font-semibold text-[var(--text-main)]"
            >
              Write a New Review
            </summary>
            <div class="px-2 pb-2 pt-3">
              <WineDetailedRatingForm v-if="profileStore.hasProfile" @submit="handleNewRating" />

              <p v-if="!profileStore.hasProfile" class="italic text-[var(--text-muted)]">
                To leave a review,
                <router-link to="/login" class="text-[var(--wine)] underline"> log in </router-link
                >.
              </p>
            </div>
          </details>
        </div>

        <div class="mt-6 flex space-x-5">
          <BaseButton :to="backLink" variant="secondary">Back</BaseButton>
          <BaseButton :to="`/foodPairing?wineId=${wine._id}`" variant="secondary">
            Food Pairing
          </BaseButton>
          <BaseButton v-if="profileStore.hasProfile" variant="secondary" @click="toggleFavorite">
            {{ isFavorite ? 'Remove from Favorites' : 'Add to Favorites' }}
          </BaseButton>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { useProfileStore } from '../stores/profileStore'
import { useWinesStore } from '../stores/winesStore'
import BaseButton from '../components/ui/BaseButton.vue'
import RatingDisplay from '../components/RatingDisplay.vue'
import WineDetailedRatingForm from '../components/WineDetailedRatingForm.vue'
import WinePurchaseOptions from '../components/wine/WinePurchaseOptions.vue'
import { WINE_RATING_CRITERIA, getOverallRatingValue } from '../services/wineRatingCriteria'
const props = defineProps({
  wine: {
    type: Object,
    default: null,
  },
})

const route = useRoute()
const authStore = useAuthStore()
const winesStore = useWinesStore()
const profileStore = useProfileStore()
const wine = computed(() => {
  if (props.wine) return props.wine

  const id = route.params.id
  return winesStore.wines.find((w) => w._id === id)
})

const wineId = computed(() => {
  return wine.value?._id || props.wine?._id || route.params.id
})
const isLoggedIn = computed(() => Boolean(authStore.token))
const isAdmin = computed(() => Boolean(authStore.user?.isAdmin))

const isFavorite = computed(() => profileStore.isFavoriteWine(wine.value))

const averageRating = computed(() => {
  const ratings = wine.value?.ratings || []

  if (!ratings.length) return 0

  const total = ratings.reduce((sum, r) => {
    const rating = getOverallRatingValue(r)
    return sum + (isNaN(rating) ? 0 : rating)
  }, 0)

  const avg = total / ratings.length

  return isNaN(avg) ? 0 : Number(avg.toFixed(1))
})

const criteriaAverages = computed(() => {
  const ratings = wine.value?.ratings || []
  const output = {}

  for (const criterion of WINE_RATING_CRITERIA) {
    const values = ratings
      .map((entry) => Number(entry?.criteria?.[criterion.key]))
      .filter((value) => Number.isFinite(value))

    if (!values.length) continue

    const average = values.reduce((sum, value) => sum + value, 0) / values.length
    output[criterion.key] = Number(average.toFixed(1))
  }

  return output
})

const ratingCriteriaLabels = computed(() => {
  return WINE_RATING_CRITERIA.reduce((acc, criterion) => {
    acc[criterion.key] = criterion.label
    return acc
  }, {})
})

const comments = computed(() => {
  const ratings = wine.value?.ratings || []
  return ratings.map((r) => r.comment).filter(Boolean)
})

const commentEntries = computed(() => {
  const ratings = wine.value?.ratings || []
  return ratings
    .filter((r) => String(r?.comment || '').trim())
    .map((r) => ({
      id: String(r?.ratingId || r?._id || '').trim(),
      text: String(r.comment || '').trim(),
      author: String(r?.userName || '').trim() || 'Anonymous',
      createdAt: r?.createdAt || null,
    }))
})

onMounted(async () => {
  await winesStore.getAllWines()
})

async function handleNewRating({ criteria, comment }) {
  try {
    await winesStore.addRating(wine.value._id, { criteria, comment })
  } catch (error) {
    console.error(error)
  }
}

async function handleDeleteComment(entry) {
  if (!isAdmin.value || !entry?.id || !wine.value?._id) return
  const ok = window.confirm('Are you sure you want to delete this comment?')
  if (!ok) return

  try {
    await winesStore.deleteRating(wine.value._id, entry.id)
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
