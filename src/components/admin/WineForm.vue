<template>
  <div class="mb-6 mt-4 rounded-lg border border-[var(--line)] bg-[rgba(255,251,246,0.92)] p-4">
    <h3 class="mb-2 text-xl text-[var(--wine)]">
      {{ localWine._id ? 'Edit Wine' : 'Add New Wine' }}
    </h3>

    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <BaseInput v-model="localWine.name" label="Name" />
      <BaseInput v-model="localWine.winery" label="Winery" />
      <BaseInput v-model="localWine.type" label="Type" />
      <BaseInput v-model="localWine.style" label="Style" />
      <BaseInput v-model="localWine.priceRange" label="Price range" />
      <BaseInput v-model="localWine.year" label="Vintage" />
      <BaseInput v-model="localWine.alcohol" label="Alcohol content" />
      <BaseInput v-model="localWine.origin.country" label="Country" />
      <BaseInput v-model="localWine.origin.region" label="Region" />
      <BaseInput v-model="localWine.imageUrl" label="Image URL" />
    </div>

    <BaseInput v-model="localWine.description" label="Description" textarea />
    <BaseInput
      v-model="purchaseOptionsText"
      label="Purchase options (line format: Shop name | Price | URL)"
      textarea
    />

    <BaseInput
      v-model="flavorInput"
      label="Flavor notes (press Enter to add)"
      @keydown.enter.prevent="addFlavor"
    />
    <div class="mb-4 flex flex-wrap gap-2">
      <span
        v-for="(flavor, i) in localWine.flavorProfiles"
        :key="i"
        class="rounded bg-[rgba(237,215,212,0.65)] px-2 py-1 text-[var(--text-main)]"
      >
        {{ flavor }} <button class="ml-1 text-[var(--danger)]" @click="removeFlavor(i)">x</button>
      </span>
    </div>

    <BaseInput
      v-model="grapeInput"
      label="Grape varieties (press Enter to add)"
      @keydown.enter.prevent="addGrape"
    />
    <div class="mb-4 flex flex-wrap gap-2">
      <span
        v-for="(grape, i) in localWine.grapeVarieties"
        :key="i"
        class="rounded bg-[rgba(237,215,212,0.65)] px-2 py-1 text-[var(--text-main)]"
      >
        {{ grape }} <button class="ml-1 text-[var(--danger)]" @click="removeGrape(i)">x</button>
      </span>
    </div>

    <BaseInput
      v-model="foodInput"
      label="Food pairing hints (press Enter to add)"
      @keydown.enter.prevent="addFoodPairing"
    />
    <div class="mb-4 flex flex-wrap gap-2">
      <span
        v-for="(food, i) in localWine.foodPairingHints"
        :key="i"
        class="rounded bg-[rgba(237,215,212,0.65)] px-2 py-1 text-[var(--text-main)]"
      >
        {{ food }}
        <button class="ml-1 text-[var(--danger)]" @click="removeFoodPairing(i)">x</button>
      </span>
    </div>

    <div class="mb-4 flex items-center gap-4 text-[var(--text-main)]">
      <label class="flex items-center gap-2">
        <input type="checkbox" v-model="localWine.is_award_winner" /> Award-winning
      </label>
      <label class="flex items-center gap-2">
        <input type="checkbox" v-model="localWine.is_confirmed" /> Confirmed
      </label>
    </div>

    <div class="mt-4 flex gap-2">
      <BaseButton variant="secondary" @click="submitEdit">Save</BaseButton>
      <BaseButton variant="secondary" @click="$emit('cancel')">Cancel</BaseButton>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BaseInput from '../ui/BaseInput.vue'
import BaseButton from '../ui/BaseButton.vue'

const props = defineProps({
  initialData: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['save', 'cancel'])

const localWine = ref(JSON.parse(JSON.stringify(props.initialData)))

const flavorInput = ref('')
const grapeInput = ref('')
const foodInput = ref('')
const purchaseOptionsText = ref('')

hydratePurchaseOptionsText()

function submitEdit() {
  if (
    !localWine.value.name ||
    !localWine.value.type ||
    !localWine.value.style ||
    !localWine.value.priceRange
  ) {
    alert('Required fields are missing.')
    return
  }
  localWine.value.purchaseOptions = parsePurchaseOptionsText(purchaseOptionsText.value)
  emit('save', localWine.value)
}

function addFlavor() {
  if (flavorInput.value.trim()) {
    localWine.value.flavorProfiles.push(flavorInput.value.trim())
    flavorInput.value = ''
  }
}
function removeFlavor(i) {
  localWine.value.flavorProfiles.splice(i, 1)
}

function addGrape() {
  if (grapeInput.value.trim()) {
    localWine.value.grapeVarieties.push(grapeInput.value.trim())
    grapeInput.value = ''
  }
}
function removeGrape(i) {
  localWine.value.grapeVarieties.splice(i, 1)
}

function addFoodPairing() {
  if (foodInput.value.trim()) {
    localWine.value.foodPairingHints.push(foodInput.value.trim())
    foodInput.value = ''
  }
}
function removeFoodPairing(i) {
  localWine.value.foodPairingHints.splice(i, 1)
}

function hydratePurchaseOptionsText() {
  const options = localWine.value.purchaseOptions || []
  purchaseOptionsText.value = options
    .map((option) => {
      const shopName = option.shopName || ''
      const price = option.price ?? ''
      const url = option.url || ''
      return [shopName, price, url].filter(Boolean).join(' | ')
    })
    .join('\n')
}

function parsePurchaseOptionsText(rawText) {
  if (!rawText?.trim()) return []
  return rawText
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
}
</script>
