<template>
  <NavBar />
  <div class="min-h-screen bg-black text-white">
    <router-view />
  </div>
  <BaseFooter />
</template>

<script setup>
import BaseFooter from '../components/ui/BaseFooter.vue'
import NavBar from '../components/NavBar.vue'
</script>
