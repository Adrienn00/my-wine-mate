<template>
  <div class="flex justify-center p-8">
    <div
      class="glass-panel w-full max-w-5xl rounded-2xl border border-[var(--line)] p-8 text-[var(--text-main)]"
    >
      <div class="mb-4">
        <BaseButton to="/admin" variant="secondary">Back</BaseButton>
      </div>

      <h2 class="mb-6 text-center text-3xl font-semibold">Approval Management</h2>

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
