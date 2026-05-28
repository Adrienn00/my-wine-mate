<template>
  <section class="dashboard-panel rounded-xl p-5 md:p-7">
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">Browse Classic Pairing</p>
        <h3 class="mt-2 text-2xl font-semibold">Start from a recipe or a wine</h3>
        <p class="mt-2 max-w-2xl text-sm text-[var(--text-muted)]">
          Pick one side first, browse the catalog, then open AI pairings for the item you want.
        </p>
      </div>
      <div class="flex flex-wrap gap-2">
        <button
          class="dashboard-chip cursor-pointer"
          :class="{ 'dashboard-chip--active': mode === 'recipe' }"
          @click="mode = 'recipe'"
        >
          Recipe Search
        </button>
        <button
          class="dashboard-chip cursor-pointer"
          :class="{ 'dashboard-chip--active': mode === 'wine' }"
          @click="mode = 'wine'"
        >
          Wine Search
        </button>
      </div>
    </div>

    <div class="mt-5">
      <input
        v-model.trim="query"
        class="w-full rounded-full border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text-main)] outline-none transition-all placeholder:text-[var(--text-muted)]/60 focus:border-[var(--wine)] focus:ring-2 focus:ring-[rgba(93,31,50,0.14)]"
        :placeholder="mode === 'recipe'
          ? 'Search recipes by name, category, or ingredient...'
          : 'Search wines by name, type, style, or flavor...'"
      />
    </div>

    <!-- Recipe filters -->
    <div
      v-if="mode === 'recipe'"
      class="mt-5 grid grid-cols-1 gap-4 rounded-xl border border-[var(--line)] bg-white/55 p-4 md:grid-cols-2 xl:grid-cols-3"
    >
      <div>
        <p class="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">Category</p>
        <BaseMultiselect v-model="recipeFilters.category" :options="recipeCategoryOptions" :multiple="false" placeholder="All categories" />
      </div>
      <div>
        <p class="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">Main ingredient</p>
        <BaseMultiselect v-model="recipeFilters.ingredient" :options="recipeIngredientOptions" :multiple="false" placeholder="All ingredients" />
      </div>
      <div>
        <p class="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">Dish type</p>
        <BaseMultiselect v-model="recipeFilters.dishType" :options="recipeDishTypeOptions" :multiple="false" placeholder="All dish types" />
      </div>
    </div>

    <!-- Wine filters -->
    <div
      v-else
      class="mt-5 grid grid-cols-1 gap-4 rounded-xl border border-[var(--line)] bg-white/55 p-4 md:grid-cols-2 xl:grid-cols-4"
    >
      <div>
        <p class="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">Type</p>
        <BaseMultiselect v-model="wineFilters.type" :options="wineTypeOptions" :multiple="false" placeholder="All wine types" />
      </div>
      <div>
        <p class="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">Style</p>
        <BaseMultiselect v-model="wineFilters.style" :options="wineStyleOptions" :multiple="false" placeholder="All styles" />
      </div>
      <div>
        <p class="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">Flavor</p>
        <BaseMultiselect v-model="wineFilters.flavor" :options="wineFlavorOptions" :multiple="false" placeholder="All flavor profiles" />
      </div>
      <div>
        <p class="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">Price</p>
        <BaseMultiselect v-model="wineFilters.price" :options="winePriceOptions" :multiple="false" placeholder="All price ranges" />
      </div>
    </div>

    <!-- Results grid -->
    <div class="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      <article
        v-for="item in paginatedResults"
        :key="item._id"
        class="dashboard-panel rounded-xl p-4"
      >
        <p class="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
          {{ mode === 'recipe' ? 'Recipe' : 'Wine' }}
        </p>
        <h4 class="mt-2 text-xl font-semibold">{{ item.name }}</h4>
        <p class="mt-2 text-sm text-[var(--text-muted)]">{{ browseDescription(item) }}</p>
        <div class="mt-4">
          <BaseButton :to="detailsLink(item)" class="!text-white">See Details and Pairing</BaseButton>
        </div>
      </article>
    </div>

    <!-- Paginator -->
    <div v-if="totalPages > 1" class="mt-6 flex items-center justify-between gap-4">
      <button class="pager-btn" :disabled="page === 1" @click="page--">Previous</button>
      <p class="text-sm text-[var(--text-muted)]">{{ page }} / {{ totalPages }} pages</p>
      <button class="pager-btn" :disabled="page === totalPages" @click="page++">Next</button>
    </div>

    <p v-if="!filteredResults.length" class="mt-6 text-center text-sm text-[var(--text-muted)]">
      No items matched your search.
    </p>
  </section>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import BaseButton from './ui/BaseButton.vue'
import BaseMultiselect from './ui/BaseMultiselect.vue'
import client from './httpService/client'
import {
  RECIPE_DISH_TYPES,
  RECIPE_MAIN_INGREDIENTS,
  asRecipeCategoryArray,
} from '../services/recipeCategories'
import { buildPreferenceOptionsFromWines } from '../services/preferenceOptions'

const PAGE_SIZE = 9

