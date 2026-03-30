<template>
  <div class="min-h-screen px-4 py-8 md:px-8 md:py-12">
    <div class="mx-auto flex max-w-6xl items-center justify-center">
      <div
        class="glass-panel flex w-full max-w-3xl flex-col gap-y-5 rounded-2xl border border-[var(--line)] p-6 md:p-8"
      >
        <div class="mb-1">
          <BaseButton to="/" variant="secondary">Vissza</BaseButton>
        </div>

        <h1
          class="mb-6 text-center text-3xl font-light leading-snug text-[var(--text-main)] md:text-5xl"
        >
          Adj hozzá új bort
        </h1>
        <form class="flex flex-col gap-y-5" @submit.prevent="submitWine">
          <BaseInput id="wineName" v-model="wine.name" placeholder="Bor neve *" required />

          <BaseInput id="winery" v-model="wine.winery" placeholder="Borászat neve" />

          <BaseInput id="description" v-model="wine.description" placeholder="Leírás" textarea />

          <BaseInput
            id="type"
            v-model="wine.type"
            placeholder="Típus"
            datalistId="type-options"
            :datalist="['Vörös', 'Fehér', 'Rozé']"
          />

          <BaseInput
            id="style"
            v-model="wine.style"
            placeholder="Stílus"
            datalistId="style-options"
            :datalist="['Száraz', 'Félszáraz', 'Édes', 'Félédes']"
          />

          <BaseInput
            id="flavorProfiles"
            v-model="flavorProfilesText"
            placeholder="Ízvilág (vesszővel elválasztva)"
            datalistId="flavor-options"
            :datalist="['Gyümölcsös', 'Fűszeres', 'Virágos', 'Földes']"
          />

          <BaseInput
            id="originCountry"
            v-model="wine.origin.country"
            placeholder="Származási ország"
          />

          <BaseInput
            id="originRegion"
            v-model="wine.origin.region"
            placeholder="Származási régió"
          />

          <BaseInput
            id="grapeVarieties"
            v-model="grapeVarietiesText"
            placeholder="Szőlőfajták (vesszővel elválasztva)"
          />

          <BaseInput id="year" v-model="wine.year" placeholder="Évjárat" />

          <BaseInput id="alcohol" v-model="wine.alcohol" placeholder="Alkohol %" />

          <BaseInput
            id="priceRange"
            v-model="wine.priceRange"
            placeholder="Ártartomány"
            datalistId="price-options"
            :datalist="['20-50', '50-80', '80-130', '>130']"
          />

          <BaseInput
            id="foodPairingHints"
            v-model="foodPairingHintsText"
            placeholder="Ételajánlás (vesszővel elválasztva)"
          />

          <BaseInput
            id="purchaseOptions"
            v-model="purchaseOptionsText"
            placeholder="Vásárlási opciók (soronként: Bolt | Ár | URL)"
            textarea
          />

          <BaseInput id="imageUrl" v-model="wine.imageUrl" type="url" placeholder="Kép URL" />

          <label class="flex items-center gap-x-3">
            <input type="checkbox" v-model="wine.is_award_winner" />
            <span class="text-[var(--text-main)]">Díjnyertes bor</span>
          </label>

          <BaseInput id="tags" v-model="tagsText" placeholder="Címkék (vesszővel elválasztva)" />

          <BaseButton variant="secondary" type="submit">Bor hozzáadása</BaseButton>
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
    alert('Kérlek, add meg a bor nevét!')
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
    alert('Sikeresen elküldve')
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
    alert('Hiba tortent a hozzaadaskor')
    console.error(error)
  }
}
</script>
