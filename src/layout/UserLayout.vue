<template>
  <div class="flex min-h-screen text-yellow-100 font-bold">
    <aside class="w-64 bg-gray-900 p-6 flex flex-col justify-between">
      <div>
        <h2 class="text-2xl font-bold mb-8">Profil</h2>
        <ul class="space-y-4">
          <li><BaseButton to="/profile" variant="simpleRose">Felhasználó</BaseButton></li>
          <li><BaseButton to="/favorite" variant="simpleRose">Kedvencek</BaseButton></li>
          <li><BaseButton to="/preferences" variant="simpleRose">Bor preferenciák</BaseButton></li>
          <li><BaseButton to="/recommended" variant="simpleRose">Ajánlások</BaseButton></li>
        </ul>
      </div>
      <BaseButton variant="login">Kijelentkezés</BaseButton>
    </aside>
    <main class="flex-1 p-10 bg-red-900">
      <router-view />
    </main>
  </div>
</template>
<script setup>
import BaseButton from '@/components/ui/BaseButton.vue'
</script>