const mode = ref('recipe')
const query = ref('')
const page = ref(1)
const recipes = ref([])
const wines = ref([])

const recipeFilters = reactive({ category: '', ingredient: '', dishType: '' })
const wineFilters = reactive({ type: '', style: '', flavor: '', price: '' })

onMounted(async () => {
  const [recipeRes, wineRes] = await Promise.all([
    client.get('recipes'),
    client.get('wines'),
  ])
  const toArray = (r) => (Array.isArray(r) ? r : (r?.data ?? []))
  recipes.value = toArray(recipeRes).filter((r) => r?.is_confirmed)
  wines.value = toArray(wineRes).filter((w) => w?.is_confirmed)
})

const recipeCategoryOptions = computed(() => {
  const values = new Set()
  recipes.value.forEach((r) => asRecipeCategoryArray(r.recipeCategories).forEach((v) => values.add(v)))
  return [...values].sort((a, b) => a.localeCompare(b))
})

const recipeIngredientOptions = computed(() => {
  const set = new Set(RECIPE_MAIN_INGREDIENTS)
  recipes.value.forEach((r) => (r.ingredients || []).forEach((i) => { if (i) set.add(String(i).trim()) }))
  return [...set].sort((a, b) => a.localeCompare(b))
})

const recipeDishTypeOptions = computed(() => RECIPE_DISH_TYPES)

const wineOptions = computed(() => buildPreferenceOptionsFromWines(wines.value, {}))
const wineTypeOptions = computed(() => wineOptions.value.wineTypes || [])
const wineStyleOptions = computed(() => wineOptions.value.style || [])
const wineFlavorOptions = computed(() => wineOptions.value.flavourProfile || [])
const winePriceOptions = computed(() => wineOptions.value.priceRanges || [])

const filteredResults = computed(() => {
  const q = query.value.toLowerCase()
  const items = mode.value === 'recipe' ? recipes.value : wines.value

  return items.filter((item) => {
    if (mode.value === 'recipe') {
      const matchesQuery = !q || [item.name, ...(item.recipeCategories || []), ...(item.ingredients || [])]
        .filter(Boolean).some((v) => String(v).toLowerCase().includes(q))
      const matchesCategory = !recipeFilters.category ||
        asRecipeCategoryArray(item.recipeCategories).includes(recipeFilters.category)
      const matchesIngredient = !recipeFilters.ingredient ||
        (item.ingredients || []).map((i) => String(i || '').toLowerCase())
          .some((i) => i.includes(recipeFilters.ingredient.toLowerCase()))
      const matchesDishType = !recipeFilters.dishType ||
        String(item.name || '').toLowerCase().includes(recipeFilters.dishType.toLowerCase()) ||
        (item.recipeCategories || []).some((v) => String(v || '').toLowerCase().includes(recipeFilters.dishType.toLowerCase()))
      return matchesQuery && matchesCategory && matchesIngredient && matchesDishType
    }

    const matchesQuery = !q || [item.name, item.type, item.style, ...(item.flavorProfiles || [])]
      .filter(Boolean).some((v) => String(v).toLowerCase().includes(q))
    return matchesQuery &&
      (!wineFilters.type || item.type === wineFilters.type) &&
      (!wineFilters.style || item.style === wineFilters.style) &&
      (!wineFilters.flavor || (item.flavorProfiles || []).includes(wineFilters.flavor)) &&
      (!wineFilters.price || item.priceRange === wineFilters.price)
  })
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredResults.value.length / PAGE_SIZE)))
const paginatedResults = computed(() => {
  const start = (page.value - 1) * PAGE_SIZE
  return filteredResults.value.slice(start, start + PAGE_SIZE)
})

watch([mode, query, () => ({ ...recipeFilters }), () => ({ ...wineFilters })], () => { page.value = 1 })
watch(totalPages, (n) => { if (page.value > n) page.value = n })

function browseDescription(item) {
  if (mode.value === 'recipe') {
    if (item.recipeCategories?.length) return item.recipeCategories.slice(0, 3).join(' • ')
    if (item.ingredients?.length) return item.ingredients.slice(0, 5).join(', ')
    return 'Browse this recipe and open wine pairings from it.'
  }
  const labels = [item.type, item.style, ...(item.flavorProfiles || []).slice(0, 2)].filter(Boolean)
  return labels.length ? labels.join(' • ') : 'Browse this wine and open recipe pairings from it.'
}

function detailsLink(item) {
  return mode.value === 'recipe'
    ? `/recipe/${item._id}?withPairings=1&from=pairing-browser`
    : `/wine/${item._id}?withPairings=1&from=pairing-browser`
}
</script>

<style scoped>
.pager-btn {
  border-radius: 0.65rem;
  border: 1px solid var(--line);
  background: var(--surface);
  color: var(--text-main);
  padding: 0.45rem 0.9rem;
  font-size: 0.875rem;
  font-weight: 600;
  transition: 0.2s ease;
}
.pager-btn:hover:enabled { border-color: var(--wine); color: var(--wine); }
.pager-btn:disabled { cursor: not-allowed; opacity: 0.4; }
</style>
