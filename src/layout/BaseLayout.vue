<template>
  <div class="min-h-screen bg-black text-white">
    <router-view />
    <BaseFooter />
  </div>
</template>

<script setup>
import BaseFooter from '../components/BaseFooter.vue'
</script>
