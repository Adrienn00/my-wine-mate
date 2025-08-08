<template>
  <div class="min-h-screen bg">
    <div class="flex items-center justify-center max-w-6xl mx-auto px-4 py-12">
      <div class="w-full max-w-3xl flex flex-col gap-y-5">
        <h1 class="text-center text-3xl md:text-5xl font-light mb-6 leading-snug text-yellow-100">
          Adj hozzá új bort
        </h1>
        <form @submit.prevent="submitWine" class="flex flex-col gap-y-5">
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

          <BaseInput id="imageUrl" v-model="wine.imageUrl" placeholder="Kép URL" type="url" />

          <label class="flex items-center gap-x-3">
            <input type="checkbox" v-model="wine.is_award_winner" />
            <span class="text-yellow-100">Díjnyertes bor</span>
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
})

const flavorProfilesText = ref('')
const grapeVarietiesText = ref('')
const foodPairingHintsText = ref('')
const tagsText = ref('')

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
    }
    flavorProfilesText.value = ''
    grapeVarietiesText.value = ''
    foodPairingHintsText.value = ''
    tagsText.value = ''
  } catch (error) {
    alert('Hiba tortent a hozzaadaskor')
    console.error(error)
  }
}
</script>

<style scoped>
.bg {
  background-image: url('/home/adrienn/www/my-wine-mate/src/assets/images/bg.jpg');
  background-size: cover;
}
</style>
