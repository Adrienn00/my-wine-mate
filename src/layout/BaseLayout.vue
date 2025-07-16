<template>
  <div class="min-h-screen bg-black text-white">
    <router-view />
  </div>
  <BaseFooter />
</template>

<script setup>
import BaseFooter from '../components/BaseFooter.vue'
</script>
