<template>
  <header :class="headerClass">
    <div
      class="mx-auto flex max-w-6xl items-center justify-between rounded-[1.6rem] px-4 py-3.5"
    >
      <BaseButton to="/" variant="homepage">MyWineMate</BaseButton>

      <nav class="flex items-center gap-2.5 font-semibold">
        <BaseButton v-if="route.path !== '/'" to="/" variant="navLink">Home</BaseButton>
        <BaseButton v-if="route.path !== '/recipes'" to="/recipes" variant="navLink"
          >Recipes</BaseButton
        >
        <BaseButton v-if="route.path !== '/about'" to="/about" variant="navLink">About</BaseButton>

        <!-- csak azon az oldalakon mutatunk auth gombokat, ahol eddig is -->
        <template v-if="!['/login', '/signup', '/user'].includes(route.path)">
          <!-- ha BE van jelentkezve -->
          <template v-if="isLoggedIn">
            <NotificationDropdown />
            <BaseButton to="/profile" variant="navPrimary">My Profile</BaseButton>
            <BaseButton variant="navAccent" @click="logoutUser">Log Out</BaseButton>
          </template>

          <!-- ha NINCS bejelentkezve -->
          <template v-else>
            <BaseButton to="/login" variant="navAccent">Log In</BaseButton>
            <BaseButton to="/signup" variant="navPrimary">Sign Up</BaseButton>
          </template>
        </template>
      </nav>
    </div>
  </header>
</template>
<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseButton from './ui/BaseButton.vue'
import { useAuthStore } from '@/stores/authStore'
import NotificationDropdown from './NotificationDropdown.vue'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const isNavHidden = ref(false)
const isAtTop = ref(true)
let lastScrollY = 0

// ha van token → bejelentkezett
const isLoggedIn = computed(() => !!auth.token)

const headerClass = computed(() => {
  const topMood = route.path === '/' && isAtTop.value
  return [
    'fixed top-3 left-1/2 z-40 w-[calc(100%-1.5rem)] max-w-6xl -translate-x-1/2 border border-[var(--line)] backdrop-blur-md transition-all duration-300',
    topMood
      ? 'bg-[rgba(255,248,239,0.78)] shadow-[0_18px_42px_rgba(96,54,33,0.18)]'
      : 'bg-[rgba(252,246,238,0.93)] shadow-[0_14px_30px_rgba(96,54,33,0.2)]',
    isNavHidden.value ? '-translate-y-24 opacity-0' : 'translate-y-0 opacity-100',
  ]
})

function onScroll() {
  const currentY = window.scrollY
  isAtTop.value = currentY < 24
  const scrollingDown = currentY > lastScrollY
  isNavHidden.value = currentY > 140 && scrollingDown
  lastScrollY = currentY
}

onMounted(() => {
  lastScrollY = window.scrollY
  window.addEventListener('scroll', onScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
})

// Log out and redirect to the home page.
function logoutUser() {
  auth.logout()
  router.push('/')
}
</script>
