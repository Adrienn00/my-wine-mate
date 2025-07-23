<template>
  <div class="text-center text-4xl">Hozzád leginkább találó bor</div>
  <div
    class="flex flex-col justify-start gap-6 my-6 max-w-md mx-auto text-center font-bold italic border-2 text-yellow-100 max-h-150 overflow-auto bg-gray-900 rounded-lg shadow-lg p-8"
  >
    <div>Bor tipusa</div>
    <BaseMultiselect
      v-model="selectedPreferences.wineTypes"
      :options="wineTypeOptions"
      placeholder="Válaszd ki a kedvenc típusaid"
    />

    <BaseMultiselect
      v-model="selectedPreferences.flavourProfile"
      :options="flavourProfileOptions"
      placeholder="Válaszd ki a kedvelt izprofiljaid"
    />

    <BaseMultiselect
      v-model="selectedPreferences.regions"
      :options="regionsOptions"
      placeholder="Válaszd ki a regio(ka)t"
    />

    <BaseMultiselect
      v-model="selectedPreferences.priceRange"
      :options="priceRangesOptions"
      placeholder="Válaszd ki az arakat"
    />

    <BaseMultiselect
      v-model="selectedPreferences.alcoholLevel"
      :options="alcoholLevelsOptions"
      placeholder="Válaszd ki az alkoholtartalmat"
    />

    <BaseMultiselect
      v-model="selectedPreferences.foodPreferences"
      :options="foodTypePreferences"
      placeholder="Válaszd ki az etkezesi tipusod"
    />

    <BaseMultiselect
      v-model="selectedPreferences.wineYear"
      :options="yearPreferences"
      placeholder="Válaszd ki a bor evet"
    />
    <BaseButton variant="login">Mentes</BaseButton>
  </div>
</template>
<script setup>
import { useProfileStore } from '../stores/profileStore'
import BaseMultiselect from '../components/ui/BaseMultiselect.vue'
import BaseButton from '../components/ui/BaseButton.vue'

const profileStore = useProfileStore()

const wineTypeOptions = profileStore.wineType.wineTypes
const flavourProfileOptions = profileStore.wineType.flavourProfile
const regionsOptions = profileStore.wineType.regions
const priceRangesOptions = profileStore.wineType.priceRanges
const alcoholLevelsOptions = profileStore.wineType.alcoholLevels
const foodTypePreferences = profileStore.wineType.foodPreferences
const yearPreferences = profileStore.wineType.wineYears

const selectedPreferences = profileStore.selectedPreferences
</script>
