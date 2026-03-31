<template>
  <div class="min-h-screen px-4 py-8 md:px-8 md:py-12">
    <div class="mx-auto flex max-w-6xl items-center justify-center">
      <div
        class="glass-panel flex w-full max-w-3xl flex-col gap-y-5 rounded-2xl border border-[var(--line)] p-6 md:p-8"
      >
        <div class="mb-1">
          <BaseButton to="/" variant="secondary">Back</BaseButton>
        </div>

        <h1
          class="mb-6 text-center text-3xl font-light leading-snug text-[var(--text-main)] md:text-5xl"
        >
          Add a New Wine
        </h1>
        <form class="flex flex-col gap-y-5" @submit.prevent="submitWine">
          <BaseInput id="wineName" v-model="wine.name" placeholder="Wine name *" required />

          <BaseInput id="winery" v-model="wine.winery" placeholder="Winery name" />

          <BaseInput id="description" v-model="wine.description" placeholder="Description" textarea />

          <BaseInput
            id="type"
            v-model="wine.type"
            placeholder="Type"
            datalistId="type-options"
            :datalist="['Red', 'White', 'Rose']"
          />

          <BaseInput
            id="style"
            v-model="wine.style"
            placeholder="Style"
            datalistId="style-options"
            :datalist="['Dry', 'Semi-dry', 'Sweet', 'Semi-sweet']"
          />

          <BaseInput
            id="flavorProfiles"
            v-model="flavorProfilesText"
            placeholder="Flavor profiles (comma separated)"
            datalistId="flavor-options"
            :datalist="['Fruity', 'Spicy', 'Floral', 'Earthy']"
          />

          <BaseInput
            id="originCountry"
            v-model="wine.origin.country"
            placeholder="Country of origin"
          />

          <BaseInput
            id="originRegion"
            v-model="wine.origin.region"
            placeholder="Region of origin"
          />

          <BaseInput
            id="grapeVarieties"
            v-model="grapeVarietiesText"
            placeholder="Grape varieties (comma separated)"
          />

          <BaseInput id="year" v-model="wine.year" placeholder="Vintage" />

          <BaseInput id="alcohol" v-model="wine.alcohol" placeholder="Alcohol %" />

          <BaseInput
            id="priceRange"
            v-model="wine.priceRange"
            placeholder="Price range"
            datalistId="price-options"
            :datalist="['20-50', '50-80', '80-130', '>130']"
          />

          <BaseInput
            id="foodPairingHints"
            v-model="foodPairingHintsText"
            placeholder="Food pairing hints (comma separated)"
          />

          <BaseInput
            id="purchaseOptions"
            v-model="purchaseOptionsText"
            placeholder="Purchase options (one per line: Shop | Price | URL)"
            textarea
          />

          <BaseInput id="imageUrl" v-model="wine.imageUrl" type="url" placeholder="Image URL" />

          <label class="flex items-center gap-x-3">
            <input type="checkbox" v-model="wine.is_award_winner" />
            <span class="text-[var(--text-main)]">Award-winning wine</span>
          </label>

          <BaseInput id="tags" v-model="tagsText" placeholder="Tags (comma separated)" />

          <BaseButton variant="secondary" type="submit">Submit Wine</BaseButton>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import BaseInput from '../components/ui/BaseInput.vue'
import BaseButton from '../components/ui/BaseButton.vue'
import { ref } from 'vue'
import { useWinesStore } from '../stores/winesStore'

const winesStore = useWinesStore()

const wine = ref({
  name: '',
  winery: '',
  description: '',
  type: '',
  style: '',
  flavorProfiles: [],
  origin: {
    country: '',
    region: '',
  },
  grapeVarieties: [],
  year: null,
  alcohol: null,
  priceRange: '',
  foodPairingHints: [],
  aiFoodPairingEnabled: false,
  imageUrl: '',
  is_award_winner: false,
  tags: [],
  purchaseOptions: [],
})

const flavorProfilesText = ref('')
const grapeVarietiesText = ref('')
const foodPairingHintsText = ref('')
const tagsText = ref('')
const purchaseOptionsText = ref('')

async function submitWine() {
  if (!wine.value.name.trim()) {
    alert('Please enter the wine name.')
    return
  }
  wine.value.flavorProfiles = flavorProfilesText.value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  wine.value.grapeVarieties = grapeVarietiesText.value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  wine.value.foodPairingHints = foodPairingHintsText.value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  wine.value.tags = tagsText.value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  wine.value.purchaseOptions = purchaseOptionsText.value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [shopNameRaw = '', priceRaw = '', urlRaw = ''] = line
        .split('|')
        .map((part) => part.trim())
      const parsedPrice = Number(String(priceRaw).replace(',', '.'))
      return {
        shopName: shopNameRaw,
        price: Number.isFinite(parsedPrice) ? parsedPrice : null,
        currency: 'RON',
        url: urlRaw,
      }
    })
    .filter((option) => option.shopName || option.url)
  try {
    await winesStore.addNewWine({ ...wine.value })
    alert('Submitted successfully.')
    wine.value = {
      name: '',
      winery: '',
      description: '',
      type: '',
      style: '',
      flavorProfiles: [],
      origin: { country: '', region: '' },
      grapeVarieties: [],
      year: null,
      alcohol: null,
      priceRange: '',
      foodPairingHints: [],
      aiFoodPairingEnabled: false,
      imageUrl: '',
      is_award_winner: false,
      tags: [],
      purchaseOptions: [],
    }
    flavorProfilesText.value = ''
    grapeVarietiesText.value = ''
    foodPairingHintsText.value = ''
    tagsText.value = ''
    purchaseOptionsText.value = ''
  } catch (error) {
    alert('An error occurred while adding the wine.')
    console.error(error)
  }
}
</script>
