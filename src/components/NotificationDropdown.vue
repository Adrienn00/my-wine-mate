<template>
  <div class="relative inline-block">
    <button
      class="cursor-pointer rounded-lg border border-[var(--line)] bg-[rgba(255,248,239,0.88)] px-3 py-1.5 text-xl shadow-[0_8px_20px_rgba(122,32,56,0.14)]"
      @click="toggleNotifications"
    >
      🔔
      <span
        v-if="unreadNotifications > 0"
        class="absolute -right-2 -top-2 rounded-full bg-[var(--danger)] px-2 text-xs text-white"
      >
        {{ unreadNotifications }}
      </span>
    </button>

    <div
      v-if="showNotifications"
      class="glass-panel absolute right-0 z-50 mt-2 w-80 rounded-xl p-3 shadow-lg"
    >
      <div class="mb-2 font-semibold text-[var(--text-main)]">Értesítések</div>

      <div v-if="profileStore.notifications.length === 0" class="text-sm text-[var(--text-muted)]">
        Nincs értesítés
      </div>

      <div
        v-for="n in profileStore.notifications"
        :key="n._id"
        class="flex items-center justify-between border-b border-[var(--line)] py-2 text-sm text-[var(--text-main)]"
      >
        <span>{{ n.message }}</span>

        <button
          class="ml-2 text-xs text-[var(--danger)] hover:brightness-125"
          @click="deleteNotification(n._id)"
        >
          ✕
        </button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, ref } from 'vue'
import client from '@/components/httpService/client'
import { useProfileStore } from '@/stores/profileStore'

const profileStore = useProfileStore()
const showNotifications = ref(false)

const unreadNotifications = computed(() => profileStore.notifications.length)

async function toggleNotifications() {
  showNotifications.value = !showNotifications.value

  if (showNotifications.value) {
    await profileStore.fetchProfile()
  }
}

async function deleteNotification(id) {
  try {
    await client.delete(`users/notifications/${id}`)

    profileStore.notifications = profileStore.notifications.filter((n) => n._id !== id)
  } catch (error) {
    console.error('Notification delete error:', error)
  }
}
</script>
