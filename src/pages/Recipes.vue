<template>
  <div class="min-h-screen px-4 py-8 md:px-8 md:py-12">
    <section class="glass-panel mx-auto max-w-5xl rounded-2xl p-5 md:p-8">
      <div class="mb-5 flex items-center justify-between">
        <h1 class="text-3xl font-semibold md:text-4xl">Receptek 🍷</h1>
        <BaseButton variant="primary" to="/addRecipe">Új recept</BaseButton>
      </div>

      <div
        v-if="recipesStore.loading"
        class="py-10 text-center animate-pulse font-medium text-[var(--text-main)]"
      >
        Receptek betöltése...
      </div>

      <ul v-else class="grid grid-cols-1 gap-3 md:grid-cols-2">
        <li
          v-for="recipe in paginatedRecipes"
          :key="recipe._id"
          class="rounded-xl border border-[var(--line)] bg-[rgba(255,248,239,0.84)] p-4 transition hover:-translate-y-0.5 hover:border-[rgba(202,163,103,0.55)] hover:shadow-[0_12px_24px_rgba(122,32,56,0.14)]"
        >
          <BaseButton
            variant="simple"
            :to="`/recipe/${recipe._id}`"
            class="block text-lg font-semibold"
          >
            {{ recipe.name }}
          </BaseButton>
        </li>
      </ul>

      <div
        v-if="!recipesStore.loading && totalPages > 1"
        class="mt-5 flex items-center justify-between gap-4"
      >
        <button class="pager-btn" :disabled="currentPage === 1" @click="currentPage--">
          Előző
        </button>
        <p class="text-sm text-[var(--text-muted)]">{{ currentPage }} / {{ totalPages }} oldal</p>
        <button class="pager-btn" :disabled="currentPage === totalPages" @click="currentPage++">
          Következő
        </button>
      </div>
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

// JAVÍTÁS: Amikor az oldal betölt, meghívjuk a backend lekérést
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
