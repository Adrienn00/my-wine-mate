<template>
  <NavBar />
  <div class="min-h-screen pt-24 text-[var(--text-main)]">
    <router-view />
  </div>
  <BaseFooter />
</template>

<script setup>
import BaseFooter from '../components/ui/BaseFooter.vue'
import NavBar from '../components/NavBar.vue'
</script>
