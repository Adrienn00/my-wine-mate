<template>
  <NavBar />
  <div class="min-h-screen bg">
    <main class="flex flex-1 justify-start px-6 py-8 max-w-6xl mx-auto w-full">
      <div
        class="flex flex-col mt-6 px-6 text-left bg-gray-800 text-yellow-100 p-6 rounded max-w-md w-full space-y-5"
      >
        <h2 class="text-2xl text-yellow-200 mb-4 font-bold text-center">Kedvenc Boraid</h2>
        <div v-if="favorites.length">
          <div v-for="wine in favorites" :key="wine.name">
            <BaseButton :to="`/wine/${wine.name}`" variant="simple">{{ wine.name }}</BaseButton>
          </div>
        </div>

        <p v-else class="text-gray-400">Nincs még kedvenc borod.</p>
        <BaseButton to="/user" variant="secondary" class="w-50">Vissza a profilomra</BaseButton>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import NavBar from '../components/NavBar.vue'
import { useFavoritesStore } from '../stores/favoritesStore'
import BaseButton from '../components/BaseButton.vue'

const favoritesStore = useFavoritesStore()
const favorites = computed(() => favoritesStore.favorites)
</script>
<style scoped>
.bg {
  background-image: url('/home/adrienn/www/my-wine-mate/src/assets/images/bg.jpg');
  background-size: cover;
}
</style>
