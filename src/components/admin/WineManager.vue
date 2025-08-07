<template>
  <div class="p-8 bg-gray-900 rounded-xl shadow text-white">
    <h2 class="text-2xl font-semibold mb-6">Borok kezelése</h2>

    <BaseButton variant="secondary" @click="startAdd">Új bor hozzáadása</BaseButton>

    <div v-if="isEditing" class="bg-gray-800 p-4 rounded mb-6 mt-4">
      <h3 class="text-xl mb-2">{{ editWine._id ? 'Bor szerkesztése' : 'Új bor hozzáadása' }}</h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BaseInput v-model="editWine.name" label="Név" />
        <BaseInput v-model="editWine.winery" label="Pince" />
        <BaseInput v-model="editWine.type" label="Típus" />
        <BaseInput v-model="editWine.style" label="Stílus" />
        <BaseInput v-model="editWine.priceRange" label="Árkategória" />
        <BaseInput v-model="editWine.year" label="Évjárat" />
        <BaseInput v-model="editWine.alcohol" label="Alkoholfok" />
        <BaseInput v-model="editWine.origin.country" label="Ország" />
        <BaseInput v-model="editWine.origin.region" label="Régió" />
        <BaseInput v-model="editWine.imageUrl" label="Kép URL" />
      </div>

      <BaseInput v-model="editWine.description" label="Leírás" textarea />
      <BaseInput
        v-model="flavorInput"
        label="Ízjegyek (Enter-rel hozzáadás)"
        @keydown.enter.prevent="addFlavor"
      />
      <div class="flex flex-wrap gap-2 mb-4">
        <span
          v-for="(flavor, i) in editWine.flavorProfiles"
          :key="i"
          class="bg-gray-700 px-2 py-1 rounded"
        >
          {{ flavor }} <button @click="removeFlavor(i)" class="ml-1 text-red-400">x</button>
        </span>
      </div>

      <BaseInput
        v-model="grapeInput"
        label="Szőlőfajták (Enter-rel hozzáadás)"
        @keydown.enter.prevent="addGrape"
      />
      <div class="flex flex-wrap gap-2 mb-4">
        <span
          v-for="(grape, i) in editWine.grapeVarieties"
          :key="i"
          class="bg-gray-700 px-2 py-1 rounded"
        >
          {{ grape }} <button @click="removeGrape(i)" class="ml-1 text-red-400">x</button>
        </span>
      </div>

      <BaseInput
        v-model="foodInput"
        label="Ételpárosítási javaslatok (Enter-rel hozzáadás)"
        @keydown.enter.prevent="addFoodPairing"
      />
      <div class="flex flex-wrap gap-2 mb-4">
        <span
          v-for="(food, i) in editWine.foodPairingHints"
          :key="i"
          class="bg-gray-700 px-2 py-1 rounded"
        >
          {{ food }} <button @click="removeFoodPairing(i)" class="ml-1 text-red-400">x</button>
        </span>
      </div>

      <div class="flex items-center gap-4 mb-4">
        <label class="flex items-center gap-2">
          <input type="checkbox" v-model="editWine.is_award_winner" />
          Díjnyertes
        </label>

        <label class="flex items-center gap-2">
          <input type="checkbox" v-model="editWine.is_confirmed" />
          Megerősített
        </label>
      </div>

      <div class="flex gap-2 mt-4">
        <BaseButton variant="secondary" @click="submitEdit">Mentés</BaseButton>
        <BaseButton variant="secondary" @click="cancelEdit">Mégse</BaseButton>
      </div>
    </div>

    <table class="w-full table-auto border-collapse text-left">
      <thead>
        <tr class="border-b border-gray-600 text-yellow-100">
          <th class="pb-2">Név</th>
          <th>Típus</th>
          <th>Stílus</th>
          <th>Ár</th>
          <th>Ízjegyek</th>
          <th>Műveletek</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="wine in allWines" :key="wine._id" class="border-b border-gray-700">
          <td class="py-2">{{ wine.name }}</td>
          <td>{{ wine.type }}</td>
          <td>{{ wine.style }}</td>
          <td>{{ wine.priceRange }}</td>
          <td>{{ wine.flavorProfiles?.join(', ') }}</td>
          <td class="space-x-2">
            <BaseButton variant="secondary" @click="startEdit(wine)">Szerkesztés</BaseButton>
            <BaseButton variant="secondary" @click="deleteWine(wine._id)">Törlés</BaseButton>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useWinesStore } from '@/stores/winesStore'
import BaseInput from '../ui/BaseInput.vue'
import BaseButton from '../ui/BaseButton.vue'

const winesStore = useWinesStore()

const isEditing = ref(false)
const allWines = computed(() => winesStore.wines)

const emptyWine = () => ({
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
  is_confirmed: true,
  tags: [],
  ratings: [],
})

const editWine = ref(emptyWine())

const flavorInput = ref('')
const grapeInput = ref('')
const foodInput = ref('')

onMounted(() => {
  winesStore.getAllWines()
})

function startAdd() {
  isEditing.value = true
  editWine.value = emptyWine()
}

function startEdit(wine) {
  isEditing.value = true
  editWine.value = JSON.parse(JSON.stringify(wine))
}

function cancelEdit() {
  isEditing.value = false
  editWine.value = emptyWine()
}

async function submitEdit() {
  const wineData = editWine.value

  if (!wineData.name || !wineData.type || !wineData.style || !wineData.priceRange) {
    alert('A kötelező mezők nincsenek kitöltve!')
    return
  }

  if (wineData._id) {
    await winesStore.updateWine(wineData)
  } else {
    await winesStore.addNewWine(wineData)
  }

  isEditing.value = false
  editWine.value = emptyWine()
}

async function deleteWine(id) {
  if (confirm('Biztosan törlöd ezt a bort?')) {
    await winesStore.deleteWine(id)
  }
}

function addFlavor() {
  if (flavorInput.value.trim()) {
    editWine.value.flavorProfiles.push(flavorInput.value.trim())
    flavorInput.value = ''
  }
}
function removeFlavor(i) {
  editWine.value.flavorProfiles.splice(i, 1)
}

function addGrape() {
  if (grapeInput.value.trim()) {
    editWine.value.grapeVarieties.push(grapeInput.value.trim())
    grapeInput.value = ''
  }
}
function removeGrape(i) {
  editWine.value.grapeVarieties.splice(i, 1)
}

function addFoodPairing() {
  if (foodInput.value.trim()) {
    editWine.value.foodPairingHints.push(foodInput.value.trim())
    foodInput.value = ''
  }
}
function removeFoodPairing(i) {
  editWine.value.foodPairingHints.splice(i, 1)
}
</script>
