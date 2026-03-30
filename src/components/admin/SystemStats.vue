<template>
  <div class="max-w-6xl mx-auto px-4">
    <div class="mb-4">
      <BaseButton to="/admin" variant="secondary">Vissza</BaseButton>
    </div>

    <div
      class="mb-10 text-center text-4xl font-extrabold text-[var(--text-main)] underline underline-offset-8"
    >
      Rendszerstatisztika
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="glass-panel rounded-xl border border-[var(--line)] p-6 text-center shadow-sm">
        <div class="text-3xl font-bold text-[var(--wine)]">
          {{ adminStore.stats?.usersCount }}
        </div>
        <div class="mt-2 text-[var(--text-muted)]">Felhasználók</div>
      </div>

      <div class="glass-panel rounded-xl border border-[var(--line)] p-6 text-center shadow-sm">
        <div class="text-3xl font-bold text-[var(--wine)]">
          {{ adminStore.stats?.winesCount }}
        </div>
        <div class="mt-2 text-[var(--text-muted)]">Borok</div>
      </div>

      <div class="glass-panel rounded-xl border border-[var(--line)] p-6 text-center shadow-sm">
        <div class="text-3xl font-bold text-[var(--wine)]">
          {{ adminStore.stats?.confirmedWinesCount }}
        </div>
        <div class="mt-2 text-[var(--text-muted)]">Jóváhagyott borok</div>
      </div>

      <div class="glass-panel rounded-xl border border-[var(--line)] p-6 text-center shadow-sm">
        <div class="text-3xl font-bold text-[var(--wine)]">
          {{ adminStore.stats?.pendingWinesCount }}
        </div>
        <div class="mt-2 text-[var(--text-muted)]">Jóváhagyásra vár</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAdminStore } from '@/stores/adminStore'
import BaseButton from '../ui/BaseButton.vue'

const adminStore = useAdminStore()

onMounted(() => {
  adminStore.fetchStats()
})
</script>
