<template>
  <div>
    <h1 class="text-3xl md:text-5xl font-light mb-6 leading-snug text-yellow-100">
      Találd meg a hozzád illő bort
    </h1>

    <BaseInput id="query" v-model="filters.query" placeholder="Bor neve.." type="text" />

    <div class="flex flex-wrap justify-center gap-4 my-6">
      <select v-model="filters.type" class="bg-gray-800 border border-gray-700 px-4 py-2 rounded">
        <option value="">Szőlőfajta</option>
        <option>Vörös</option>
        <option>Fehér</option>
        <option>Rozé</option>
      </select>

      <select v-model="filters.style" class="bg-gray-800 border border-gray-700 px-4 py-2 rounded">
        <option value="">Stílus</option>
        <option>Száraz</option>
        <option>Félszáraz</option>
        <option>Édes</option>
        <option>Félédes</option>
      </select>

      <select v-model="filters.price" class="bg-gray-800 border border-gray-700 px-4 py-2 rounded">
        <option value="">Ár</option>
        <option>20-50</option>
        <option>50-80</option>
        <option>80-130</option>
        <option>>130</option>
      </select>

      <select v-model="filters.flavor" class="bg-gray-800 border border-gray-700 px-4 py-2 rounded">
        <option value="">Ízvilág</option>
        <option>Gyümölcsös</option>
        <option>Fűszeres</option>
        <option>Virágos</option>
        <option>Földes</option>
        <option>Egyéb</option>
      </select>
    </div>

    <div class="flex justify-center gap-4 mb-6">
      <BaseButton variant="secondary" @click="emitSearch">Keresés</BaseButton>
      <BaseButton variant="secondary">Fotó alapján keresek</BaseButton>
      <BaseButton to="/addWine" variant="secondary">Új bor hozzáadása</BaseButton>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import BaseButton from '../components/ui/BaseButton.vue'
import BaseInput from '../components/ui/BaseInput.vue'

const emit = defineEmits(['search'])

// Az összes szűrőt egyetlen objektumban tároljuk
const filters = reactive({
  query: '',
  type: '',
  style: '',
  price: '',
  flavor: '',
})

function emitSearch() {
  // Amikor a user kattint, elküldjük a szűrők másolatát a szülőnek
  emit('search', { ...filters })
}
</script>
