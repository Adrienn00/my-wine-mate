<template>
  <div class="mb-6 mt-4 rounded-lg border border-[var(--line)] bg-[rgba(255,251,246,0.92)] p-4">
    <h3 class="mb-2 text-xl text-[var(--wine)]">
      {{ localWine._id ? 'Bor szerkesztése' : 'Új bor hozzáadása' }}
    </h3>

    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <BaseInput v-model="localWine.name" label="Név" />
      <BaseInput v-model="localWine.winery" label="Pince" />
      <BaseInput v-model="localWine.type" label="Típus" />
      <BaseInput v-model="localWine.style" label="Stílus" />
      <BaseInput v-model="localWine.priceRange" label="Árkategória" />
      <BaseInput v-model="localWine.year" label="Évjárat" />
      <BaseInput v-model="localWine.alcohol" label="Alkoholfok" />
      <BaseInput v-model="localWine.origin.country" label="Ország" />
      <BaseInput v-model="localWine.origin.region" label="Régió" />
      <BaseInput v-model="localWine.imageUrl" label="Kép URL" />
    </div>

    <BaseInput v-model="localWine.description" label="Leírás" textarea />

    <BaseInput
      v-model="flavorInput"
      label="Ízjegyek (Enter-rel hozzáadás)"
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
      label="Szőlőfajták (Enter-rel hozzáadás)"
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
      label="Ételpárosítási javaslatok (Enter-rel hozzáadás)"
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
        <input type="checkbox" v-model="localWine.is_award_winner" /> Díjnyertes
      </label>
      <label class="flex items-center gap-2">
        <input type="checkbox" v-model="localWine.is_confirmed" /> Megerősített
      </label>
    </div>

    <div class="mt-4 flex gap-2">
      <BaseButton variant="secondary" @click="submitEdit">Mentés</BaseButton>
      <BaseButton variant="secondary" @click="$emit('cancel')">Mégse</BaseButton>
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

// Készítünk egy mély másolatot (deep copy), hogy amíg nem mentünk,
// ne írjuk felül az eredeti adatokat a Store-ban.
const localWine = ref(JSON.parse(JSON.stringify(props.initialData)))

const flavorInput = ref('')
const grapeInput = ref('')
const foodInput = ref('')

function submitEdit() {
  if (
    !localWine.value.name ||
    !localWine.value.type ||
    !localWine.value.style ||
    !localWine.value.priceRange
  ) {
    alert('A kötelező mezők nincsenek kitöltve!')
    return
  }
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
</script>
