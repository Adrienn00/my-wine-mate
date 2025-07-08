<template>
<header class="bg-gray-800 p-4">
    <div class="max-w-6xl mx-auto flex justify-between items-center">
      <h1 class="text-2xl font-playfair text-yellow-100">MyWineMate</h1>
      <nav class="space-x-4">
        <router-link v-if="route.path !== '/'" to="/" class="hover:underline text-yellow-100">Kezdőlap</router-link>
        <router-link v-if="route.path !== '/about'" to="/about" class="hover:underline text-yellow-100">Rólunk</router-link>
        <router-link to="/login" class="hover:bg-red-800 text-yellow-100 border-2 border-red-900 bg-red-900 rounded-xl p-2">Bejelentkezés</router-link>
        <router-link to="/signup" class="hover:bg-red-800 text-yellow-100 border-2 border-red-900 bg-red-900 rounded-xl p-2">Regisztráció</router-link>
      </nav>
    </div>
  </header>
</template>
<script setup>
import { useRoute } from 'vue-router';
const route = useRoute();
</script>