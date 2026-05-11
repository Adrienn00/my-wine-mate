<template>
  <div class="app-canvas">
    <div class="app-shell">
      <NavBar />
      <div class="min-h-screen text-[var(--text-main)]">
        <router-view />
      </div>
    </div>
    <BaseFooter />
  </div>
</template>

<script setup>
import BaseFooter from '../components/ui/BaseFooter.vue'
import NavBar from '../components/NavBar.vue'
</script>
