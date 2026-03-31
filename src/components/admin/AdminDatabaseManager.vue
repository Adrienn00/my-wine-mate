<template>
  <div class="flex justify-center p-8">
    <div
      class="glass-panel w-full max-w-5xl rounded-2xl border border-[var(--line)] p-8 text-[var(--text-main)]"
    >
      <div class="mb-4">
        <BaseButton to="/admin" variant="secondary">Back</BaseButton>
      </div>

      <h2 class="mb-6 text-3xl font-semibold">Database Management</h2>

      <div class="mb-6 flex space-x-4">
        <BaseButton variant="secondary" @click="activeTab = 'wines'">Wines</BaseButton>
        <BaseButton variant="secondary" @click="activeTab = 'recipes'">Recipes</BaseButton>
      </div>
      <div v-if="activeTab === 'wines'">
        <WineManager />
      </div>
      <div v-else-if="activeTab === 'recipes'">
        <RecipeManager />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import WineManager from './WineManager.vue'
import RecipeManager from './RecipeManager.vue'
import BaseButton from '../ui/BaseButton.vue'

const activeTab = ref('wines')
</script>
