<template>
  <PageFrame>
    <div class="page-actions">
      <BaseButton to="/profile" variant="secondary">Back</BaseButton>
    </div>

    <SectionHeader class="px-1" kicker="Collection" title="Your Favorites" />

    <BaseCard rounded="rounded-2xl" padding="p-8">
      <div class="mb-6 flex justify-center gap-4">
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
    </BaseCard>
  </PageFrame>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProfileStore } from '../stores/profileStore'
import BaseButton from '../components/ui/BaseButton.vue'
import PageFrame from '../components/ui/PageFrame.vue'
import BaseCard from '../components/ui/BaseCard.vue'
import SectionHeader from '../components/ui/SectionHeader.vue'

const profileStore = useProfileStore()
const activeTab = ref('wines')

const favoriteWines = computed(() => profileStore.favoriteWines || [])
const favoriteRecipes = computed(() => profileStore.favoriteRecipes || [])

onMounted(async () => {
  await profileStore.fetchProfile()
})
</script>
