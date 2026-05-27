<template>
  <section
    v-if="isLoggedIn && purchaseLinks.length"
    class="rounded-xl border border-[var(--line)] p-4"
  >
    <h4 class="text-lg font-semibold">Purchase Options</h4>
    <p class="mt-1 text-sm text-[var(--text-muted)]">{{ purchaseIntroText }}</p>

    <div class="shop-strip mt-3">
      <article
        v-for="(option, idx) in purchaseLinks"
        :key="`${option.shopName}-${option.url}-${idx}`"
        class="shop-card"
      >
        <p v-if="hasStoredPrices && idx === 0" class="shop-chip">Best Price</p>
        <div>
          <p class="font-semibold leading-tight">
            {{ option.shopName || 'Unknown shop' }}
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
          View Offer
        </a>
      </article>
    </div>
  </section>

  <section v-else-if="!isLoggedIn" class="rounded-xl border border-[var(--line)] p-4">
    <h4 class="text-lg font-semibold">Purchase Options</h4>
    <p class="mt-1 text-sm text-[var(--text-muted)]">Log in or sign up to use this feature.</p>
    <div class="mt-3 flex flex-wrap gap-2">
      <BaseButton to="/login" variant="secondary">Log In</BaseButton>
      <BaseButton to="/signup" variant="secondary">Sign Up</BaseButton>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import client from '../httpService/client'
import BaseButton from '../ui/BaseButton.vue'

const props = defineProps({
  wine: {
    type: Object,
    required: true,
  },
  wineId: {
    type: String,
    default: '',
  },
  isLoggedIn: {
    type: Boolean,
    default: false,
  },
})

const liveOffers = ref([])
const liveOffersSource = ref('')

const currentWineId = computed(() => props.wine?._id || props.wineId)

const sortedPurchaseOptions = computed(() => {
  const options = props.wine?.purchaseOptions || []
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
  const query = [props.wine?.name, props.wine?.winery].filter(Boolean).join(' ')
  if (!query) return []
  const q = encodeURIComponent(query)
  return [
    {
      shopName: 'Arukereso',
      url: `https://www.arukereso.hu/?st=${q}`,
      note: 'Quick price comparison',
    },
    {
      shopName: 'Google Shopping',
      url: `https://www.google.com/search?tbm=shop&q=${q}`,
      note: 'Online store results',
    },
    {
      shopName: 'Wine-Searcher',
      url: `https://www.wine-searcher.com/find/${q}`,
      note: 'International offers',
    },
    {
      shopName: 'Vivino',
      url: `https://www.vivino.com/search/wines?q=${q}`,
      note: 'Ratings and shops',
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
    return 'Automatically loaded live webshop results.'
  }
  if (liveOffers.value.length && liveOffersSource.value === 'fallback') {
    return 'Live pricing is unavailable, so search links are shown instead.'
  }
  return sortedPurchaseOptions.value.filter((option) => option?.url).length
    ? 'Sorted by price, starting with the lowest.'
    : 'Automatically generated purchase links based on the wine name.'
})

onMounted(() => {
  fetchLiveOffers()
})

watch([currentWineId, () => props.isLoggedIn], () => {
  fetchLiveOffers()
})

function formatPurchasePrice(option) {
  const price = Number(option?.price)
  if (!Number.isFinite(price)) return option?.note || 'Price: not available'
  const currency = option?.currency || 'RON'
  return `Price: ${Math.round(price).toLocaleString('en-US')} ${currency}`
}

async function fetchLiveOffers() {
  liveOffers.value = []
  liveOffersSource.value = ''

  if (!currentWineId.value || !props.isLoggedIn) return

  try {
    const response = await client.get(`wines/${currentWineId.value}/live-offers`)
    const offers = Array.isArray(response?.offers) ? response.offers : []
    liveOffers.value = offers
    liveOffersSource.value = response?.source || ''
  } catch (error) {
    console.error('Live offers fetch failed:', error)
  }
}
</script>

<style scoped>
.shop-strip {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(160px, 220px);
  gap: 0.65rem;
  overflow-x: auto;
  max-width: 100%;
  padding-bottom: 0.5rem;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
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
