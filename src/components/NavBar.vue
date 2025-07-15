<template>
  <header class="bg-gray-800 p-4">
    <div class="max-w-6xl mx-auto flex justify-between items-center">
      <h1 class="text-2xl font-playfair text-yellow-100 font-bold">MyWineMate</h1>
      <nav class="space-x-4 font-bold">
        <BaseButton v-if="route.path !== '/'" to="/" variant="simple">Kezdőlap</BaseButton>
        <BaseButton v-if="route.path !== '/recipes'" to="/recipes" variant="simple"
          >Receptek</BaseButton
        >
        <BaseButton v-if="route.path !== '/about'" to="/about" variant="simple">Rólunk</BaseButton>
        <template
          v-if="route.path !== '/login' && route.path !== '/signup' && route.path !== '/user'"
        >
          <BaseButton to="/profile/user" variant="login">Profilom</BaseButton>
          <BaseButton to="/login" variant="login">Bejelentkezés</BaseButton>
          <BaseButton to="/signup" variant="login">Regisztráció</BaseButton>
        </template>
      </nav>
    </div>
  </header>
</template>
<script setup>
import { useRoute } from 'vue-router'
import BaseButton from './BaseButton.vue'
const route = useRoute()
</script>
