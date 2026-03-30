<template>
  <section class="glass-panel hero-sheen rounded-3xl p-6 text-left md:p-10">
    <div class="mb-6 flex items-start justify-between gap-6">
      <div>
        <h1 class="text-3xl font-semibold md:text-5xl">Találd meg a hozzád illő bort</h1>
        <p class="mt-3 max-w-2xl text-sm text-[var(--text-muted)] md:text-base">
          Intelligens szűrés ízprofil, stílus és árkategória alapján. Válassz 1-2 preferenciát, és
          már látod a legjobb találatokat.
        </p>
      </div>
      <span
        class="hidden rounded-full border border-[var(--line)] bg-[rgba(237,215,212,0.72)] px-3 py-1 text-xs font-semibold text-[var(--wine)] md:inline-flex"
      >
        Smart Search 🍷
      </span>
    </div>

    <BaseInput id="query" v-model="filters.query" placeholder="Példa: Villányi, gyümölcsös..." />

    <div class="mt-2 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
      <select v-model="filters.type" class="search-select">
        <option value="">Típus</option>
        <option v-for="option in filterOptions.types" :key="option" :value="option">
          {{ option }}
        </option>
      </select>

      <select v-model="filters.style" class="search-select">
        <option value="">Stílus</option>
        <option v-for="option in filterOptions.styles" :key="option" :value="option">
          {{ option }}
        </option>
      </select>

      <select v-model="filters.price" class="search-select">
        <option value="">Ár</option>
        <option v-for="option in filterOptions.prices" :key="option" :value="option">
          {{ option }}
        </option>
      </select>

      <select v-model="filters.flavor" class="search-select">
        <option value="">Ízvilág</option>
        <option v-for="option in filterOptions.flavors" :key="option" :value="option">
          {{ option }}
        </option>
      </select>
    </div>

    <div class="mt-6 flex flex-wrap gap-3">
      <BaseButton variant="primary" @click="emitSearch">Keresés</BaseButton>
      <BaseButton variant="secondary">Fotó alapján keresek 📸</BaseButton>
      <BaseButton to="/addWine" variant="secondary">Új bor hozzáadása</BaseButton>
    </div>
  </section>
</template>

<script setup>
import { reactive } from 'vue'
import BaseButton from '../components/ui/BaseButton.vue'
import BaseInput from '../components/ui/BaseInput.vue'

const emit = defineEmits(['search'])
defineProps({
  filterOptions: {
    type: Object,
    default: () => ({
      types: ['Vörös', 'Fehér', 'Rozé'],
      styles: ['Száraz', 'Félszáraz', 'Édes', 'Félédes'],
      prices: ['20-50', '50-80', '80-130', '>130'],
      flavors: ['Gyümölcsös', 'Fűszeres', 'Virágos', 'Földes'],
    }),
  },
})

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

<style scoped>
.search-select {
  width: 100%;
  border-radius: 0.85rem;
  border: 1px solid var(--line);
  background: rgba(255, 249, 242, 0.92);
  color: var(--text-main);
  padding: 0.7rem 0.9rem;
  outline: none;
  transition: 0.2s ease;
}

.search-select:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 2px rgba(200, 154, 83, 0.25);
}
</style>
