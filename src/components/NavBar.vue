<template>
  <header class="bg-gray-800 p-4">
    <div class="max-w-6xl mx-auto flex justify-between items-center">
      <BaseButton to="/" variant="homepage">MyWineMate</BaseButton>

      <nav class="space-x-4 font-bold">
        <BaseButton v-if="route.path !== '/'" to="/" variant="simple">Kezdőlap</BaseButton>
        <BaseButton v-if="route.path !== '/recipes'" to="/recipes" variant="simple"
          >Receptek</BaseButton
        >
        <BaseButton v-if="route.path !== '/about'" to="/about" variant="simple">Rólunk</BaseButton>

        <!-- csak azon az oldalakon mutatunk auth gombokat, ahol eddig is -->
        <template v-if="!['/login', '/signup', '/user'].includes(route.path)">
          <!-- ha BE van jelentkezve -->
          <template v-if="isLoggedIn">
            <NotificationDropdown />

            <BaseButton to="/profile" variant="login">Profilom</BaseButton>
            <BaseButton variant="login" @click="logoutUser">Kijelentkezés</BaseButton>
          </template>

          <!-- ha NINCS bejelentkezve -->
          <template v-else>
            <BaseButton to="/login" variant="login">Bejelentkezés</BaseButton>
            <BaseButton to="/signup" variant="login">Regisztráció</BaseButton>
          </template>
        </template>
      </nav>
    </div>
  </header>
</template>
<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseButton from './ui/BaseButton.vue'
import { useAuthStore } from '@/stores/authStore'
import { useProfileStore } from '@/stores/profileStore'
import NotificationDropdown from './NotificationDropdown.vue'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const profileStore = useProfileStore()

const showNotifications = ref(false)

// ha van token → bejelentkezett
const isLoggedIn = computed(() => !!auth.token)

// olvasatlan értesítések száma
const unreadNotifications = computed(() => profileStore.notifications.filter((n) => !n.read).length)

function toggleNotifications() {
  showNotifications.value = !showNotifications.value
}

// kijelentkezés + visszairányítás
function logoutUser() {
  auth.logout()
  router.push('/')
}
</script>
