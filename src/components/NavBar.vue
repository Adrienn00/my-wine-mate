<template>
  <header :class="headerClass">
    <!-- Desktop layout: side-by-side logo | nav -->
    <div class="hidden min-h-[82px] lg:flex">
      <div
        class="flex items-center justify-between gap-4 border-r border-[rgba(95,40,53,0.12)] bg-[rgba(250,242,230,0.98)] px-5 py-4 lg:min-w-[270px]"
      >
        <BaseButton to="/" variant="homepage">MyWineMate</BaseButton>
        <span class="hidden rounded-full border border-[var(--line)] bg-white/70 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[var(--wine)] sm:inline-flex">
          Wine &amp; Food
        </span>
      </div>
      <div class="flex flex-1 items-center justify-between bg-[linear-gradient(180deg,#5d1f32_0%,#4a1426_100%)] px-5 text-[#f9ead7]">
        <nav class="flex flex-wrap items-center gap-1.5 font-semibold">
          <BaseButton v-if="route.path !== '/'" to="/" variant="navLink">Explore</BaseButton>
          <BaseButton v-if="route.path !== '/wines'" to="/wines" variant="navLink">Wines</BaseButton>
          <BaseButton v-if="route.path !== '/recipes'" to="/recipes" variant="navLink">Recipes</BaseButton>
          <BaseButton v-if="route.path !== '/pairing-assistant'" to="/pairing-assistant" variant="navLink">Sommelier</BaseButton>
          <BaseButton v-if="isLoggedIn && route.path !== '/social'" to="/social" variant="navLink">Social</BaseButton>
          <BaseButton v-if="route.path !== '/about'" to="/about" variant="navLink">About</BaseButton>
        </nav>
        <div class="flex items-center gap-2">
          <template v-if="!['/login', '/signup', '/user'].includes(route.path)">
            <template v-if="isLoggedIn">
              <NotificationDropdown />
              <BaseButton variant="navPrimary" @click="logoutUser">Log Out</BaseButton>
            </template>
            <template v-else>
              <BaseButton to="/login" variant="navAccent">Log In</BaseButton>
              <BaseButton to="/signup" variant="navPrimary">Sign Up</BaseButton>
            </template>
          </template>
        </div>
      </div>
    </div>

    <!-- Mobile layout: logo row + scrollable nav row -->
    <div class="lg:hidden">
      <div class="flex items-center justify-between bg-[rgba(250,242,230,0.98)] px-4 py-3">
        <BaseButton to="/" variant="homepage">MyWineMate</BaseButton>
        <div class="flex items-center gap-2">
          <template v-if="!['/login', '/signup', '/user'].includes(route.path)">
            <template v-if="isLoggedIn">
              <NotificationDropdown />
              <BaseButton variant="navPrimary" @click="logoutUser">Log Out</BaseButton>
            </template>
            <template v-else>
              <BaseButton to="/login" variant="navAccent">Log In</BaseButton>
              <BaseButton to="/signup" variant="navPrimary">Sign Up</BaseButton>
            </template>
          </template>
        </div>
      </div>
      <nav class="mobile-nav-strip">
        <BaseButton v-if="route.path !== '/'" to="/" variant="navLink">Explore</BaseButton>
        <BaseButton v-if="route.path !== '/wines'" to="/wines" variant="navLink">Wines</BaseButton>
        <BaseButton v-if="route.path !== '/recipes'" to="/recipes" variant="navLink">Recipes</BaseButton>
        <BaseButton v-if="route.path !== '/pairing-assistant'" to="/pairing-assistant" variant="navLink">Sommelier</BaseButton>
        <BaseButton v-if="isLoggedIn && route.path !== '/social'" to="/social" variant="navLink">Social</BaseButton>
        <BaseButton v-if="route.path !== '/about'" to="/about" variant="navLink">About</BaseButton>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseButton from './ui/BaseButton.vue'
import { useAuthStore } from '@/stores/authStore'
import NotificationDropdown from './NotificationDropdown.vue'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const isLoggedIn = computed(() => !!auth.token)
const headerClass = computed(() => 'sticky top-0 z-40 border-b border-[rgba(95,40,53,0.12)] backdrop-blur-sm')

function logoutUser() {
  auth.logout()
  router.push('/')
}
</script>

<style scoped>
.mobile-nav-strip {
  display: flex;
  gap: 0.4rem;
  overflow-x: auto;
  padding: 0.5rem 1rem;
  background: linear-gradient(180deg, #5d1f32 0%, #4a1426 100%);
  color: #f9ead7;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
}
.mobile-nav-strip::-webkit-scrollbar {
  display: none;
}
</style>
