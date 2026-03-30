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

        <section
          v-if="isLoggedIn && purchaseLinks.length"
          class="rounded-xl border border-[var(--line)] p-4"
        >
          <h4 class="text-lg font-semibold">Vásárlási lehetőségek</h4>
          <p class="mt-1 text-sm text-[var(--text-muted)]">{{ purchaseIntroText }}</p>

          <div class="shop-strip mt-3">
            <article
              v-for="(option, idx) in purchaseLinks"
              :key="`${option.shopName}-${option.url}-${idx}`"
              class="shop-card"
            >
              <p v-if="hasStoredPrices && idx === 0" class="shop-chip">Legjobb ár</p>
              <div>
                <p class="font-semibold leading-tight">
                  {{ option.shopName || 'Ismeretlen bolt' }}
                </p>
                <p class="text-sm text-[var(--text-muted)]">
                  {{ formatPurchasePrice(option) }}
                </p>
              </div>
              <a
                v-if="option.url"
                :href="option.url"
                target="_blank"
                rel="noopener noreferrer"
                class="buy-link-btn mt-3 inline-flex"
              >
                Megnézem
              </a>
            </article>
          </div>
        </section>

        <section v-else-if="!isLoggedIn" class="rounded-xl border border-[var(--line)] p-4">
          <h4 class="text-lg font-semibold">Vásárlási lehetőségek</h4>
          <p class="mt-1 text-sm text-[var(--text-muted)]">
            Ehhez a funkcióhoz jelentkezz be vagy regisztrálj.
          </p>
          <div class="mt-3 flex flex-wrap gap-2">
            <BaseButton to="/login" variant="secondary">Bejelentkezés</BaseButton>
            <BaseButton to="/signup" variant="secondary">Regisztráció</BaseButton>
          </div>
        </section>

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
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { useProfileStore } from '../stores/profileStore'
import { useWinesStore } from '../stores/winesStore'
import client from '../components/httpService/client'

import BaseButton from '../components/ui/BaseButton.vue'
import RatingDisplay from '../components/RatingDisplay.vue'
import AddRatingForm from '../components/AddRatingForm.vue'
const props = defineProps({
  wine: Object,
})

const route = useRoute()
const authStore = useAuthStore()
const winesStore = useWinesStore()
const profileStore = useProfileStore()
const liveOffers = ref([])
const liveOffersSource = ref('')
const wine = computed(() => {
  if (props.wine) return props.wine

  const id = route.params.id
  return winesStore.wines.find((w) => w._id === id)
})

const wineId = computed(() => {
  return wine.value?._id || props.wine?._id || route.params.id
})
const isLoggedIn = computed(() => Boolean(authStore.token))

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

const sortedPurchaseOptions = computed(() => {
  const options = wine.value?.purchaseOptions || []
  return [...options].sort((a, b) => {
    const priceA = Number(a?.price)
    const priceB = Number(b?.price)
    const validA = Number.isFinite(priceA)
    const validB = Number.isFinite(priceB)
    if (validA && validB) return priceA - priceB
    if (validA) return -1
    if (validB) return 1
    return 0
  })
})

const generatedPurchaseLinks = computed(() => {
  const query = [wine.value?.name, wine.value?.winery].filter(Boolean).join(' ')
  if (!query) return []
  const q = encodeURIComponent(query)
  return [
    {
      shopName: 'Árukereső',
      url: `https://www.arukereso.hu/?st=${q}`,
      note: 'Gyors árösszehasonlítás',
    },
    {
      shopName: 'Google Shopping',
      url: `https://www.google.com/search?tbm=shop&q=${q}`,
      note: 'Webshop találatok',
    },
    {
      shopName: 'Wine-Searcher',
      url: `https://www.wine-searcher.com/find/${q}`,
      note: 'Nemzetközi kínálat',
    },
    {
      shopName: 'Vivino',
      url: `https://www.vivino.com/search/wines?q=${q}`,
      note: 'Értékelések és boltok',
    },
  ]
})

const purchaseLinks = computed(() => {
  if (liveOffers.value.length) return liveOffers.value
  const stored = sortedPurchaseOptions.value.filter((option) => option?.url)
  return stored.length ? stored : generatedPurchaseLinks.value
})

const hasStoredPrices = computed(() => sortedPurchaseOptions.value.some((option) => option?.url))

const purchaseIntroText = computed(() => {
  if (liveOffers.value.length && liveOffersSource.value === 'serpapi') {
    return 'Automatikusan betöltött élő webshop találatok.'
  }
  if (liveOffers.value.length && liveOffersSource.value === 'fallback') {
    return 'Élő árforrás nélkül jelenleg kereső linkeket mutatunk.'
  }
  return sortedPurchaseOptions.value.filter((option) => option?.url).length
    ? 'Ár szerint rendezve (legolcsóbb elöl).'
    : 'Automatikusan generált vásárlási linkek a bor neve alapján.'
})

onMounted(async () => {
  await winesStore.getAllWines()
  await fetchLiveOffers()
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

function formatPurchasePrice(option) {
  const price = Number(option?.price)
  if (!Number.isFinite(price)) return option?.note || 'Ár: nincs megadva'
  const currency = option?.currency || 'RON'
  return `Ár: ${Math.round(price).toLocaleString('hu-HU')} ${currency}`
}

async function fetchLiveOffers() {
  if (!wineId.value || !isLoggedIn.value) return
  try {
    const response = await client.get(`wines/${wineId.value}/live-offers`)
    const offers = Array.isArray(response?.offers) ? response.offers : []
    liveOffers.value = offers
    liveOffersSource.value = response?.source || ''
  } catch (error) {
    console.error('Live offers fetch failed:', error)
    liveOffers.value = []
    liveOffersSource.value = ''
  }
}
</script>

<style scoped>
.shop-strip {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(205px, 240px);
  gap: 0.65rem;
  overflow-x: auto;
  padding-bottom: 0.3rem;
  scroll-snap-type: x proximity;
}

.shop-card {
  scroll-snap-align: start;
  border-radius: 0.9rem;
  border: 1px solid var(--line);
  background: rgba(255, 251, 246, 0.9);
  padding: 0.7rem 0.75rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 126px;
}

.shop-chip {
  align-self: flex-start;
  border-radius: 999px;
  border: 1px solid rgba(202, 163, 103, 0.55);
  background: rgba(202, 163, 103, 0.2);
  color: #5a3913;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  padding: 0.15rem 0.5rem;
  margin-bottom: 0.35rem;
}

.buy-link-btn {
  border-radius: 999px;
  border: 1px solid var(--line);
  background: linear-gradient(135deg, var(--wine), var(--wine-soft));
  color: #fff7ef;
  font-size: 0.78rem;
  font-weight: 600;
  padding: 0.35rem 0.8rem;
  text-decoration: none;
  transition: 0.2s ease;
}

.buy-link-btn:hover {
  filter: brightness(1.07);
}
</style>
