<template>
  <div class="page-shell">
    <section class="page-frame page-stack">
      <div class="dashboard-panel hero-sheen rounded-[1.7rem] p-5 md:p-7">
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
              <BaseButton variant="primary" to="/addRecipe">New Recipe</BaseButton>
            </div>
          </div>
        </div>
      </div>

      <section class="dashboard-panel rounded-2xl p-5 md:p-8">

      <div
        v-if="recipesStore.loading"
        class="py-10 text-center animate-pulse font-medium text-[var(--text-main)]"
      >
        Loading recipes...
      </div>

      <ul v-else class="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        <li
          v-for="recipe in paginatedRecipes"
          :key="recipe._id"
          class="group overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--surface)] transition hover:-translate-y-0.5 hover:border-[rgba(93,31,50,0.4)] hover:shadow-[0_12px_28px_rgba(66,31,32,0.12)]"
        >
          <div
            class="flex h-48 items-end bg-[linear-gradient(135deg,rgba(93,31,50,0.92),rgba(199,163,103,0.58))] p-5 text-white"
          >
            <div class="w-full rounded-xl bg-black/20 p-4 backdrop-blur-sm">
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
      </section>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import BaseButton from '../components/ui/BaseButton.vue'
import { useRecipesStore } from '../stores/recipesStore'

const recipesStore = useRecipesStore()
const currentPage = ref(1)
const pageSize = 10

const confirmedRecipes = computed(() => recipesStore.confirmedRecipes || [])
const totalPages = computed(() => Math.max(1, Math.ceil(confirmedRecipes.value.length / pageSize)))
const paginatedRecipes = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return confirmedRecipes.value.slice(start, start + pageSize)
})

// Load recipes when the page opens.
onMounted(() => {
  recipesStore.getAllRecipes()
})

watch(confirmedRecipes, () => {
  currentPage.value = 1
})

watch(totalPages, (nextTotal) => {
  if (currentPage.value > nextTotal) {
    currentPage.value = nextTotal
  }
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

.pager-btn:hover:enabled {
  border-color: var(--accent);
  background: rgba(237, 215, 212, 0.52);
}

.pager-btn:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}
</style>
