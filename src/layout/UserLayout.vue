<template>
  <div class="flex min-h-screen text-[var(--text-main)]">
    <aside class="glass-panel m-4 hidden w-72 flex-col justify-between rounded-2xl p-6 lg:flex">
      <div>
        <h2 class="mb-8 text-2xl font-semibold">Profil</h2>
        <ul class="space-y-4">
          <li><BaseButton to="/profile" variant="simpleRose">Felhasználó</BaseButton></li>
          <li><BaseButton to="/favorite" variant="simpleRose">Kedvencek</BaseButton></li>
          <li><BaseButton to="/preferences" variant="simpleRose">Bor preferenciák</BaseButton></li>
          <li><BaseButton to="/recommended" variant="simpleRose">Ajánlások</BaseButton></li>

          <li v-if="authStore.user?.isAdmin">
            <BaseButton to="/admin" variant="simpleRose">Admin</BaseButton>
          </li>
        </ul>
      </div>

      <BaseButton variant="secondary" @click="logoutUser">Kijelentkezés</BaseButton>
    </aside>

    <main class="min-h-screen flex-1 p-4 lg:p-10">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import BaseButton from '@/components/ui/BaseButton.vue'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

function logoutUser() {
  authStore.logout()
  router.push('/')
}
</script>
