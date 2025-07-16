<template>
  <main class="flex flex-1 justify-start px-6 py-8 max-w-6xl mx-auto w-full">
    <div
      class="flex flex-col mt-6 text-left bg-gray-800 text-yellow-100 p-6 rounded max-w-md w-full space-y-5"
    >
      <h2 class="text-2xl text-yellow-200 mb-4 font-bold text-center">Kedvenc Boraid</h2>
      <div v-if="favorites.length">
        <div v-for="wine in favorites" :key="wine.name">
          <BaseButton :to="`/wine/${wine.name}`" variant="simple">{{ wine.name }}</BaseButton>
        </div>
      </div>

      <p v-else class="text-gray-400">Nincs még kedvenc borod.</p>
    </div>
  </main>
</template>

<script setup>
import { computed } from 'vue'
import { useProfileStore } from '../stores/profileStore'
import BaseButton from '../components/ui/BaseButton.vue'

const favoritesStore = useProfileStore()
const favorites = computed(() => favoritesStore.favorites)
</script>
<style scoped>
.bg {
  background-image: url('/home/adrienn/www/my-wine-mate/src/assets/images/bg.jpg');
  background-size: cover;
}
</style>
