<template>
  <div class="text-center text-4xl">Hozzád leginkább találó bor</div>
  <div
    class="flex flex-col justify-start gap-6 my-6 max-w-md mx-auto text-center font-bold italic border-2 text-yellow-100 max-h-150 overflow-auto bg-gray-900 rounded-lg shadow-lg p-8"
  >
    <div>Bor tipusa</div>
    <BaseMultiselect
      v-model="selectedPreferences.wineType"
      :options="wineTypeOptions"
      placeholder="Válaszd ki a kedvenc típusaid"
    />
    <div>Izprofil</div>
    <BaseMultiselect
      v-model="selectedPreferences.flavourProfile"
      :options="flavourProfileOptions"
      placeholder="Válaszd ki a kedvelt izprofiljaid"
    />
    <div>Borvidek</div>
    <BaseMultiselect
      v-model="selectedPreferences.regions"
      :options="regionsOptions"
      placeholder="Válaszd ki a regio(ka)t"
    />
    <div>Ar</div>
    <BaseMultiselect
      v-model="selectedPreferences.priceRanges"
      :options="priceRangesOptions"
      placeholder="Válaszd ki az arakat"
    />
    <div>Alkohol tartalom</div>
    <BaseMultiselect
      v-model="selectedPreferences.alcoholLevel"
      :options="alcoholLevelsOptions"
      placeholder="Válaszd ki az alkoholtartalmat"
    />
    <div>Etel preferencia</div>
    <BaseMultiselect
      v-model="selectedPreferences.food"
      :options="foodTypePreferences"
      placeholder="Válaszd ki az etkezesi tipusod"
    />
    <div>Evjarat preferencia</div>
    <BaseMultiselect
      v-model="selectedPreferences.year"
      :options="yearPreferences"
      placeholder="Válaszd ki a bor evet"
    />
    <BaseButton variant="login">Mentes</BaseButton>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { useProfileStore } from '../stores/profileStore'
import BaseMultiselect from '../components/ui/BaseMultiselect.vue'
import BaseButton from '../components/ui/BaseButton.vue'

const preferences = useProfileStore()
const wineTypeOptions = preferences.wineType.wineTypes
const flavourProfileOptions = preferences.wineType.flavourProfile
const regionsOptions = preferences.wineType.regions
const priceRangesOptions = preferences.wineType.priceRanges
const alcoholLevelsOptions = preferences.wineType.alcoholLevels
const foodTypePreferences = preferences.wineType.foodPreferences
const yearPreferences = preferences.wineType.wineYears

const selectedPreferences = ref({
  wineType: [],
  flavourProfile: [],
  regionsOptions: [],
  priceRanges: [],
  alcoholLevel: [],
  food: [],
  year: [],
})
</script>
