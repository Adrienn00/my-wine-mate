<template>
  <div class="p-6">
    <h2 class="text-2xl font-semibold text-yellow-100 mb-6 text-center">Kedvenc Boraid</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-if="favorites.length">
        <div
          v-for="wine in favorites"
          :key="wine.name"
          class="bg-gray-800 text-white p-4 rounded-lg shadow-md border border-gray-400"
        >
          <BaseButton :to="`/wine/${wine.name}?from=favorites`" variant="simple">{{
            wine.name
          }}</BaseButton>
        </div>
      </div>

      <p v-else class="text-white text-center mt-4">Nincs még kedvenc borod.</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useProfileStore } from '../stores/profileStore'
import BaseButton from '../components/ui/BaseButton.vue'

const favoritesStore = useProfileStore()
const favorites = computed(() => favoritesStore.favorites)
</script>
