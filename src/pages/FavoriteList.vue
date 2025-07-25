<template>
  <div class="flex justify-center p-8">
    <div
      class="w-full max-w-5xl bg-gray-900 rounded-2xl shadow-lg p-8 border border-gray-700 text-white"
    >
      <h2 class="text-3xl font-semibold mb-6 text-yellow-100 text-center">Kedvenceid</h2>

      <div class="flex space-x-4 mb-6 justify-center">
        <BaseButton
          :variant="activeTab === 'wines' ? 'primary' : 'secondary'"
          @click="activeTab = 'wines'"
        >
          Borok
        </BaseButton>
        <BaseButton
          :variant="activeTab === 'recipes' ? 'primary' : 'secondary'"
          @click="activeTab = 'recipes'"
        >
          Receptek
        </BaseButton>
      </div>

      <div v-if="activeTab === 'wines'">
        <div v-if="favoriteWines.length">
          <div v-for="wine in favoriteWines" :key="wine.id" class="mb-2 text-center">
            <BaseButton :to="`/wine/${wine.id}`" variant="simple">
              {{ wine.name }}
            </BaseButton>
          </div>
        </div>
        <p v-else class="text-gray-400 text-center">Nincs még kedvenc borod.</p>
      </div>

      <div v-else>
        <div v-if="favoriteRecipes.length">
          <div v-for="recipe in favoriteRecipes" :key="recipe.id" class="mb-2 text-center">
            <BaseButton :to="`/recipe/${recipe.id}`" variant="simple">
              {{ recipe.name }}
            </BaseButton>
          </div>
        </div>
        <p v-else class="text-gray-400 text-center">Nincs még kedvenc recepted.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useProfileStore } from '../stores/profileStore'
import BaseButton from '../components/ui/BaseButton.vue'

const profileStore = useProfileStore()
const activeTab = ref('wines')

const favoriteWines = computed(() => profileStore.favoriteWines)
const favoriteRecipes = computed(() => profileStore.favoriteRecipes)
</script>
