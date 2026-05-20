<template>
  <div class="mx-auto flex min-h-screen max-w-7xl gap-5 px-4 py-6 text-[var(--text-main)] md:px-6">
    <aside
      class="dashboard-panel paper-grid hidden w-72 flex-col justify-between rounded-[1.6rem] p-6 lg:flex"
    >
      <div>
        <p class="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--wine)]">
          Account Center
        </p>
        <h2 class="mb-8 text-3xl font-semibold">Profile</h2>
        <ul class="space-y-4">
          <li><BaseButton to="/" variant="simpleRose">Back to Dashboard</BaseButton></li>
          <li><BaseButton to="/profile" variant="simpleRose">Account Details</BaseButton></li>
          <li><BaseButton to="/preferences" variant="simpleRose">Preferences</BaseButton></li>

          <li v-if="authStore.user?.isAdmin">
            <BaseButton to="/admin" variant="simpleRose">Admin</BaseButton>
          </li>
        </ul>
      </div>

      <BaseButton variant="secondary" @click="logoutUser">Log Out</BaseButton>
    </aside>

    <main class="min-h-screen flex-1 pb-6 lg:pt-4">
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
