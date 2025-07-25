<template>
  <div class="p-6">
    <h2 class="text-2xl font-semibold text-yellow-100 mb-6 text-center">Ajánlott borok számodra</h2>

    <div
      v-if="recommendedWines.length"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <div
        v-for="(wine, index) in recommendedWines"
        :key="index"
        class="bg-gray-800 text-white p-4 rounded-lg shadow-md border border-gray-400"
      >
        <BaseButton :to="`/wine/${wine.name}?from=recommended`" variant="simple">{{
          wine.name
        }}</BaseButton>
      </div>
    </div>

    <div v-else class="text-white text-center mt-4">
      <p>Nincs elérhető ajánlás a megadott preferenciák alapján.</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useProfileStore } from '../stores/profileStore'
import BaseButton from '../components/ui/BaseButton.vue'

const profileStore = useProfileStore()

const recommendedWines = computed(() => profileStore.recommendedWines)
</script>

<style scoped>
.bg {
  background-image: url('/home/adrienn/www/my-wine-mate/src/assets/images/bg.jpg');
  background-size: cover;
}
</style>
