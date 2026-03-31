<template>
  <section class="glass-panel hero-sheen rounded-3xl p-6 text-left md:p-10">
    <div class="mb-6 flex items-start justify-between gap-6">
      <div>
        <p class="micro-label">Smart Search</p>
        <h1 class="mt-2 text-3xl md:text-5xl">Find the wine that fits you best</h1>
        <p class="mt-3 max-w-2xl text-sm text-[var(--text-muted)] md:text-base">
          Smart filtering by flavor profile, style, and price range. Choose 1-2 preferences and
          instantly see the best matches.
        </p>
      </div>
      <span
        class="hidden rounded-full border border-[var(--line)] bg-[rgba(237,215,212,0.72)] px-3 py-1 text-xs font-semibold text-[var(--wine)] md:inline-flex"
      >
        Smart Search 🍷
      </span>
    </div>

    <BaseInput id="query" v-model="filters.query" placeholder="Example: Villanyi, fruity..." />

    <div class="mt-2 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
      <select v-model="filters.type" class="search-select">
        <option value="">Type</option>
        <option v-for="option in filterOptions.types" :key="option" :value="option">
          {{ option }}
        </option>
      </select>

      <select v-model="filters.style" class="search-select">
        <option value="">Style</option>
        <option v-for="option in filterOptions.styles" :key="option" :value="option">
          {{ option }}
        </option>
      </select>

      <select v-model="filters.price" class="search-select">
        <option value="">Price</option>
        <option v-for="option in filterOptions.prices" :key="option" :value="option">
          {{ option }}
        </option>
      </select>

      <select v-model="filters.flavor" class="search-select">
        <option value="">Flavor</option>
        <option v-for="option in filterOptions.flavors" :key="option" :value="option">
          {{ option }}
        </option>
      </select>
    </div>

    <div class="mt-6 flex flex-wrap gap-3">
      <BaseButton variant="primary" @click="emitSearch">Search</BaseButton>
      <BaseButton variant="secondary">Search by Photo 📸</BaseButton>
      <BaseButton to="/addWine" variant="secondary">Add New Wine</BaseButton>
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
      types: ['Red', 'White', 'Rose'],
      styles: ['Dry', 'Semi-dry', 'Sweet', 'Semi-sweet'],
      prices: ['20-50', '50-80', '80-130', '>130'],
      flavors: ['Fruity', 'Spicy', 'Floral', 'Earthy'],
    }),
  },
})

// Store all filters in a single object.
const filters = reactive({
  query: '',
  type: '',
  style: '',
  price: '',
  flavor: '',
})

function emitSearch() {
  // Emit a shallow copy of the current filters to the parent component.
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
  font-size: 0.95rem;
  padding: 0.7rem 0.9rem;
  outline: none;
  transition: 0.2s ease;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.55);
}

.search-select:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 2px rgba(200, 154, 83, 0.25);
}
</style>
