<template>
  <NavBar />
  <div class="min-h-screen pt-28 text-[var(--text-main)] md:pt-32">
    <router-view />
  </div>
  <BaseFooter />
</template>

<script setup>
import BaseFooter from '../components/ui/BaseFooter.vue'
import NavBar from '../components/NavBar.vue'
</script>
