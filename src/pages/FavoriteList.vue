<template>
  <div class="flex justify-center p-8">
    <div
      class="glass-panel w-full max-w-5xl rounded-2xl border border-[var(--line)] p-8 text-[var(--text-main)]"
    >
      <div class="mb-4">
        <BaseButton to="/profile" variant="secondary">Back</BaseButton>
      </div>

      <h2 class="mb-6 text-center text-3xl font-semibold">Your Favorites</h2>

      <div class="mb-6 flex justify-center space-x-4">
        <BaseButton
          :variant="activeTab === 'wines' ? 'primary' : 'secondary'"
          @click="activeTab = 'wines'"
        >
          Wines
        </BaseButton>
        <BaseButton
          :variant="activeTab === 'recipes' ? 'primary' : 'secondary'"
          @click="activeTab = 'recipes'"
        >
          Recipes
        </BaseButton>
      </div>

      <div v-if="activeTab === 'wines'">
        <div v-if="favoriteWines && favoriteWines.length">
          <div v-for="wine in favoriteWines" :key="wine._id || wine" class="mb-2 text-center">
            <BaseButton :to="`/wine/${wine._id || wine}?from=favorites`" variant="simple">
              {{ wine.name || 'Open wine details' }}
            </BaseButton>
          </div>
        </div>
        <p v-else class="text-center text-[var(--text-muted)]">You do not have any favorite wines yet.</p>
      </div>

      <div v-else>
        <div v-if="favoriteRecipes && favoriteRecipes.length">
          <div
            v-for="recipe in favoriteRecipes"
            :key="recipe._id || recipe"
            class="mb-2 text-center"
          >
            <BaseButton :to="`/recipe/${recipe._id || recipe}`" variant="simple">
              {{ recipe.name || 'Open recipe' }}
            </BaseButton>
          </div>
        </div>
        <p v-else class="text-center text-[var(--text-muted)]">You do not have any favorite recipes yet.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProfileStore } from '../stores/profileStore'
import BaseButton from '../components/ui/BaseButton.vue'

const profileStore = useProfileStore()
const activeTab = ref('wines')

// Default to empty arrays before the profile finishes loading.
const favoriteWines = computed(() => profileStore.favoriteWines || [])
const favoriteRecipes = computed(() => profileStore.favoriteRecipes || [])

onMounted(async () => {
  await profileStore.fetchProfile()
})
</script>
