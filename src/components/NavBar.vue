<template>
  <header :class="headerClass">
    <div class="flex min-h-[82px] flex-col lg:flex-row">
      <div
        class="flex items-center justify-between gap-4 border-b border-[rgba(95,40,53,0.12)] bg-[rgba(250,242,230,0.98)] px-5 py-4 lg:min-w-[270px] lg:border-r lg:border-b-0"
      >
        <BaseButton to="/" variant="homepage">MyWineMate</BaseButton>
        <span
          class="hidden rounded-full border border-[var(--line)] bg-white/70 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[var(--wine)] sm:inline-flex"
        >
          Wine & Food
        </span>
      </div>

      <div class="flex-1 bg-[linear-gradient(180deg,#5d1f32_0%,#4a1426_100%)] text-[#f9ead7]">
        <div class="flex flex-col gap-3 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
          <nav class="flex flex-wrap items-center gap-1.5 font-semibold">
            <BaseButton v-if="route.path !== '/'" to="/" variant="navLink">Explore</BaseButton>
            <BaseButton
              v-if="route.path !== '/pairing-assistant'"
              to="/pairing-assistant"
              variant="navLink"
            >
              Sommelier
            </BaseButton>
            <BaseButton v-if="route.path !== '/about'" to="/about" variant="navLink">About</BaseButton>
          </nav>

          <div class="flex flex-wrap items-center gap-2">
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
