<template>
  <div class="flex justify-center p-8">
    <div
      class="w-full max-w-5xl bg-gray-900 rounded-2xl shadow-lg p-8 border border-gray-700 text-white"
    >
      <h2 class="text-3xl font-semibold mb-6 text-yellow-100 text-center">Jóváhagyás kezelése</h2>

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
        <PendingWines />
      </div>
      <div v-else-if="activeTab === 'recipes'">
        <PendingRecipes />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import PendingWines from './PendingWines.vue'
import PendingRecipes from './PendingRecipes.vue'
import BaseButton from '../ui/BaseButton.vue'

const activeTab = ref('wines')
</script>
