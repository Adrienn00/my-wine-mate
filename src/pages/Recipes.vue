<template>
  <PageFrame>
    <BaseCard as="section" class="hero-sheen" rounded="rounded-[1.7rem]" padding="p-5 md:p-7">
      <div class="section-intro px-1">
        <span class="section-kicker">Kitchen</span>
        <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 class="section-title">Recipes</h1>
            <p class="section-summary">
              A warmer editorial look for the recipe library, with richer cards and better visual
              hierarchy.
            </p>
          </div>
          <div class="flex flex-wrap gap-3">
            <span class="dashboard-chip">{{ confirmedRecipes.length }} curated recipes</span>
            <BaseButton v-if="isLoggedIn" variant="primary" to="/addRecipe">New Recipe</BaseButton>
          </div>
        </div>
      </div>
    </BaseCard>

    <BaseCard as="section" rounded="rounded-2xl" padding="p-5 md:p-8">
      <div class="mb-5 flex flex-col gap-3 sm:flex-row">
        <input
          v-model.trim="searchQuery"
          placeholder="Search by name, category, or ingredient..."
          class="w-full rounded-full border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text-main)] outline-none transition placeholder:text-[var(--text-muted)]/60 focus:border-[var(--wine)] focus:ring-2 focus:ring-[rgba(93,31,50,0.14)]"
        />
        <select
          v-model="selectedCategory"
          class="rounded-full border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text-main)] outline-none transition focus:border-[var(--wine)] sm:w-52"
        >
          <option value="">All categories</option>
          <option v-for="cat in categoryOptions" :key="cat" :value="cat">{{ cat }}</option>
        </select>
      </div>

      <div
        v-if="recipesStore.loading"
        class="animate-pulse py-10 text-center font-medium text-[var(--text-main)]"
      >
        Loading recipes...
      </div>

      <p v-else-if="!filteredRecipes.length" class="py-10 text-center text-sm text-[var(--text-muted)]">
        No recipes found.
      </p>

      <ul v-else class="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        <li
          v-for="recipe in paginatedRecipes"
          :key="recipe._id"
          class="group overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--surface)] transition hover:-translate-y-0.5 hover:border-[rgba(93,31,50,0.4)] hover:shadow-[0_12px_28px_rgba(66,31,32,0.12)]"
        >
          <div
            class="relative flex h-52 items-end overflow-hidden bg-[var(--wine)] p-5 text-white"
          >
            <img
              :src="recipeImageFor(recipe)"
              :alt="`${recipe.name} image`"
              class="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.05]"
              loading="lazy"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent"></div>
            <div class="relative w-full rounded-xl bg-black/25 p-4 backdrop-blur-sm">
              <p class="text-xs uppercase tracking-[0.2em] text-[#f4dcb6]">
                {{ recipe.recipeCategories?.[0] || 'Chef Selection' }}
              </p>
              <BaseButton
                variant="simple"
                :to="`/recipe/${recipe._id}`"
                class="mt-2 block px-0 py-0 text-left text-2xl font-semibold text-white hover:bg-transparent hover:text-white"
              >
                {{ recipe.name }}
              </BaseButton>
            </div>
          </div>

          <div class="p-5">
            <div
              v-if="recipe.recipeCategories?.length"
              class="flex flex-wrap gap-2 text-xs font-semibold"
            >
              <span
                v-for="category in recipe.recipeCategories.slice(0, 3)"
                :key="category"
                class="rounded-full bg-[rgba(93,31,50,0.08)] px-2.5 py-1 text-[var(--wine)]"
              >
                {{ category }}
              </span>
            </div>

            <p class="mt-4 line-clamp-3 text-sm leading-6 text-[var(--text-muted)]">
              {{ recipePreview(recipe) }}
            </p>

            <div class="mt-5 flex items-center justify-between gap-3">
              <span class="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
                {{ recipe.ingredients?.length || 0 }} ingredients
              </span>
              <BaseButton :to="`/recipe/${recipe._id}`" variant="secondary">Open Recipe</BaseButton>
            </div>
          </div>
        </li>
      </ul>

      <div
        v-if="!recipesStore.loading && totalPages > 1"
        class="mt-5 flex items-center justify-between gap-4"
      >
        <button class="pager-btn" :disabled="currentPage === 1" @click="currentPage--">
          Previous
        </button>
        <p class="text-sm text-[var(--text-muted)]">{{ currentPage }} / {{ totalPages }} pages</p>
        <button class="pager-btn" :disabled="currentPage === totalPages" @click="currentPage++">
          Next
        </button>
      </div>
    </BaseCard>
  </PageFrame>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import BaseButton from '../components/ui/BaseButton.vue'
import BaseCard from '../components/ui/BaseCard.vue'
import PageFrame from '../components/ui/PageFrame.vue'
import { useRecipesStore } from '../stores/recipesStore'
import { useAuthStore } from '../stores/authStore'
import { recipeImageFor } from '../services/imageFallbacks'

const recipesStore = useRecipesStore()
const authStore = useAuthStore()
const currentPage = ref(1)
const pageSize = 10
const searchQuery = ref('')
const selectedCategory = ref('')

const confirmedRecipes = computed(() => recipesStore.confirmedRecipes || [])
const isLoggedIn = computed(() => !!authStore.token)

const categoryOptions = computed(() => {
  const cats = new Set()
  confirmedRecipes.value.forEach(r =>
    (r.recipeCategories || []).forEach(c => { if (c) cats.add(c) })
  )
  return [...cats].sort()
})

const filteredRecipes = computed(() => {
  const q = searchQuery.value.toLowerCase()
  return confirmedRecipes.value.filter(recipe => {
    if (selectedCategory.value && !(recipe.recipeCategories || []).includes(selectedCategory.value)) return false
    if (!q) return true
    return [recipe.name, ...(recipe.recipeCategories || []), ...(recipe.ingredients || [])]
      .filter(Boolean)
      .some(v => String(v).toLowerCase().includes(q))
  })
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredRecipes.value.length / pageSize)))
const paginatedRecipes = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredRecipes.value.slice(start, start + pageSize)
})

onMounted(() => {
  recipesStore.getAllRecipes()
})

watch([searchQuery, selectedCategory, confirmedRecipes], () => {
  currentPage.value = 1
})

watch(totalPages, (nextTotal) => {
  if (currentPage.value > nextTotal) currentPage.value = nextTotal
})

function recipePreview(recipe) {
  if (Array.isArray(recipe.ingredients) && recipe.ingredients.length) {
    return recipe.ingredients.slice(0, 5).join(', ')
  }
  if (Array.isArray(recipe.instructions) && recipe.instructions.length) {
    return recipe.instructions[0]
  }
  return 'Explore the full preparation steps and pairing ideas inside the recipe details.'
}
</script>

<style scoped>
.pager-btn {
  border-radius: 0.75rem;
  border: 1px solid var(--line);
  background: rgba(255, 251, 246, 0.94);
  color: var(--text-main);
  padding: 0.45rem 0.9rem;
  font-size: 0.875rem;
  transition: 0.2s ease;
}
.pager-btn:hover:enabled { border-color: var(--accent); background: rgba(237, 215, 212, 0.52); }
.pager-btn:disabled { cursor: not-allowed; opacity: 0.45; }
</style>
