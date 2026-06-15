<template>
  <div v-if="wine" class="min-h-screen px-4 py-6 md:px-8 md:py-10">
    <main class="mx-auto w-full max-w-7xl">
      <div class="grid w-full min-w-0 gap-6 xl:grid-cols-[minmax(0,1.1fr)_380px]">
        <div
          class="dashboard-panel min-w-0 space-y-4 overflow-hidden rounded-xl p-6 text-left text-[var(--text-main)]"
        >
          <h3 class="text-3xl font-bold">{{ wine.name }}</h3>
          <p class="italic text-[var(--text-muted)]">{{ wine.winery }}</p>

          <div class="my-4 overflow-hidden rounded-2xl border border-[var(--line)] shadow-md">
            <img
              :src="wineImageFor(wine)"
              alt="Wine image"
              class="h-72 w-full object-cover"
            />
          </div>

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

          <div class="mt-6 flex flex-wrap gap-3">
            <BaseButton :to="backLink" variant="secondary">Back</BaseButton>
            <BaseButton v-if="profileStore.hasProfile" variant="secondary" @click="toggleFavorite">
              {{ isFavorite ? 'Remove from Favorites' : 'Add to Favorites' }}
            </BaseButton>
            <BaseButton v-if="profileStore.hasProfile" variant="secondary" @click="toggleShareForm">
              Share Wine
            </BaseButton>
          </div>

          <div v-if="showShareForm" class="mt-4">
            <p v-if="friendsLoading" class="text-sm text-[var(--text-muted)]">Loading friends...</p>
            <p v-else-if="!friends.length" class="text-sm text-[var(--text-muted)]">
              You have no friends added yet. Go to your
              <router-link to="/social" class="text-[var(--wine)] underline">Social page</router-link>
              to send a friend request.
            </p>
            <div v-else class="flex flex-wrap gap-2">
              <button
                v-for="f in friends"
                :key="f._id"
                class="friend-chip"
                :class="{ 'friend-chip--selected': shareTarget === f.username }"
                @click="shareTarget = f.username"
              >
                {{ f.username }}
              </button>
            </div>
            <div v-if="shareTarget" class="mt-3">
              <textarea
                v-model="shareNote"
                class="share-input w-full resize-none"
                rows="2"
                placeholder="Add a note... (optional)"
              />
            </div>
            <div v-if="friends.length" class="mt-2 flex items-center gap-2">
              <BaseButton variant="primary" :disabled="!shareTarget || shareLoading" @click="submitShare">
                {{ shareLoading ? 'Sending...' : shareTarget ? `Send to ${shareTarget}` : 'Select a friend' }}
              </BaseButton>
              <span v-if="shareMessage" :class="shareError ? 'text-[var(--danger)]' : 'text-green-600'" class="text-sm">
                {{ shareMessage }}
              </span>
            </div>
          </div>
        </div>

        <PairingRecommendationsPanel :wine-id="wineId" />
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { useProfileStore } from '../stores/profileStore'
import { useWinesStore } from '../stores/winesStore'
import BaseButton from '../components/ui/BaseButton.vue'
import RatingDisplay from '../components/RatingDisplay.vue'
import WineDetailedRatingForm from '../components/WineDetailedRatingForm.vue'
import WinePurchaseOptions from '../components/wine/WinePurchaseOptions.vue'
import PairingRecommendationsPanel from '../components/PairingRecommendationsPanel.vue'
import { WINE_RATING_CRITERIA, getOverallRatingValue } from '../services/wineRatingCriteria'
import { wineImageFor } from '../services/imageFallbacks'
import client from '../components/httpService/client'
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
    'pairing-browser': '/foodPairing',
  }
  return map[from]
})

const showShareForm = ref(false)
const shareTarget = ref('')
const shareLoading = ref(false)
const shareMessage = ref('')
const shareError = ref(false)
const friends = ref([])
const friendsLoading = ref(false)

async function toggleShareForm() {
  showShareForm.value = !showShareForm.value
  if (showShareForm.value && !friends.value.length && !friendsLoading.value) {
    friendsLoading.value = true
    try {
      friends.value = await client.get('social/friends')
    } catch {
      friends.value = []
    } finally {
      friendsLoading.value = false
    }
  }
}

async function submitShare() {
  const username = shareTarget.value.trim()
  if (!username) return
  shareLoading.value = true
  shareMessage.value = ''
  try {
    await client.post(`social/wines/${wineId.value}/share`, { toUsername: username })
    shareMessage.value = `Shared with ${username}!`
    shareError.value = false
    shareTarget.value = ''
  } catch (err) {
    shareMessage.value = err.message || 'Could not share wine.'
    shareError.value = true
  } finally {
    shareLoading.value = false
  }
}
</script>

<style scoped>
.share-input {
  border-radius: 0.65rem;
  border: 1px solid var(--line);
  background: var(--surface);
  color: var(--text-main);
  font-size: 0.9rem;
  padding: 0.5rem 0.8rem;
  outline: none;
  transition: 0.2s ease;
  min-height: 4.5rem;
  min-width: 180px;
}

.share-input:focus {
  border-color: var(--wine);
  box-shadow: 0 0 0 2px rgba(93, 31, 50, 0.12);
}

.friend-chip {
  border-radius: 999px;
  border: 1px solid var(--line);
  background: var(--surface);
  color: var(--text-main);
  font-size: 0.85rem;
  padding: 0.3rem 0.9rem;
  cursor: pointer;
  transition: 0.15s ease;
}

.friend-chip:hover {
  border-color: var(--wine);
  color: var(--wine);
}

.friend-chip--selected {
  border-color: var(--wine);
  background: var(--wine);
  color: white;
}
</style>
